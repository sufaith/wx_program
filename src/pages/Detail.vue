<script setup>
import {
  getCurrentInstance,
  onMounted,
  reactive,
} from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'
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
  name: '陈安然',
  avatar: 'https://img2.baidu.com/it/u=2351401291,4078396716&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1663434000&t=6a06ccb31dfb1f7e82c3747ff95236ff',
  validTime: '2022/12/31',
  phone: '16745282458',
  remainTime: '109天',
  otherInfo: '22锦绣华北,有效',
  cardNo: '202266097505',
  qrcodeImg: 'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/681a6ccec2c94b778c2200163b10283b_mergeImage.png',
})

onMounted(() => {
  const route = useRoute()
  fetchUserInfo()
})

async function fetchUserInfo() {
  if (state.showLoading) return
  state.showLoading = true
  state.loadingText = '获取数据中'
  const res = await Api.post(URL.CREATE_POST, postData)
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
            class="avatar"
            :src="state.avatar"
          />
          <div class="info-item">
            <span>姓名: {{state.name}}</span>
            <span>有效期至：{{state.validTime}}</span>
          </div>
          <div class="info-item">
            <span>电话：{{state.phone}}</span>
            <span>剩余时间：{{state.remainTime}}</span>
          </div>
          <div class="info-item">
            <span>{{state.otherInfo}}</span>
          </div>
          <div class="divider"></div>
          <img
            class="qrcode"
            :src="state.qrcodeImg"/>
          <div class="card-no">卡号：{{state.cardNo}}</div>
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
