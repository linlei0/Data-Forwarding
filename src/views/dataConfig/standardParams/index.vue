<template>
  <div class="app-container">
    <div class="search_list">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="24">
          <el-form :inline="true" :model="listQuery">
            <el-form-item label="数据项类型">
              <el-select v-model="listQuery.variableType" clearable>
                <el-option label="动态数据项" value="1" />
                <el-option label="故障数据项" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据项名称">
              <el-autocomplete
                v-model="listQuery.variableName"
                :fetch-suggestions="querySearch"
                clearable
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-form>

        </el-col>
      </el-row>
    </div>
    <div class="add-btn">
      <el-button v-waves type="primary" @click="dialogTableVisible = true">＋新增</el-button>
    </div>
    <div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :header-row-style="{height:'40px'}"
        :row-style="{height:'40px'}"
        :max-height="tableHeight"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column :label="$t('table.id')" align="center" width="65">
          <template slot-scope="scope">
            <span>{{ (scope.$index+1)+(listQuery.pageNum-1)*listQuery.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'数据项名称'" prop="variableName" align="center" width="150" />
        <el-table-column :label="'数据项类型'" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.variableType===1?'动态数据项':scope.row.variableType===2?'故障数据项':'' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'父级节点'" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.variableParentName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'单选'" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isSingle?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'配置公式'" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isFormula?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'存储'" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isStorage?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'查询条件'" prop="searchCondition" width="150" align="center"/>
        <el-table-column :label="'备注'" prop="remark" align="center" width="200"/>
        <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleUpdate(scope.row,scope.$index)">{{ $t('table.edit') }}</el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope)">{{ $t('table.delete') }}</el-button>
          </template>
      </el-table-column></el-table>
    </div>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogTableVisible"
      :before-close="closeDia"
      :title="!isEdit?'新增标准参数':'修改标准参数'"
      :top="'5vh'">
      <el-row>
        <el-col :span="12">
          <el-form ref="formLeft" :model="formLeft" :rules="formLeftRules" :label-position="'right'" label-width="130px">
            <el-form-item label="数据项名称" prop="variableName">
              <el-input v-model.trim="formLeft.variableName"/>
            </el-form-item>
            <el-form-item label="序列号">
              <el-input v-model.trim="formLeft.orderNo"/>
            </el-form-item>
            <el-form-item label="是否需要配置公式">
              <el-radio-group v-model="formLeft.isFormula">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否单选">
              <el-radio-group v-model="formLeft.isSingle">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="formRight.variableType==='2'?true:false" label="查询渠道">
              <el-select v-model="formLeft.searchChannel">
                <el-option :value="1" label="DBC参数列表" />
                <el-option :value="2" label="故障码列表" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form ref="formRight" :model="formRight" :rules="formRightRules" :label-position="'right'" label-width="130px">
            <el-form-item label="数据项类型" prop="variableType">
              <el-select v-model="formRight.variableType">
                <el-option label="动态数据项" value="1" />
                <el-option label="故障数据项" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="父级菜单">
              <!-- <el-input v-model="formRight.variableParentName"/> -->
              <el-select v-model="formRight.variableParentName" @change="ParentNameChange">
                <el-option v-for="(item,index) in parentMenuList" :label="item.text" :value="item.value" :key="index" />

              </el-select>
            </el-form-item>
            <el-form-item label="是否存储">
              <el-radio-group v-model="formRight.isStorage">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="查询方式" prop="searchType">
              <el-select v-model="formRight.searchType">
                <el-option value="1" label="模糊查询" />
                <el-option value="2" label="精确查询" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form :label-position="'right'" label-width="130px">
            <el-form-item label="参考查询条件">
              <el-input v-model.trim="dialogForm.searchCondition" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form :label-position="'right'" label-width="130px">
            <el-form-item label="备注">
              <el-input v-model.trim="dialogForm.remark" :rows="6" :autosize="{ minRows: 2, maxRows: 3}" placeholder="请填写简介(非必填)" type="textarea"/>
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
import {
  getStandardParam,
  createStandardParam,
  getStandardParamParent
} from '@/api/dataConfig/StandardParam'
import { pagingMixin } from '@/mixins/table'
import { partialForm } from '@/mixins/partialForm'
import { otherHeight } from '@/mixins/getOtherHeight'
import waves from '@/directive/waves' // 水波纹指令
import elDragDialog from '@/directive/el-dragDialog' // 可拖动弹窗
export default {
  name: 'StandardParams',
  directives: { waves, elDragDialog },
  mixins: [pagingMixin, partialForm, otherHeight],
  data() {
    const validateVariableName = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入数据项名称'))
      }
    }
    const validateVariableType = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请选择数据项类型'))
      }
    }
    const validateSearchType = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请选择数据项类型'))
      }
    }
    return {
      restaurants: [{ 'value': '数据项名称一' }],
      dialogTableVisible: false,
      listLoading: false,
      total: null,
      isEdit: false,
      list: [],
      listQuery: {
        variableType: '',
        variableName: ''
      },
      parentMenuList: [],
      dialogForm: {
        searchCondition: '', // 查询条件
        remark: '' // 备注
      },
      // 左边form
      formLeft: {
        variableName: '', // 数据项名称
        orderNo: '', // 顺序
        isFormula: 0, // 是否配置公式
        isSingle: 0, // 是否单选
        searchChannel: '' // 查询渠道
      },
      // 左边验证
      formLeftRules: {
        variableName: { required: true, trigger: 'blur', validator: validateVariableName }
      },
      // 右边form
      formRight: {
        variableType: '', // 数据项类型
        variableParentName: '', // 父级菜单
        variableParentNameId: '', // 父级菜单id
        isStorage: 0, // 是否存储
        searchType: '' // 查询方式
      },
      // 右边验证
      formRightRules: {
        variableType: { required: true, trigger: 'change', validator: validateVariableType },
        searchType: { required: true, trigger: 'change', validator: validateSearchType }
      },
      tableHeight: 0
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    const ohterHeight = this.getOtherHeight()
    const self = this
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - ohterHeight
    })
    window.onresize = function(e) {
      self.$nextTick(() => {
        self.tableHeight = window.innerHeight - ohterHeight
      })
    }
    getStandardParamParent().then(({ data }) => {
      this.parentMenuList = data.data
    })
  },
  methods: {
    // 重置表单
    restForm() {
      this.dialogForm = {
        searchCondition: '', // 查询条件
        remark: '' // 备注
      }
      this.formLeft = {
        variableName: '', // 数据项名称
        orderNo: '', // 顺序
        isFormula: 0, // 是否配置公式
        isSingle: 0, // 是否单选
        searchChannel: '' // 查询渠道
      }
      this.formRight = {
        variableType: '', // 数据项类型
        variableParentName: '', // 父级菜单
        variableParentNameId: '', // 父级菜单id
        isStorage: 0, // 是否存储
        searchType: '' // 查询方式
      }
      const formList = ['formLeft', 'formRight']
      for (let i = 0; i < formList.length; i++) {
        this.$refs[formList[i]].resetFields()
        // 移除验证结果
        // this.$refs[formList[i]].clearValidate()
      }
    },
    listLoad() {
      this.listLoading = true
      getStandardParam(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.listLoading = false
          this.list = data.data
          this.total = data.total
          const dom = document.querySelector('.el-table__body-wrapper')
          dom.scrollTop = 0
          dom.scrollLeft = 0
        }
      })
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
    ParentNameChange(value) {
      this.formRight.variableType = value
      let obj = {}
      obj = this.parentMenuList.find((item) => {
        return item.value === value
      })
      this.formRight.variableParentName = obj.text
    },
    closeDia(done) {
      this.isEdit = false
      this.restForm()
      done()
    },
    handleSelect(item) {
    },
    headleCancel() {
      this.dialogTableVisible = false
    },
    submitForm() {
      if (!this.isEdit) { // 新增
        const checkFormLeft = this.checkForm({ formName: 'formLeft', formList: ['variableName'] })
        const checkFormRight = this.checkForm({ formName: 'formRight', formList: ['variableType', 'searchType'] })
        if (!checkFormLeft || !checkFormRight) {
          return
        }
        const dataObj = { ...this.formLeft, ...this.formRight, ...this.dialogForm }
        dataObj.variableType = dataObj.variableType * 1
        dataObj.searchType = dataObj.searchType * 1
        // delete dataObj.variableParentName
        // console.log(dataObj)
        createStandardParam(dataObj).then(({ data }) => {
          if (data.code === 0) {
            if (this.list.length === this.listQuery.pageSize) {
              this.list.splice(this.listQuery.pageSize - 1, 1)
            }
            this.list.unshift(dataObj)
          }
        })
      } else { // 编辑
        this.isEdit = false
      }
      this.restForm()
      this.dialogTableVisible = false
    },
    // 修改
    handleUpdate(row, index) {
      console.log(row)
      this.dialogTableVisible = true
      this.isEdit = true
      this.dialogForm = { ...this.dialogForm, ...this.formRight, ...this.formLeft, ...row }
      this.formRight.variableType = this.formRight.variableType + ''
      this.formRight.searchType = this.formRight.searchType + ''
    },
    handleDelete(index) {

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
.add-btn{
  padding: 15px 0
}
</style>
