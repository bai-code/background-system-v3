<template>

  <el-container class="container">
    <el-header>Header</el-header>
    <el-container class="content">
      <el-aside :class="['aside', { isTransi: isLabelLeft }]" :width="isLabelLeft ? '65px' : '200px'">
        <div class='btn pointer' @click="changeBtnStatus">|||</div>
        <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isLabelLeft" @open="handleOpen"
          background-color="#444" :collapse-transition="false" @close="handleClose" text-color="#aaa">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span>Navigator One</span>
            </template>
            <el-menu-item-group>
              <template #title><span>Group One</span></template>
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title><span>item four</span></template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <template #title>Navigator Two</template>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <el-icon>
              <document />
            </el-icon>
            <template #title>Navigator Three</template>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon>
              <setting />
            </el-icon>
            <template #title>Navigator Four</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
  <div class="home">


  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/store/useStore'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import { computed } from '@vue/reactivity';

const store = useStore()

const isLabelLeft = computed(() => {
  return store.labelLeft
})

const changeBtnStatus = () => {
  store.labelLeft = !isLabelLeft.value

}

// const { labelPosition } = storeToRefs(useStore()) // 是否展开面板
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped lang="less">
.el-container.container {
  height: 100%;

  .el-header {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .el-container.content {
    .el-aside.aside {
      background-color: #444;
      color: #aaa;

      .el-menu {
        box-sizing: border-box;
        border: 0;
        height: calc(100% - 40px);
      }

      div.btn {
        text-align: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
      }

    }


  }
}
</style>