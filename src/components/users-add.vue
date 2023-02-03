<template>
  <el-dialog title="添加用户" v-model="isVisible" :show-close="false" width="450" >
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.number="ruleForm.email" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model.number="ruleForm.mobile" />
      </el-form-item>
      <el-form-item class="btn">
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup  lang='ts'>
import { reactive, ref, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import axios from '@/tools/axios'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['toggleVisible', 'pullData'])

const isVisible = ref<boolean>(false) // 绑定是否显示
// 监听父级是否改变显示
watch(() => props.dialogVisible, (flag: boolean) => {
  isVisible.value = flag
}, { immediate: true })

const ruleFormRef = ref<FormInstance>()

// 验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (/^\w{6,16}$/.test(value)) {
      callback()
    } else {
      callback(new Error('password must be between 6 and 16 characters'))
    }
  }
}
// 验证邮箱
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback()
  } else if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
    callback(new Error("邮箱验证失败"))
  } else {
    callback()
  }
}
// 验证手机
const validateMobile = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback()
  } else if (!/^\w+([-+.]?\w+)@\w+([-.]\w+).\w+([-.]\w+)*$/.test(value)) {
    callback(new Error("手机号码验证失败 "))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  username: '',
  password: '',
  email: '',
  mobile: ''
})

const rules = reactive({
  username: [{ min: 4, max: 16, trigger: 'blur' }, { required: true }],
  password: [{ validator: validatePassword, trigger: 'blur' }, { required: true }],
  email: [{ validator: validateEmail, trigger: 'blur' }, { required: false }],
  mobile: [{ validator: validateMobile, trigger: 'blur' }, { required: false }]

})

const addUser = async () => {
  const { username, password, email, mobile } = ruleForm
  const { meta }: { meta: any } = await axios.post(`/users`, { username, password, email, mobile })
  ElMessage({
    type: meta.status === 201 ? 'success' : 'error',
    message: meta.msg
  })
  // 修改数据成功，重新拉取
  if (meta.status === 201) {
    emits('pullData')
  }

}

// 切换是否展开
const toggleVisible = (flag: boolean) => {
  emits('toggleVisible', flag)
}

// 添加用户提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      addUser()
      toggleVisible(false)
    } else {
      return false
    }
  })
}

// 重置输入框
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}



</script>

<style lang="less" scoped>
.el-form {
  padding: 0 40px;

  .el-form-item.btn {
    :deep(.el-form-item__content) {
      justify-content: flex-end;
    }
  }
}
</style>