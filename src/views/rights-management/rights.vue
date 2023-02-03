<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="card">
    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column label="#" type="index" width="50" />

      <el-table-column prop="authName" label="权限名称" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="level" label="权限等级">
        <template v-slot="scope">
          <el-tag size="large" v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag size="large" v-else-if="scope.row.level === '1'" type="success">二级</el-tag>

          <el-tag size="large" type="warning" v-else>三级</el-tag>

        </template>


      </el-table-column>
    </el-table>
  </el-card>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from '@/tools/axios'

// 定义表格数组
const tableData = ref<any>([])

// 获取表单数据
const getTableList = async () => {
  const { data = [] }: { data: any } = await axios.get('/rights/list')
  tableData.value = data
}

onMounted(() => {
  getTableList()
})

</script>

<style scoped lang="less">
.el-card {
  margin-top: 20px;
}
</style>