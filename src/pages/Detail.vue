<script setup>
import { getCurrentInstance, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import {
  NSpace,
  NTag,
  NInput,
  NButton,
  useMessage,
  NScrollbar,
  NSpin,
} from 'naive-ui'

const { proxy } = getCurrentInstance()
const message = useMessage()

const URL = proxy.$url
const Api = proxy.$http
const LocalStore = proxy.$localStore
let HISTORY_KEY = ''

const state = reactive({
  showLoading: false,
  loadingText: '',
  inputTitle: '',
})

onMounted(() => {
  const route = useRoute()
  const type = route.params.type
})


async function handleClickPublish() {
  if (state.showLoading) return
  if (!state.inputTitle) {
    showWarnMsg('请输入XXX')
    return
  }
  state.showLoading = true
  state.loadingText = '正在创建'
  await createPost()
  state.showLoading = false
  showSuccessMsg('创建成功')
  state.inputTitle = ''
}

async function createPost(title, content, mediaId, tagIds, categoryIds) {
  try {
    let postData = {
    }
    const res = await Api.post(URL.CREATE_POST, postData)
    
  } catch (err) {
    showWarnMsg('创建失败, 请重试' + err.message)
  }
}

function showWarnMsg(text) {
  message.warning(text, { duration: 1000 })
}

function showSuccessMsg(text) {
  message.success(text, { duration: 1000 })
}

</script>

<template>
  <div class="page-test">
    <n-spin :show="state.showLoading">
      <template #description>{{ state.loadingText }}</template>
      <div :style="{opacity: state.showLoading ? 0.5: 1 }">
      </div>
    </n-spin>
  </div>
</template>

<style scoped>
.page-test {
  padding: 30px 10px;
  overflow: auto;
  height: 100%;
}
.input-title {
  margin-top: 10px;
}
.btn-submit {
  margin-top: 10px;
  width: 100%;
}
</style>
