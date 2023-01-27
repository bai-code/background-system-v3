<template>
  <el-row class="login-container" type="flex" justify="center" align="middle">
    <el-col class="content" :span="16">
      <div class="image">
        <img class="logo" src="../assets/logo.png" alt="logo">
      </div>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm"
        :label-position="labelLeft?'left':'top'">
        <el-form-item label="账号：" prop="username">
          <el-input v-model="ruleForm.username" type="text" autocomplete="off" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item class="btn">

          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import axios from '@/tools/axios'
import { reactive, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useStore } from '@/store/useStore'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'


const { labelLeft } = storeToRefs(useStore())  // label文字 位置

const ruleFormRef = ref<FormInstance>()


// 验证
const validateUser = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the username'))
  }
  if (!/\w{5,14}/.test(value)) {
    callback(new Error('username must be 5-14'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (!/\w{6,14}/.test(value)) {
      callback(new Error('password must be 6-14'))
    } else {
      callback()
    }
  }
}

const ruleForm = reactive({
  username: 'admin',
  password: '123456',
})

const rules = reactive({
  username: [{ validator: validateUser, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

const router = useRouter()
// 提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const { username, password } = ruleForm
      const { data } = await axios.post('/login', { username, password })

      if (data && data.token) {
      localStorage.setItem('token', data.token)
        ElMessage({
          message: '登录成功',
          type: 'success'
        })
        router.push({ name: 'home' })
      } else {
        ElMessage({
          message: '登录失败,请检查账号密码',
          type: 'error'
        })
      }
      // console.log('submit!', data)
    } else {
      // console.log('error submit!')
      return false
    }
  })
}

// 清空表格
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped lang="less">
@bgColor:rgba(0,0,0,0.1);

.el-row.login-container {
  height: 100%;
  background: @bgColor;

  .el-col.content {
    background: #fff;
    padding: 80px 40px 0;
    border-radius: 5px;
    max-width: 550px;
    min-width: 300px;
    position: relative;

// logo
    div.image {
      height: 0;
      width: 20%;
      position: absolute;
      padding-bottom: 20%;
      background: #fff;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      img.logo {
        height: 90%;
        width: 90%;
        background-color: @bgColor;
        .positions(50%,50%);
        border-radius: 50%;
      }
    }


    // 表单区域
    .el-form-item {
      &.btn {
        :deep(.el-form-item__content) {
          justify-content: flex-end;

        }
      }

    }
  }
}
</style>