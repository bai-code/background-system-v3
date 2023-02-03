<template>
  <div class="roles">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="card">
      <el-button class="add-roles" type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand" class="expand">
          <template v-slot="scope">
            <el-row v-for="(item, index) in scope.row.children" :key="item.id"
              :class="[index == 0 ? 'borderTop' : '', 'first']">
              <!-- 一级标题 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRights(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级标题 -->
              <el-col :span="19">
                <el-row v-for="(i, index) in item.children" :key="i.id" :class="[index !== 0 ? 'second' : '']">
                  <el-col :span="8">
                    <el-tag type="success" closable @close="deleteRights(scope.row, i.id)" class="tag-s">
                      {{ i.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="16">
                    <el-row>
                      <el-tag closable type="warning" v-for="j in i.children" :key="j.id" class="endTag"
                        @close="deleteRights(scope.row, j.id)">
                        {{ j.authName }}
                      </el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="roleName" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="用户岗位" width="180">
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template v-slot="scope">
            <el-button size="small" type="primary" @click="editInfo(scope.row)">
              <el-icon>
                <Edit />
              </el-icon>
              <span>编辑</span>

            </el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">
              <el-icon>
                <Delete />
              </el-icon>
              <span>删除</span>
            </el-button>
            <el-button size="small" type="warning" @click="allotRole(scope.row)">
              <el-icon>
                <Setting />
              </el-icon>
              <span>分配权限</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加or编辑用户 -->
    <AddRoleDialog :dialog-visible="addDialogVisible" @change-visible="changeVisible" @pull-data="pullData" :info="info" />
    <!-- 分配权限弹窗 -->
    <AllotRightsDialog :dialog-visible="allotDialogVisible" :allotRightsList="defaultKeysList" @pullData="pullData"
      :roleId="roleId" />
  </div>
</template>

<script setup lang="ts">
import axios from '@/tools/axios'
import { onMounted, reactive, ref } from 'vue';
import { Edit, Delete, Setting } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import AddRoleDialog from '@/components/add-role-dialog.vue'
import AllotRightsDialog from '@/components/allot-rights-dialog.vue';

// 获取角色信息
const rolesList = ref<any>([])
const getRolesList = async () => {
  const { data = [], meta }: { data: any, meta?: any } = await axios.get('/roles')
  rolesList.value = data
}
// 编辑用户
const info = ref<any>({}) // 是否是编辑用户  和添加共享弹窗
const editInfo = (row:any) => {
    info.value = row
    addDialogVisible.value = true
}
// 删除用户
const deleteUser = async (id: string) => {
  ElMessageBox.confirm('是否删除该权限', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { meta = {} }: { meta: any } = await axios.delete(`roles/${id}`)
    ElMessage({
      type: meta.status === 200 ? 'success' : 'error',
      message: meta.msg
    })
    if (meta.status === 200) {
      getRolesList()
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除'
    })
  })

}
// 分配权限


// 删除权限
const deleteRights = (row: any, id: string, index?: number) => {
  // 页面会刷新
  ElMessageBox.confirm(
    '是否删除权限?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const fId = row.id
      const { meta = {}, data = [] }: { meta: any, data: any } = await axios.delete(`roles/${fId}/rights/${id}`)
      if (meta.status === 200) {
        row.children = data
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

// 添加用户
const addDialogVisible = ref<boolean>(false)
// 修改显示状态
const changeVisible = (flag: boolean) => {
  addDialogVisible.value = flag

}

// 分配权限弹窗
const allotDialogVisible = ref<boolean>(false)
// 树状列表配置

const defaultKeysList = ref<any>([])
const roleId = ref<undefined|number>(0)
const allotRole = (list: any) => {
  defaultKeysList.value = []
  allotDialogVisible.value = true

  let arr: any[] = []  // 储存当前选中的数组项
  // 递归获取选中的id值
  const _getId = (list: any, arr: any) => {
    if (!list.children) {
      return arr.push(list.id)
    }
    list.children.forEach((item: any) => {
      _getId(item, arr)
    })
  }

  _getId(list, arr)
  roleId.value = list.id
  defaultKeysList.value = arr

}

// 修改后重新拉取数据
const pullData = () => {
  getRolesList()
  allotDialogVisible.value = false
  addDialogVisible.value = false
  info.value = {}
}

onMounted(() => {
  getRolesList()
})

</script>

<style lang="less" scoped>
div.roles {
  .el-card {
    margin-top: 20px;

    .el-button.add-roles {
      margin-bottom: 20px;
    }

    .el-row.roles-header {
      display: flex;

      .el-button {
        height: 40px;
      }
    }

    .el-table {
      .el-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        &.first {
          padding-left: 100px;
        }

        .endTag,
        .tag-s {
          margin: 8px 5px;
        }

        &.second {
          border-top: 1px solid #eee;
        }

        .el-tag {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>