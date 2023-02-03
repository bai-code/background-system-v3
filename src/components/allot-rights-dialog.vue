<template>

  <el-dialog title="添加角色" v-model="isVisible" width="450" :show-close="false" align-center :before-close="handleClose">
    <el-tree :data="rightsList" :props="defaultProps" show-checkbox :default-checked-keys="defaultKeysList"
      :default-expand-all="true" @current-change="updateKeyChildren" node-key="id" ref="treeRef" />
    <span slot="footer" class="dialog-footer">
      <div class="footer">
        <el-button @click="hiddenDialog">取 消</el-button>
        <el-button type="primary" @click="submitEvent()">确 定</el-button>
      </div>
    </span>
  </el-dialog>

</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import axios from '@/tools/axios'
import { ElMessage } from 'element-plus';

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  allotRightsList: {
    type: Array,
    required: true
  },
  roleId: {
    type: Number,
    required: true,
  }
})

interface Tree {
  label: string
  children?: Tree[]
}

const treeRef = ref<HTMLElement | undefined>()

// 默认选中项数组
const defaultKeysList = ref<any>([])

// 监听选中项数组改变
watch(() => props.allotRightsList, (list) => {
  defaultKeysList.value = list

}, { immediate: true, deep: true })
// 树状图对象

const updateKeyChildren = (key: any, data: any) => {
  console.log(key, data);

}

// 树状列表配置
const defaultProps = {
  children: 'children',
  label: 'authName',
}

const emits = defineEmits(['pullData', 'changeVisible'])


// 隐藏弹窗
const hiddenDialog = () => {
  defaultKeysList.value = []
  treeRef.value!.setCheckedKeys([])  // 强制清空渲染

  emits('changeVisible', false)
}

// 关闭
const handleClose = () => {
  hiddenDialog()
}

// 获取  总  权限数据  树状
const rightsList = ref([])
const getRightsList = async () => {
  const { data, meta }: { data: any, meta: any } = await axios.get('/rights/tree')
  if (meta.status === 200) {
    rightsList.value = data
  }
}

// 显示弹窗
const isVisible = ref<boolean>(false)

watch(() => props.dialogVisible, (flag: boolean) => {
  isVisible.value = flag
}, { immediate: true })


const submitEvent = async () => {
  // 获取已选节点id
  const keysList = treeRef.value!.getCheckedKeys().join(',')
  const halfKeysList = treeRef.value!.getHalfCheckedKeys().join(',')
  const { meta }: { meta: any } = await axios.post(`/roles/${props.roleId}/rights`, { rids: keysList + ',' + halfKeysList })
  ElMessage({
    type: meta.status === 200 ? 'success' : 'error',
    message: meta.msg
  })
  emits('pullData')

  handleClose()
}




onMounted(() => {
  getRightsList()
})

</script>

<style lang="less" scoped>
div.footer {
  .flex(flex-end, center);
}
</style>