<template>
  <div class="app-container">
    <div class="search_list">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="24">
          <el-form :inline="true" :model="listQuery">
            <el-form-item>
              <el-input :placeholder="$t('table.rolename')" v-model="listQuery.roleName" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            </el-form-item>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-form>

        </el-col>
      </el-row>
    </div>

    <div class="add-btn">
      <el-button v-waves class="filter-item" type="primary" @click="dialogTableVisible = true" >＋新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ (scope.$index+1)+(listQuery.pageNum-1)*listQuery.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.rolename')" align="center" prop="roleName" />
      <el-table-column :label="'备注'" align="center" prop="remark"/>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row,scope.$index)">{{ $t('table.edit') }}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogTableVisible"
      :before-close="closeDia"
      :title="!isEdit?'新增用户':'编辑用户'"
      width="40%">
      <el-row>
        <el-col :span="22">
          <el-form ref="formCenter" :rules="rules" :label-position="'right'" :model="formCenter" label-width="120px" >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="formCenter.roleName"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input :rows="6" v-model="formCenter.remark" :autosize="{ minRows: 4, maxRows: 8}" type="textarea"/>
            </el-form-item>

          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="headleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { roleList, addRoleList, updateRoleList, deleteRoleList } from '@/api/system/role'
import { pagingMixin } from '@/mixins/table'
import waves from '@/directive/waves' // 水波纹指令
import elDragDialog from '@/directive/el-dragDialog' // 可拖动弹窗
export default {
  name: 'Role',
  directives: {
    waves,
    elDragDialog
  },
  filters: {
    statusFilter(status) {
      return status ? 'success' : 'danger'
    },
    statusText(status) {
      return status ? '正常' : '锁定'
    }
  },
  mixins: [pagingMixin],
  data() {
    const validateRoleName = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入角色名称'))
      }
    }
    return {
      isEdit: false,
      selectListIndex: 0,
      dialogTableVisible: false,
      formCenter: {
        roleName: '',
        remark: ''
      },
      rules: {
        roleName: { required: true, trigger: 'blur', validator: validateRoleName }
      },
      total: null,
      listLoading: false,
      list: [],
      listQuery: {
        roleName: ''
      }
    }
  },
  methods: {
    restForm() { // 恢复表单初始值
      this.formCenter = {
        roleName: '',
        remark: ''
      }
      this.$refs['formCenter'].resetFields()
    },
    headleCancel() {
      this.isEdit = false
      this.dialogTableVisible = false
      this.restForm()
    },
    submitForm() {
      if (!this.isEdit) { // 新增
        const o = {
          roleName: this.formCenter.roleName,
          remark: this.formCenter.remark
        }
        let formResult = true
        this.$refs['formCenter'].validate((valid) => {
          console.log(valid)
          if (valid) {
            addRoleList(o).then(({ data }) => {
              if (data.code === 0) {
                this.listLoad()
                this.list.unshift(o)
              } else {
                return false
              }
            })
          } else {
            console.log('执行了')
            formResult = false
          }
        })
        console.log(formResult)
        if (!formResult) {
          return
        }
      } else { // 编辑
        const o = this.list[this.selectListIndex]
        o.roleName = this.formCenter.roleName
        o.remark = this.formCenter.remark
        const updateData = {
          roleId: o.roleId,
          roleName: this.formCenter.roleName,
          remark: this.formCenter.remark
        }
        updateRoleList(updateData).then(({ data }) => {
          if (data.code === 0) {
            this.listLoad()
          }
        })
        this.isEdit = false
      }
      this.restForm()
      this.dialogTableVisible = false
    },
    closeDia(done) {
      this.isEdit = false
      this.restForm()
      done()
    },
    radioChange(e) {
    },
    listLoad() {
      this.listLoading = true
      // console.log(this.listQuery)
      roleList(this.listQuery).then(({ data }) => {
        // console.log(data)
        this.list = data.data
        // console.log(this.list)
        this.total = data.total
        this.listLoading = false
      })
    },
    handleChangeStatus(scope) {
      // row.lock = !row.lock
      scope.row.lock = !scope.row.lock
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    },
    handleUpdate(row, index) {
      // this.$message({
      //   message: '操作成功',
      //   type: 'success'
      // })
      const { roleName, remark } = row
      this.formCenter = {
        roleName,
        remark
      }
      this.dialogTableVisible = true
      this.isEdit = true
      this.selectListIndex = index
    },
    // 删除
    handleDelete(e) {
      const deleteData = {
        roleId: e.row.roleId
      }
      this.$confirm(`是否删除${e.row.roleName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleList(deleteData).then(({ data }) => {
          // console.log(data)
          if (data.code === 0) {
            this.list.splice(e.$index, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.listLoad()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.search_list{
  .el-form-item{
    margin-bottom: 0
  }
}
</style>
