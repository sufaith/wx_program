const image = {}

image.getObjectURL = function (file) {
  // 获取图片url
  let URL = window.URL || window.webkitURL || window.mozURL
  let url = URL.createObjectURL(file)
  return url
}
image.base64Img2Blog = function (base64Str) {
  // base64编码转Blob对象
  // 将编码字符串通过';base64'分割开，前半部分是文件类型，后半部分是编码内容
  let parts = base64Str.split(';base64,')
  // 将'data:'去除，保存为contentType
  let contentType = parts[0].split(':')[1]
  // 使用atob方法解码base64
  let raw = window.atob(parts[1])
  let rawLength = raw.length
  // 创建一个存储解码后数据的数组
  let uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

image.upload = function (options) {
  // 上传
  const { data, file, filename, url, onProgress, onError, onSuccess } = options
  let formData = new FormData()
  let xhr = new XMLHttpRequest()
  // 文本参数
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  // file文件
  formData.append('file', file, filename)
  xhr.onreadystatechange = function () {
    // 响应状态
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const ret = xhr.responseText
        onSuccess(file, ret)
      } else {
        onError(file, new Error('XMLHttpRequest response status is ' + xhr.status))
      }
    }
  }
  xhr.upload.addEventListener(
    'progress',
    function (evt) {
      // 上传进度
      if (evt.total === 0) return
      const percent = Math.ceil(evt.loaded / evt.total) * 100
      onProgress(file, percent)
    },
    false
  )
  xhr.open('POST', url)
  xhr.send(formData)
}

// 将File（Blob）对象转变为一个dataURL字符串， 即base64格式
image.fileToDataURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })

// 将dataURL字符串转变为image对象，即base64转img对象
image.dataURLToImage = (dataURL) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = dataURL
  })

// 将一个canvas对象转变为一个File（Blob）对象
image.canvastoFile = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))

image.compress = (originfile, maxSize) =>
  new Promise(async (resolve, reject) => {
    const originSize = originfile.size / 1024 // 单位为kb
    console.log('图片指定最大尺寸为', maxSize, '原始尺寸为：', originSize)

    // 将原图片转换成base64
    const base64 = await image.fileToDataURL(originfile)
    // 缩放图片需要的canvas
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    // 小于maxSize，则不需要压缩，直接返回
    if (originSize < maxSize) {
      resolve({ compressFile: originfile, compressBase64: base64 })
      console.log(`图片小于指定大小:${maxSize}KB，不用压缩`)
      return
    }

    const img = await image.dataURLToImage(base64)

    const scale = 1
    const originWidth = img.width
    const originHeight = img.height
    const targetWidth = originWidth * scale
    const targetHeight = originHeight * scale

    canvas.width = targetWidth
    canvas.height = targetHeight
    context.clearRect(0, 0, targetWidth, targetHeight)
    context.drawImage(img, 0, 0, targetWidth, targetHeight)

    // 将Canvas对象转变为dataURL字符串，即压缩后图片的base64格式
    // const compressedBase64 = canvas.toDataURL('image/jpeg', 0.1);
    // 经过我的对比，通过scale控制图片的拉伸来压缩图片，能够压缩jpg，png等格式的图片
    // 通过canvastoFile方法传递quality来压缩图片，只能压缩jpeg类型的图片，png等格式不支持
    // scale的压缩效果没有canvastoFile好
    // 在压缩到指定大小时，通过scale压缩的图片比通过quality压缩的图片模糊的多
    // 压缩的思路，用二分法找最佳的压缩点
    // 这里为了规避浮点数计算的弊端，将quality转为整数再计算;
    // const preQuality = 100;
    const maxQualitySize = { quality: 100, size: Number.MAX_SAFE_INTEGER }
    const minQualitySize = { quality: 0, size: 0 }
    let quality = 100
    let count = 0 // 压缩次数
    let compressFinish = false // 压缩完成
    let invalidDesc = ''
    let compressBlob = null

    // 二分法最多尝试8次即可覆盖全部可能
    while (!compressFinish && count < 12) {
      compressBlob = await image.canvastoFile(canvas, 'image/jpeg', quality / 100)
      const compressSize = compressBlob.size / 1024
      count++
      if (compressSize === maxSize) {
        console.log(`压缩完成，总共压缩了${count}次`)
        compressFinish = true
        return
      }
      if (compressSize > maxSize) {
        maxQualitySize.quality = quality
        maxQualitySize.size = compressSize
      }
      if (compressSize < maxSize) {
        minQualitySize.quality = quality
        minQualitySize.size = compressSize
      }
      console.log(`第${count}次压缩,压缩后大小${compressSize},quality参数:${quality}`)

      quality = Math.ceil((maxQualitySize.quality + minQualitySize.quality) / 2)

      if (maxQualitySize.quality - minQualitySize.quality < 2) {
        if (!minQualitySize.size && quality) {
          quality = minQualitySize.quality
        } else if (!minQualitySize.size && !quality) {
          compressFinish = true
          invalidDesc = '压缩失败，无法压缩到指定大小'
          console.log(`压缩完成，总共压缩了${count}次`)
        } else if (minQualitySize.size > maxSize) {
          compressFinish = true
          invalidDesc = '压缩失败，无法压缩到指定大小'
          console.log(`压缩完成，总共压缩了${count}次`)
        } else {
          console.log(`压缩完成，总共压缩了${count}次`)
          compressFinish = true
          quality = minQualitySize.quality
        }
      }
    }

    if (invalidDesc) {
      // 压缩失败，则返回原始图片的信息
      console.log(`压缩失败，无法压缩到指定大小：${maxSize}KB`)
      reject({ compressFile: originfile, compressBase64: base64, msg: invalidDesc })
      return
    }

    compressBlob = await image.canvastoFile(canvas, 'image/jpeg', quality / 100)
    const compressSize = compressBlob.size / 1024
    console.log(`最后一次压缩（即第${count + 1}次），quality为:${quality}，大小：${compressSize}`)
    const compressedBase64 = await image.fileToDataURL(compressBlob)

    const compressedFile = new File([compressBlob], originfile.name, { type: 'image/jpeg' })

    resolve({ compressFile: compressedFile, compressBase64: compressedBase64 })
  })

image.compress2 = function (img, Orientation) {
  // 图片压缩
  // alert('图片的朝向' + Orientation)
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  // 瓦片canvas
  let tCanvas = document.createElement('canvas')
  let tctx = tCanvas.getContext('2d')
  let initSize = img.src.length
  let width = img.width
  let height = img.height

  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  let ratio
  if ((ratio = (width * height) / 4000000) > 1) {
    console.log('大于400万像素')
    ratio = Math.sqrt(ratio)
    width /= ratio
    height /= ratio
  } else {
    ratio = 1
  }
  canvas.width = width
  canvas.height = height
  // 铺底色
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // 如果图片像素大于100万则使用瓦片绘制
  let count
  if ((count = (width * height) / 1000000) > 1) {
    count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
    // 计算每块瓦片的宽和高
    let nw = ~~(width / count)
    let nh = ~~(height / count)
    tCanvas.width = nw
    tCanvas.height = nh
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height)
  }
  // 修复ios上传图片的时候 被旋转的问题
  if (Orientation && Orientation !== '' && Orientation !== 1) {
    switch (Orientation) {
      case 6: // 需要顺时针（向左）90度旋转
        image.rotateImg(img, 'left', canvas)
        break
      case 8: // 需要逆时针（向右）90度旋转
        image.rotateImg(img, 'right', canvas)
        break
      case 3: // 需要180度旋转
        image.rotateImg(img, 'right', canvas) // 转两次
        image.rotateImg(img, 'right', canvas)
        break
    }
  }
  // 设置jpegs图片的质量
  let ndata = canvas.toDataURL('image/jpeg', 1)
  console.log(`压缩前：${initSize}`)
  console.log(`压缩后：${ndata.length}`)
  console.log(`压缩率：${~~((100 * (initSize - ndata.length)) / initSize)}%`)
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
  return ndata
}

image.rotateImg = function (img, direction, canvas) {
  // 图片旋转
  // 最小与最大旋转方向，图片旋转4次后回到原方向
  const minStep = 0
  const maxStep = 3
  if (img == null) return
  // img的高度和宽度不能在img元素隐藏后获取，否则会出错
  let height = img.height
  let width = img.width
  let step = 2
  if (step == null) {
    step = minStep
  }
  if (direction === 'right') {
    step++
    // 旋转到原位置，即超过最大值
    step > maxStep && (step = minStep)
  } else {
    step--
    step < minStep && (step = maxStep)
  }
  // 旋转角度以弧度值为参数
  let degree = (step * 90 * Math.PI) / 180
  let ctx = canvas.getContext('2d')
  switch (step) {
    case 0:
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0)
      break
    case 1:
      canvas.width = height
      canvas.height = width
      ctx.rotate(degree)
      ctx.drawImage(img, 0, -height)
      break
    case 2:
      canvas.width = width
      canvas.height = height
      ctx.rotate(degree)
      ctx.drawImage(img, -width, -height)
      break
    case 3:
      canvas.width = height
      canvas.height = width
      ctx.rotate(degree)
      ctx.drawImage(img, -width, 0)
      break
  }
}

image.convertUrlToBase64 = function (imgUrl) {
  return new Promise(function (resolve, reject) {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imgUrl
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const startIndex = imgUrl.lastIndexOf('.')
      let ext = 'png'
      if (startIndex > -1) {
        const x = imgUrl.substring(startIndex + 1).toLowerCase()
        const arr = ['png', 'jpg', 'jpeg', 'gif']
        if (arr.indexOf(x) > -1) {
          ext = x
        }
      }
      let type = ext === 'jpg' ? 'image/jpeg' : 'image/png'
      const dataURL = canvas.toDataURL(type)
      const base64 = {
        dataURL: dataURL,
        type: type,
        ext: ext,
      }
      resolve(base64)
    }
  })
}

export default image
