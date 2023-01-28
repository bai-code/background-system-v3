<template>

  <el-container class="container">
    <!-- 头部 -->
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col class="l">
          <img src="~@/assets/logo.png" alt="logo" class="logo">
          <h1 class="title">电商后台管理系统</h1>
        </el-col>
        <el-col :span="2">
          <el-button @click="logout">退出登录</el-button>
        </el-col>
      </el-row>
    </el-header>

    <!-- nav区域 -->
    <el-scrollbar height="100%" class="content">
      <el-container class="content">
        <el-aside :class="['aside', { isTransi: isLabelLeft }]" :width="isLabelLeft ? '180px' : '65px'">
          <div class='btn pointer' @click="changeBtnStatus">|||</div>
          <HomeAside :isLabelLeft="isLabelLeft" />
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-scrollbar>
  </el-container>
  <div class="home">


  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '@/store/useStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import HomeAside from './HomeAside.vue'


const store = useStore()

// 是否展开
const isLabelLeft = computed(() => {
  return store.labelLeft
})

//切换是否展开
const changeBtnStatus = () => {
  store.labelLeft = !isLabelLeft.value

}


// 退出登录
const router = useRouter()
const logout = () => {
  sessionStorage.clear()
  router.replace('/')
  ElMessage({
    type: 'success',
    message: '退出登录'
  })

}

</script>

<style scoped lang="less">
.el-container.container {
  height: 100%;

  .el-header {
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;

    .el-row {
      width: 100%;

      .el-col {
        &.l {
          flex: 1 1 auto;
          .flex(flex-start, center);

          img.logo {
            width: 50px;
            height: 50px;
          }

          h1.title {
            font-size: 24px;
            font-weight: bolder;
            color: #fff;
            margin-left: 20px;
          }
        }

        .el-button {
          height: 24px;
          padding: 0 5px;
          background: rgba(100, 100, 100, 0.7);
          color: #fff;
        }

      }
    }
  }

  .el-scrollbar.content {
    height: calc(100% - 60px);

    :deep(.el-scrollbar__view) {
      height: 100%;
    }

    .el-container.content {
      height: 100%;

      .el-aside.aside {
        background-color: #444;
        color: #aaa;
        height: 100%;

        &::-webkit-scrollbar {
          display: none;
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
}
</style>