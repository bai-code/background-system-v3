<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="card-area">
    <!-- 搜索区域 -->
    <el-row class="search">
      <el-input class="s" v-model="options.query" @change="searchQuery" @clear='searchQuery' clearable></el-input>
      <el-button class="s" @click="searchQuery">
        <el-icon>
          <Search />
        </el-icon>
      </el-button>
      <el-button type="primary" @click="usersDialogVisible=true">用户添加</el-button>
    </el-row>
    <!-- 用户列表区域 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="mobile" label="电话" width="150" />
      <el-table-column prop="role_name" label="角色" width="100" />
      <el-table-column prop="mg_state" label="状态" width="100">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            @change="changeUserState(scope.row)" class="ml-2"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot="scope">
          <el-tooltip class="box-item" effect="light" content="编辑" placement="top">
            <el-button type="primary" @click="editInfo(scope.row)">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip class="box-item" effect="light" content="删除" placement="top">
            <el-button type="danger" @click="deleteUser(scope.row)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip class="box-item" effect="light" content="设置" placement="top">
            <el-button type="warning" @click="spreadDialog(scope.row)">
              <el-icon>
                <Setting />
              </el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="count" :pager-count="5"
        v-model:page-size="options.pagesize" @current-change="changePage" />
    </div>
  </el-card>

  <!-- 修改手机号，邮箱弹窗 -->
  <el-dialog v-model="dialogTableVisible" title="修改用户信息" class="dialog">
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" type="text" :disabled="true" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="ruleForm.mobile" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item class="btn">
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>

        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 修改用户权限弹窗 -->
  <el-dialog v-model="dialogVisible" title="分配权限" width="400" :show-close="false" class="rights">
    <el-row>
      <el-col class="gutter">当前用户：{{ rightsInfo.username }}</el-col>
      <el-col class="gutter">当前角色权限：{{ rightsInfo.role_name }}</el-col>
      <el-col class="gutter">
        <span>分配权限：</span>
        <el-select v-model="selectValue" class="m-2" placeholder="选择权限" size="large" value-key="roleName"
          @change="handleSelect">
          <el-option v-for="item in rightsList" :key="item.value" :label="item.roleName" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRights">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加用户 -->
  <UsersAddModule  :dialogVisible="usersDialogVisible" @toggleVisible="changeUsersDialog" @pullData="getTableDataList" />

</template>

<script setup lang="ts">
import { Search, Edit, Delete, Setting } from '@element-plus/icons-vue';
import { onMounted, ref, reactive, watch } from 'vue'
import axios from '@/tools/axios'
import type { Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus'
import UsersAddModule from '@/components/users-add.vue'


interface Options {
  pagenum: number,
  pagesize: number,
  query: string
}
interface T {

}

const tableData = ref<T>([]) // 存储数组
const count = ref<number>(0)
// 定义翻页数据
const options = reactive<Options>({
  pagenum: 1,
  pagesize: 3,
  query: ''
})
// 获取表单数据
const getTableDataList = async () => {
  const { pagenum, pagesize, query } = options

  const { data = {} } = await axios.get(`/users?pagenum=${pagenum}&pagesize=${pagesize}&query=${query}`)
  const { users = [], total } = data
  tableData.value = users
  count.value = total
  console.log(data, pagenum, pagesize);
}

// 切换用户状态
const changeUserState = async (row: any) => {
  const { data = {}, meta }:{ data:any, meta?:any } = await axios.put(`/users/${row.id}/state/${row.mg_state}`)
  ElMessage({
    type: (meta && meta.status === 200) ? 'success' : 'error',
    message: meta.msg
  })
}

// 是否显示弹出框
const dialogTableVisible = ref<boolean>(false)

const ruleFormRef = ref<FormInstance>()
// 验证
const checkEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the email'))
  } else {
    if (/^\w+([-+.]?\w+)@\w+([-.]\w+).\w+([-.]\w+)*$/.test(value)) {
      callback()
    } else {
      callback(new Error('邮箱有误'))
    }
  }
}
const checkMobile = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the mobile'))
  } else {
    if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
      callback()
    } else {
      callback(new Error('Mobile phone number error'))
    }
  }
}

interface RuleForm {
  id?: number | string,
  username: string,
  email: string,
  mobile: string,
  index?: number | null
}

const ruleForm = reactive<RuleForm>({
  username: '',
  email: '',
  mobile: '',
  id: ''
})
// 方便重置数据
const cacheRuleForm = reactive<RuleForm>({
  id: '',
  index: 0,
  username: '',
  email: '',
  mobile: ''
})

const rules = reactive({
  email: [{ validator: checkEmail, trigger: 'blur' }, { required: true }],
  mobile: [{ validator: checkMobile, trigger: 'blur' }, { required: true }],
})

// 修改数据提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const { id, email, mobile } = ruleForm

      const { data, meta }: { data: any, meta: any } = await axios.put(`/users/${id}`,
        { email, mobile })
      if (meta) {
        getTableDataList()
      }
      ElMessage({
        type: meta && meta.status === 200 ? 'success' : 'error',
        message: meta && meta.msg
      })
      dialogTableVisible.value = false
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const { username, email, mobile } = cacheRuleForm
  ruleForm.username = username
  ruleForm.email = email
  ruleForm.mobile = mobile

}

// 修改用户信息
const editInfo = (row: any, index: number) => {
  const { username, email, mobile, id } = row
  ruleForm.username = cacheRuleForm.username = username
  ruleForm.email = cacheRuleForm.email = email
  ruleForm.mobile = cacheRuleForm.mobile = mobile
  ruleForm.id = id
  cacheRuleForm.index = index

  dialogTableVisible.value = true

}

// 删除用户
const deleteUser = async (row: any) => {
  const { id } = row
  const { meta }: { meta: any } = await axios.delete(`/users/${id}`)
  ElMessage({
    type: meta.status === 200 ? 'success' : 'error',
    message: meta.msg
  })
  getTableDataList()
  console.log(meta);

}

// 权限弹窗
const dialogVisible = ref<boolean>(false)

const rightsList = ref<any>([]) // 权限数据
const getRightsList = async (row: any) => {
  const { data }: { data: any, meta?: any } = await axios.get(`/roles`)
  // rightsList.value = data
  return data
}

const rightsInfo = ref<any>({}) // 当前选中权限数据
// 打开弹窗
const spreadDialog = async (row: any) => {
  dialogVisible.value = true
  rightsInfo.value = row
  rightsList.value = await getRightsList(row)
}

// 下拉框绑定
const selectValue = ref<string>('')

// 选择权限项
const selectItemId = ref<number | null>(0)
const handleSelect = (item: LinkItem) => {
  selectItemId.value = item
}

// 提交权限
const submitRights = async () => {
  const { id } = rightsInfo.value
  const { meta }: { meta: any } = await axios.put(`/users/${id}/role`, { rid: selectItemId.value })
  ElMessage({
    type: meta.status === 200 ? 'success' : 'error',
    message: meta.msg
  })
  dialogVisible.value = false
  // console.log(meta, id, selectItemId.value);

}

// 搜索
const searchQuery = async () => {
  const { pagenum, pagesize, query } = options
  const { data: { total, users }, meta }: { data: { total: number, users: any }, meta?: any } = await axios.get(`/users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
  if (meta.status === 200) {
    tableData.value = users
    count.value = total
  }
}

// 添加用户
const usersDialogVisible = ref<boolean>(false)
//是否显示用户弹窗
const changeUsersDialog = (flag:boolean)=>{
  usersDialogVisible.value = flag
}


// 切换页面
const changePage = (index: number) => {
  options.pagenum = index
  getTableDataList()
}


onMounted(async () => {
  getTableDataList()
})
</script>


<style scoped lang="less">
.el-card.card-area {
  margin-top: 20px;

  // 搜索区域
  .el-row.search {
    .el-input.s {
      width: 240px;
      height: 40px;

      :deep(.el-input__wrapper) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .el-button {
      height: 40px;

      &.s {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        left: -1px;
      }

    }
  }

  // 表格
  .el-table {
    margin-top: 20px;

    .el-button {
      height: 26px;
    }
  }

  div.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}

// 弹窗

.el-dialog.dialog {
  .el-form-item {
    &.btn {
      :deep(.el-form-item__content) {
        justify-content: flex-end;
      }

    }
  }
}

// 权限弹窗
.el-dialog.rights {
  .el-col.gutter {
    margin-top: 20px;
  }
}
</style>