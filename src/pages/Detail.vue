<script setup>
import {
  getCurrentInstance,
  onMounted,
  reactive,
} from 'vue'
import {
  useMessage,
} from 'naive-ui'
import { useRoute } from 'vue-router'

const message = useMessage()
const { proxy } = getCurrentInstance()
const Api = proxy.$http
import { Base64 } from 'js-base64'
const route = useRoute()

const state = reactive({
  showLoading: false,
  loadingText: '',
  userInfo: {
    name: '', // 姓名
    phone: '', // 手机号
    cardID: '', // 卡号
    num: '', // 序列号
    photo: '', // 头像
    img: '', // 二维码图片
    validity: '', // 有效期
    days: '', // 剩余天数
    otherInfo: '',
    remainTime: '',
  }
})

onMounted(() => {
  fetchUserInfo()
})

async function fetchUserInfo() {
  if (state.userInfo.showLoading) return
  const base64Id = route.params.id || ''
  const userId = Base64.decode(base64Id)
  state.showLoading = true
  state.loadingText = '获取数据中'
  const res = await Api.post('/showcard', { keyID: userId })
  if (res.data.code !== 2000) {
    showWarnMsg(res.data.msg)
    return
  }
  state.userInfo = res.data
  state.userInfo.validity = `${state.userInfo.validity}/12/31`
  state.userInfo.otherInfo = '22锦绣华北, 有效'
  state.showLoading = false
}

function showWarnMsg(text) {
  message.warning(text, { duration: 1000 })
}

function showSuccessMsg(text) {
  message.success(text, { duration: 1000 })
}
</script>

<template>
  <div class="page-detail">
    <n-spin :show="state.showLoading">
      <template #description>{{ state.loadingText }}</template>
      <div :style="{ opacity: state.showLoading ? 0.5 : 1 }">
        <div class="info-wrap">
          <img
            v-show="state.userInfo.photo"
            class="avatar"
            :src="state.userInfo.photo"
          />
          <div class="info-item">
            <span>姓名: {{state.userInfo.name}}</span>
            <span>有效期至：{{state.userInfo.validity}}</span>
          </div>
          <div class="info-item">
            <span>电话：{{state.userInfo.phone}}</span>
            <span>剩余时间：{{state.userInfo.days}}天</span>
          </div>
          <div class="info-item">
            <span>{{state.userInfo.otherInfo}}</span>
          </div>
          <div class="divider"></div>
          <img
            v-show="state.userInfo.img"
            class="qrcode"
            :src="state.userInfo.img"/>
          <div class="card-no">卡号：{{state.userInfo.cardID}}</div>
        </div>
      </div>
    </n-spin>
  </div>
</template>

<style scoped>
.page-detail {
  padding: 14px 12px;
  overflow: auto;
  height: 100%;
  background: #f8f8f8;
}
.info-wrap {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 14px 16px 33px;
}
.avatar {
  display: block;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}
.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  margin-bottom: 4px;
  color: #333333;
}
.divider {
  margin: 30px 0;
  height: 1px;
  border: 1px solid #f7f7f7;
}
.qrcode {
  display: block;
  margin: 0 auto;
  width: 144px;
  height: 144px;
  margin-bottom: 25px;
}
.card-no {
  height: 17px;
  line-height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  text-align: center;
}
</style>
