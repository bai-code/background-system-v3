<template>
  <el-menu :default-openeds="['0']" default-active="/home/welcome" :collapse="!isLabelLeft" @open="handleOpen"
    background-color="#444" unique-opened router active-text-color="#409eff" :collapse-transition="false"
    @close="handleClose" text-color="#aaa">
    <el-menu-item index="/home/welcome">
      <el-icon>
      <i class="iconfont icon-fireworks"></i>
      </el-icon>
      <template #title>欢迎</template>
    </el-menu-item>
    <el-sub-menu :index="menu.order + ''" v-for="menu in menusList" :key="menu.id">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>{{ menu.authName }}</span>
      </template>
      <el-menu-item-group v-if="menu.children.length > 0">
        <el-menu-item :index='"/home/" + menu.path + "/" + item.path' v-for="item in menu.children" :key="item.id">
          <el-icon>
            <location />
          </el-icon>
          {{ item.authName }}</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import { useStore } from '@/store/useStore'
import { onMounted, shallowRef, ref } from 'vue'
import axios from '@/tools/axios'
// import { useRoute } from 'vue-router'

// 父级数据
defineProps({
  isLabelLeft: {
    type: Boolean,
    default: false
  }
})

// const route = useRoute()

const menusList = ref<array>([])
// 获取菜单列表
const getMenuList = async () => {
  const { data = [] } = await axios.get('/menus')
  menusList.value = data
  console.log(data);

}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

onMounted(() => {
  getMenuList()
})
</script>

<style scoped lang="less">
.el-menu {
  border: 0;

  :deep(.el-menu-item-group__title) {
    //清除padding
    padding: 0;
  }
}
</style>