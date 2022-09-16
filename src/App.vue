<script setup>
import { NConfigProvider, NMessageProvider } from 'naive-ui'
const themeOverrides = {
  common: {
    primaryColor: '#05c19e',
    primaryColorHover: '#05c19e',
    primaryColorPressed: '#0da88b',
    borderColor: '#efefef'
  },
  Button: {
    textColor: '#05c19e',
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#05c19e',
      },
    },
  },
}
</script>

<template>
  <n-config-provider class="provider-content" :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>
<style>
body,
div,
span,
header,
footer,
nav,
section,
aside,
article,
ul,
dl,
dt,
dd,
li,
a,
p,
h1,
h2,
h3,
h4,
h5,
h6,
i,
b,
textarea,
button,
input,
select,
figure,
figcaption {
  padding: 0;
  margin: 0;
  list-style: none;
  font-style: normal;
  text-decoration: none;
  border: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
}
body {
  background: #fff !important;
  width: 10rem;
  margin: 0 auto !important;
  -webkit-overflow-scrolling: touch;
  font-size: 14px !important;
  line-height: 1.4 !important;
  font-family: PingFangSC-Regular, PingFang SC, Helvetica Neue, Helvetica,
    Microsoft YaHei, Tahoma, Arial, sans-serif;
}
html,
body,
#app,
.provider-content {
  height: 100% !important;
  overflow: hidden;
}
.history-wrapper {
  position: relative;
  margin-top: 50px;
  border: 1px solid #eee;
  padding: 15px 10px 0;
  font-size: 14px;
  color: #666;
}
.history-wrapper .top-title {
  position: absolute;
  display: inline-block;
  background: #fff;
  height: 20px;
  line-height: 20px;
  top: -10px;
  left: 10px;
  font-size: 11px;
  color: #999;
}
.history-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 20px;
}
.history-item .label {
  font-size: 11px;
  color: #333;
  height: 20px;
  line-height: 20px;
  margin: 0 5px 0 0;
}
.history-item .title {
  flex: 1;
  margin-left: 5px;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  font-size: 11px;
  white-space: nowrap; /* 规定文本是否折行 */
  overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
  text-overflow: ellipsis;
  color: #999;
}
.history-item .time {
  color: #999;
  font-size: 11px;
  height: 20px;
  line-height: 20px;
}
</style>
