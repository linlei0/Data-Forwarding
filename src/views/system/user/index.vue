<template>
  <div class="app-container">
    <div class="search_list">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="24">
          <el-form :inline="true" :model="listQuery">
            <el-form-item>
              <el-input :placeholder="$t('table.username')" v-model.trim="listQuery.loginName" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      :max-height="tableHeight"
      :header-row-style="{height:'40px'}"
      :row-style="{height:'40px'}"
      border

      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ (scope.$index+1)+(listQuery.pageNum -1)*listQuery.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'所属角色'" align="center" width="100">
        <template slot-scope="scope">
          <div>
            <span >{{ scope.row.roleName||'暂无' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="'登录账号'" align="center" prop="loginName" width="100" />
      <el-table-column :label="'真实姓名'" align="center" prop="realName" width="120" />
      <el-table-column :label="'联系方式'" align="center" prop="phone" width="120"/>
      <el-table-column :label="$t('table.status')" align="center" width="80" >
        <template slot-scope="scope">
          <div class="pointer" @click="handleChangeStatus(scope)">
            <span :style="{color:!scope.row.isLocked?'red':'green'}">{{ scope.row.isLocked | statusText }}</span>
            <!-- <el-tag :type="scope.row.lock | statusFilter">{{ scope.row.lock | statusText }}</el-tag> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="'邮箱'" align="center" prop="email" />
      <el-table-column :label="'备注'" align="center" prop="remark" width="80"/>
      <el-table-column :label="$t('table.actions')" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button type="text" size="mini" @click="handleUpdate(scope.row,scope.$index)">{{ $t('table.edit') }}</el-button>
          <el-button type="text" size="mini" @click="restPwd(scope.row)">{{ '重置密码' }}</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope)">{{ $t('table.delete') }}</el-button>
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
      @dragDialog="handleDrag">
      <el-row>
        <el-col :span="12">
          <el-form ref="formLeft" :model="formLabelAlign" :rules="rulesAlign" :label-position="'right'" label-width="80px" >
            <el-form-item label="登录账号" prop="loginName">
              <el-input :disabled="isEdit" v-model.trim="formLabelAlign.loginName" clearable placeholder="请输入登录账号(必填)"/>
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input v-model.trim="formLabelAlign.realName" clearable placeholder="请输入真实姓名(非必填)"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model.trim="formLabelAlign.phone" clearable placeholder="请选输入邮箱(非必填)"/>
            </el-form-item>
            <el-form-item v-show="!isEdit" class="dialog-pwd" prop="userPwd" label="密码">
              <el-autocomplete
                v-model.trim="formLabelAlign.userPwd"
                :fetch-suggestions="querySearch"
                :debounce="300"
                :value="formLabelAlign.userPwd"
                type="password"
                clearable
                placeholder="请输入密码(必填)"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form ref="formRight" :rules="rulesRight" :label-position="'right'" :model="formLabelRight" label-width="80px">
            <el-form-item label="所属角色" prop="roleId">
              <el-select v-model="formLabelRight.roleId" clearable placeholder="请选择角色(必选)" @change="selcectChange">
                <el-option v-for="item in subordinateRoleList" :key="item.value" :value="item.value" :label="item.text" />
              </el-select>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model.trim="formLabelRight.email" clearable placeholder="请选输入邮箱(非必填)"/>
            </el-form-item>
            <el-form-item v-show="!isEdit" prop="confirmPwd" label="确认密码">
              <el-input v-model.trim="formLabelRight.confirmPwd" clearable type="password" placeholder="请再次输入密码(必填)"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16">
          <el-form ref="formBottom" :label-position="'right'" :model="formLabelBottom" label-width="80px">
            <el-form-item label="简介">
              <el-input :rows="6" v-model.trim="formLabelBottom.remark" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写简介(非必填)" type="textarea"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="headleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('formLeft','formRight')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  userList,
  addUserList,
  updateUserList,
  deleteUserList,
  getRoleComboBox
} from '@/api/system/user'
import reg from '@/utils/reg'
import { pagingMixin } from '@/mixins/table'
import { otherHeight } from '@/mixins/getOtherHeight'
import waves from '@/directive/waves' // 水波纹指令
import elDragDialog from '@/directive/el-dragDialog' // 可拖动弹窗
export default {
  name: 'User',
  directives: {
    waves,
    elDragDialog
    // elClickDialog: {
    //   bind(el, binding, vnode) {
    //     const clickDom = el.querySelector('.el-dialog')
    //     clickDom.onclick = function() {
    //       // window.that.$refs['formLeft'].validateField(['userPwd'], (e) => {
    //       //   console.log(e)
    //       // })
    //     }
    //   }
    // }
  },
  filters: {
    statusFilter(status) {
      return status ? 'success' : 'danger'
    },
    statusText(status) {
      return status ? '正常' : '锁定'
    }
  },
  mixins: [pagingMixin, otherHeight],
  data() {
    // 登录名验证
    const validateLoginName = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入登录账号'))
      }
    }
    // 手机号验证
    const validatePhone = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入手机号'))
      }
      if (!reg.tel.test(value)) {
        return cb(new Error('请输入正确的手机号'))
      }
    }
    // 密码验证
    const validatePwd = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入密码'))
      }
      if (!reg.userpwd.test(this.formLabelAlign.userPwd)) {
        return cb(new Error('密码至少包含大写字符，小写字符，数字，特殊字符中的二种，长度最少8位'))
      }
    }
    // 邮箱验证
    const validateEmail = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入邮箱号'))
      }
      if (!reg.mail.test(value)) {
        return cb(new Error('请输入正确的邮箱号'))
      }
    }
    // 确认密码
    const validateConfirmPwd = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入密码'))
      }
      if (value !== this.formLabelAlign.userPwd) {
        return cb(new Error('两次输入密码不一致请确认'))
      }
    }
    // 选择角色
    const validateroleName = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请选择角色'))
      }
    }
    return {
      isEdit: false, // 是否编辑
      selectListIndex: 0, // 编辑选中列表
      formLabelAlign: {
        loginName: '', // 登录用户
        realName: '', // 真实姓名
        phone: '', // 联系方式
        userPwd: ''

      },
      rulesAlign: {
        loginName: { required: true, trigger: 'blur', validator: validateLoginName },
        phone: { required: false, trigger: 'blur', validator: validatePhone },
        userPwd: { required: true, validator: validatePwd }
      },
      formLabelRight: {
        roleName: '',
        email: '', // 邮箱
        confirmPwd: '',
        roleId: ''
      },
      rulesRight: {
        email: { required: false, trigger: 'blur', validator: validateEmail },
        confirmPwd: { required: true, trigger: 'blur', validator: validateConfirmPwd },
        roleId: { required: true, trigger: 'change', validator: validateroleName }
      },
      formLabelBottom: {
        remark: '' // 备注
      },
      subordinateRoleList: [],

      restaurants: [{ 'value': 'intestAdmin' }],
      total: null,
      listLoading: false,
      dialogTableVisible: false,
      list: [],
      listQuery: {
        loginName: ''
      },
      tableHeight: 0
    }
  },
  computed: {
    // tableHeight() {

    // }
  },
  mounted() {
    // console.log(this.getMaxTableHeight())
    const ohterHeight = this.getOtherHeight()
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - ohterHeight
    })

    const self = this
    window.onresize = function(e) {
      self.$nextTick(() => {
        self.tableHeight = window.innerHeight - ohterHeight
      })
    }
    getRoleComboBox().then(({ data }) => {
      if (data.code === 0) {
        this.subordinateRoleList = [...data.data]
      }
    })
  },
  methods: {
    // 重置表单
    restForm() {
      this.formLabelAlign = {
        loginName: '',
        realName: '',
        phone: '',
        userPwd: ''
      }
      this.formLabelRight = {
        roleId: '',
        roleName: '',
        email: '',
        confirmPwd: ''
      }
      this.formLabelBottom = {
        remark: ''
      }
      // 重置表单验证
      const formList = ['formLeft', 'formRight']
      for (let i = 0; i < formList.length; i++) {
        this.$refs[formList[i]].resetFields()
        // 移除验证结果
        // this.$refs[formList[i]].clearValidate()
      }
    },
    // 对部分表单字段进行校验
    checkForm(obj) {
      const arr = []
      let flag = true
      this.$refs[obj.formName].validateField(obj.formList, (e) => {
        arr.push(e)
      })
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) {
          flag = false
          break
        }
      }
      return flag
    },
    selcectChange(e) {
      // console.log(e)
    },
    // 关闭弹框回掉
    closeDia(done) {
      this.isEdit = false
      this.restForm()
      done()
    },
    // 点击弹框取消事件
    headleCancel() {
      this.dialogTableVisible = false
      this.isEdit = false
      this.restForm()
    },
    // 点击弹框确认事件, 新增修改均在此处理
    submitForm(formName1, formName2) {
      // 表示新增
      if (!this.isEdit) {
        const addData = {
          loginName: this.formLabelAlign.loginName,
          loginPassword: this.formLabelAlign.userPwd,
          roleId: this.formLabelRight.roleId,
          realName: this.formLabelAlign.realName,
          phone: this.formLabelAlign.phone,
          email: this.formLabelRight.email,
          remark: this.formLabelBottom.remark
        }

        const validateLeft = this.checkForm({ formName: 'formLeft', formList: ['loginName', 'userPwd'] })
        // console.log(validateLeft)
        const validateRight = this.checkForm({ formName: 'formRight', formList: ['roleId', 'confirmPwd'] })
        // console.log(validateRight)
        if (!validateLeft || !validateRight) {
          return
        }
        addUserList(addData).then(({ data }) => {
          // console.log(data)
          if (data.code === 0) {
            // this.list.unshift(addData)
            this.listLoad()
          }
        })
      } else {
        const o = this.list[this.selectListIndex]
        // 传入后台参数
        const updateData = {
          userId: o.userId,
          roleId: this.formLabelRight.roleId,
          realName: this.formLabelAlign.realName,
          phone: this.formLabelAlign.phone,
          email: this.formLabelRight.email,
          remark: this.formLabelBottom.remark
        }
        // 更新页面数据
        o.roleId = this.formLabelRight.roleId
        o.realName = this.formLabelAlign.realName
        o.phone = this.formLabelAlign.phone
        o.email = this.formLabelRight.email
        o.remark = this.formLabelBottom.remark
        for (let i = 0; i < this.subordinateRoleList.length; i++) {
          if (this.subordinateRoleList[i].value === this.formLabelRight.roleId) {
            o.roleName = this.subordinateRoleList[i].text
          }
        }

        const validateLeft = this.checkForm({ formName: 'formLeft', formList: ['loginName'] })
        const validateRight = this.checkForm({ formName: 'formRight', formList: ['roleId'] })
        if (!validateLeft || !validateRight) {
          return
        }
        updateUserList(updateData).then(({ data }) => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '已更新'
            })
            this.listLoad()
          }
        })
        //  console.log(o)
        this.isEdit = false
      }
      this.dialogTableVisible = false
      this.restForm()
    },
    // 重置密码
    restPwd(row) {
      this.$confirm('确认重置密码？', '提示',
        { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
        .then(_ => {

        })
        .catch(_ => {})
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleDrag() {
      // console.log('w') // 拖动弹窗事件
    },
    handleSelect() {

    },
    listLoad() {
      this.listLoading = true
      // console.log(this.listQuery)
      userList(this.listQuery).then(response => {
        // console.log(response)
        if (response.data.code === 0) {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
          document.querySelector('.el-table__body-wrapper').scrollTop = 0
        }
      })
    },
    // 解锁用户
    handleChangeStatus(scope) {
      if (scope.row.isLocked) {
        this.$alert('当前用户未被锁定,不需要解锁', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        scope.row.isLocked = !scope.row.isLocked
        this.$message({
          message: '解锁成功',
          type: 'success'
        })
      }
    },
    // 编辑
    handleUpdate(row, index) {
      // console.log(row)
      this.dialogTableVisible = true
      this.isEdit = true
      this.formLabelAlign.loginName = row.loginName
      this.formLabelAlign.realName = row.realName
      this.formLabelAlign.phone = row.phone
      this.formLabelRight.email = row.email
      this.formLabelRight.roleId = row.roleId
      this.formLabelBottom.remark = row.remark
      this.selectListIndex = index
    },
    // 删除
    handleDelete(e) {
      // console.log(e)
      const deleteData = {
        userId: e.row.userId
      }
      this.$confirm(`是否删除${e.row.loginName}用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserList(deleteData).then(({ data }) => {
          console.log(data)
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
  .el-select.el-select--medium {
    width: 100%;
  }
  .el-autocomplete{
    width: 100%;
  }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 5px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
.search_list{
  .el-form-item{
    margin-bottom: 0
  }
}
.dialog-pwd{
  &.el-form-item{
    margin-bottom: 34px
  }
}

</style>

