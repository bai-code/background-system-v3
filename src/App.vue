<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { throttle  } from '@/tools/plugin'
import { useStore } from '@/store/useStore'


const screenW = ref<number>(document.body.clientWidth)  // 视口宽度

const store = useStore()


// 页面大小改变
watch(screenW, (w) => {
  if (w < 768) {
    store.labelLeft = false
  }else {
    store.labelLeft = true
  }
}, { immediate: true })

onMounted(() => {
  window.onresize = () => {
    throttle(()=>{
      screenW.value = document.body.clientWidth
    })

  }
})

</script>

<style lang="less">
html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  user-select: none;
}
</style>
