<template>
  <el-dialog :title="info.id ? '修改角色' : '添加角色'" v-model="isVisible" width="450" :show-close="false" align-center
    :before-close="handleClose">
    <el-form :model="formData" label-width="80px" :rules="rules" ref="ruleFormRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input type="text" v-model="formData.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input type="text" v-model="formData.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="footer">
        <el-button @click="hiddenDialog">取 消</el-button>
        <el-button type="primary" @click="submitEvent(ruleFormRef)">确 定</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import axios from '@/tools/axios';

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  info: { // 需要修改的信息
    type: Object,
    default: false
  }
})

const emits = defineEmits(['changeVisible', 'pullData'])

const ruleFormRef = ref<FormInstance>()
// 绑定是否显示弹窗
const isVisible = ref<boolean>(false)

// 定义表单数据
const formData = reactive({
  roleName: '',
  roleDesc: '',
  id: ''
})

watch(() => props.dialogVisible, (flag: boolean) => {
  if (flag) {
    ruleFormRef.value && ruleFormRef.value.resetFields()
    const { roleName, roleDesc, id } = props.info
    formData.roleName = roleName
    formData.roleDesc = roleDesc
    formData.id = id
  }
  isVisible.value = flag

}, { immediate: true })


// 规则
const rules = reactive<FormRules>({
  roleName: [{ required: true }]
})

const hiddenDialog = () => {
  emits('changeVisible', false)
}
// 点击空白触发回调
const handleClose = () => {
  hiddenDialog()
}

// 提交数据
const submitEvent = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { roleName, roleDesc, id } = formData

      let info: any = {}
      if (id) {
        const { meta = {} }: { data?: any, meta: any } = await axios.put(`/roles/${id}`, { roleName, roleDesc })
        info = meta
      } else {
        const { meta = {} }: { data?: any, meta: any } = await axios.post('roles', { roleName, roleDesc })
        info = meta
      }
      ElMessage({
        type: info.status === 201 || info.status === 200 ? 'success' : 'error',
        message: info.status&&id?'修改成功':'添加成功'
      })
      if (info.status === 201 || info.status === 200) {
        emits('pullData') // 成功后重新拉取数据
        hiddenDialog()
      }
    }
  })
}
</script>

<style lang="less" scoped>
div.footer {
  .flex(flex-end, center);
}
</style>