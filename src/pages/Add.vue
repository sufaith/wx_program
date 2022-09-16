<script setup>
import {
  getCurrentInstance,
  reactive,
} from 'vue'
import {
  useMessage,
} from 'naive-ui'

const { proxy } = getCurrentInstance()
const message = useMessage()

const URL = proxy.$url
const Api = proxy.$http

const state = reactive({
  showLoading: false,
  loadingText: '',
  name: '',
  avatar: '',
  validTime: '',
  phone: '',
  remainTime: '',
  otherInfo: '',
  cardNo: '',
  num: '',
  qrcodeImg: '',
})

async function handleClickSave() {
  if (state.showLoading) return
  try {
    if (!state.name) {
      showWarnMsg('请输入姓名')
      return
    }
    if (!checkChineseName(state.name)) {
      return
    }
    if (!state.cardNo) {
      showWarnMsg('请输入卡号')
      return
    }
    if (state.cardNo.length < 12) {
      showWarnMsg('卡号需为12位')
      return
    }
    if (!state.num) {
      showWarnMsg('请输入序列号')
      return
    }
    if (!state.phone) {
      showWarnMsg('请输入手机号')
      return
    }
    if (state.phone.length < 11) {
      showWarnMsg('请输入11位手机号')
      return
    }
    if (!checkIsPhone(state.phone)) {
      showWarnMsg('手机号格式不正确')
      return
    }
    if (!state.avatar) {
      showWarnMsg('请上传头像')
      return
    }
    state.showLoading = true
    state.loadingText = '提交中'
    let postData = {}
    const res = await Api.post(URL.CREATE_POST, postData)
  } catch (err) {
    showWarnMsg('创建失败, 请重试' + err.message)
  }
  state.showLoading = false
  showSuccessMsg('创建成功')
}

/**
 * 监听选择文件
 */
async function handleChangeFile(e) {
  const files = e.target.files
  if (files.length > 0) {
    const file = files[0]
    const typeArr = ['image/png', 'image/jpeg', 'image/gif']
    if (!typeArr.includes(file.type)) {
      showWarnMsg('请上传图片格式的文件')
      return
    }
    if(file.size > 10 * 1024 * 1024){
      showWarnMsg('图片大小不能超过10M')
      return
    }
    const imgUrl = getObjectURL(file)
    console.log('imgUrl', imgUrl)
    const base64 = await convertUrlToBase64(imgUrl)
    console.log('base64', base64)
    state.avatar = base64.dataURL
  }
}

/**
 * 获取图片url
 */
function getObjectURL(file) {
  const URL = window.URL || window.webkitURL || window.mozURL
  return URL.createObjectURL(file)
}

/**
 * 图片URL转base64
 */
function convertUrlToBase64(imgUrl) {
  return new Promise(function(resolve, reject) {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imgUrl
    img.onload = function() {
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
        ext: ext
      }
      resolve(base64)
    }
  })
}

/**
 * 校验姓名
 */
function checkChineseName(name) {
  let reg = /^[\u4e00-\u9fa5]{2,15}$/
  // 保留点后,用来校验的姓名,也是最终校验通过后返回的姓名
  let payerName = name
    .replaceAll('　', '')
    .replaceAll(' ', '')
    .replaceAll('•', '·')
    .replaceAll('．', '·')
  // 去除所有点后，用来校验的姓名
  let checkName = name
    .replaceAll('　', '')
    .replaceAll(' ', '')
    .replaceAll('•', '')
    .replaceAll('．', '')
    .replaceAll('·', '')
  if (checkName.length === 1) {
    showWarnMsg('姓名至少包含两位汉字，请修正')
    return false
  }
  if (reg.test(checkName)) {
    if (payerName.substring(0, 1) === '·') {
      showWarnMsg('姓名第一位不能为【·】，请修正')
      return false
    }
    if (payerName.substring(payerName.length - 1) === '·') {
      showWarnMsg('姓名最后不能为【·】，请修正')
      return false
    }
    if (payerName.indexOf('··') !== -1) {
      showWarnMsg('姓名不能有连续的【·】，请修正')
      return false
    }
    return payerName
  } else {
    showWarnMsg('姓名中只能包含【汉字】和【·】，请修正')
    return false
  }
}

/**
 * 校验是否为手机号
 */
function checkIsPhone(str) {
  return /^1([0-9])\d{9}$/.test(str)
}

function showWarnMsg(text) {
  message.warning(text, { duration: 1000 })
}

function showSuccessMsg(text) {
  message.success(text, { duration: 1000 })
}
</script>

<template>
  <div class="page-add">
    <n-spin :show="state.showLoading">
      <template #description>{{ state.loadingText }}</template>
      <div :style="{ opacity: state.showLoading ? 0.5 : 1 }">
        <div class="input-wrap">
          <div class="input-item">
            <span class="input-label">姓名</span>
            <div class="input-content">
              <input
                type="text"
                placeholder="请输入姓名"
                v-model="state.name"
              />
            </div>
          </div>
          <div class="divider"></div>
          <div class="input-item">
            <span class="input-label">卡号</span>
            <div class="input-content">
              <input
                type="text"
                placeholder="请输入卡号"
                v-model="state.cardNo"
                maxlength="12"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              />
            </div>
          </div>
          <div class="divider"></div>
          <div class="input-item">
            <span class="input-label">序列号</span>
            <div class="input-content">
              <input
                type="text"
                placeholder="请输入序列号"
                v-model="state.num"
              />
            </div>
          </div>
          <div class="divider"></div>
          <div class="input-item">
            <span class="input-label">手机号</span>
            <div class="input-content">
              <input
                type="text"
                placeholder="请输入手机号"
                maxlength="11"
                v-model="state.phone"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              />
            </div>
          </div>
          <div class="divider"></div>
          <div class="input-item">
            <span class="input-label">上传照片</span>
          </div>
          <div class="img-wrap">
            <div
              class="img-placeholder"
              v-if="!state.avatar"
            ></div>
            <img
              class="img-avatar"
              v-if="state.avatar"
              :src="state.avatar"
            />
            <div class="img-tip" v-if="state.avatar"></div>
            <input
              class="input-file"
              type="file"
              multiple="false"
              accept="image/*"
              @change="handleChangeFile"
            />
          </div>
        </div>
        <div class="btn-submit" @click="handleClickSave">
          提交信息
        </div>
      </div>
    </n-spin>
  </div>
</template>

<style scoped>
.page-add {
  padding: 30px 10px;
  overflow: auto;
  height: 100%;
  background: #f8f8f8;
}
.input-wrap {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 44px 16px;
}
.input-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  font-size: 15px;
  font-weight: 400;
}
.divider {
  height: 1px;
  border: 1px solid #f7f7f7;
}
.input-label {
  display: inline-block;
  color: #333333;
  width: 60px;
  height: 21px;
  line-height: 21px;
  text-align: left;
}
.input-content {
  flex: 1;
  height: 100%;
  padding-left: 10px;
}
.input-content input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
}
.input-content input::-webkit-input-placeholder {
  color: #b8b8b8;
}
.img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 102px;
  height: 102px;
  margin: 0 auto;
}
.img-placeholder {
  width: 102px;
  height: 102px;
  border-radius: 50%;
  background: url(data:image/png;base64,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);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.img-avatar {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 102px;
  height: 102px;
  border-radius: 50%;
}
.img-tip {
  display: block;
  position: absolute;
  bottom: 0;
  left: 7px;
  width: 88px;
  height: 26px;
  background: url(data:image/png;base64,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);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.input-file {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 102px;
  height: 102px;
  opacity: 0;
}
.btn-submit {
  margin-top: 14px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
}
.btn-submit:active {
  opacity: 0.6;
}
</style>
