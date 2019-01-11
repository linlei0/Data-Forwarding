<template>
  <div>
    <div class="search_list">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="24">
          <el-form :inline="true" :model="listQuery">
            <el-form-item label="公式名称">
              <el-input v-model="listQuery.formulaValue" clearable/>
            </el-form-item>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="add-btn">
      <el-button v-waves type="primary" @click="dialogTableVisible = true">＋新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" align="center" width="65" />
      <el-table-column :label="'公式名称'" align="center" width="150" />
      <el-table-column :label="'显示公式'" align="center" width="150" />
      <el-table-column :label="'公式值'" align="center" width="100" />
      <el-table-column :label="'创建时间'" align="center" width="100" />
      <el-table-column :label="'创建人'" align="center" width="100" />
      <el-table-column :label="'修改时间'" align="center" width="100" />
      <el-table-column :label="'修改人'" align="center" width="100" />
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row,scope.$index)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogTableVisible"
      :title="'新增计算公式'">
      <el-row>
        <el-col :span="20">
          <el-form ref="centerForm" :model="formCenter" :rules="rules" :label-position="'right'" label-width="80px">
            <el-form-item :label="'公式名称'" prop="formulaName">
              <el-input v-model="formCenter.formulaName" />
            </el-form-item>

            <el-form-item :label="'显示公式'" prop="showFormula">
              <el-input v-model="formCenter.showFormula" />
            </el-form-item>

            <el-form-item :label="'公式值'" prop="formulaValue">
              <el-input v-model="formCenter.formulaValue" />
            </el-form-item>
            <el-form-item :label="'入口参数'">
              <el-input v-model="formCenter.entryParams" />
            </el-form-item>
            <el-form-item :label="'备注'">
              <el-input v-model="formCenter.remark" :rows="6" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span style="color:red">*公式值中静态参数用静态参数英文名称显示，且用#提示；动态参数用X表示。
      例如：#RATEDENERGY#*X/1000</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="headleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pagingMixin } from '@/mixins/table'
import { partialForm } from '@/mixins/partialForm'
import waves from '@/directive/waves' // 水波纹指令
import elDragDialog from '@/directive/el-dragDialog' // 可拖动弹窗
export default {
  name: 'FormulaConfig',
  directives: {
    elDragDialog,
    waves
  },
  mixins: [pagingMixin, partialForm],
  data() {
    const validateformulaName = (rule, value, cb) => {
      // console.log(value)
      if (!value) {
        return cb(new Error('请输入公式名称'))
      }
    }
    const validateshowFormula = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入公式显示名称'))
      }
    }
    const validateformulaValue = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请输入公式显示名称'))
      }
    }
    return {
      dialogTableVisible: false,
      listLoading: false,
      list: [],
      listQuery: {
        formulaValue: ''
      },
      formCenter: {
        formulaName: '', // 公式名称
        showFormula: '', // 显示公式
        formulaValue: '', // 公式值
        entryParams: '', // 入口
        remark: '' // 备注
      },
      rules: {
        formulaName: { required: true, trigger: 'blur', validator: validateformulaName },
        showFormula: { required: true, trigger: 'blur', validator: validateshowFormula },
        formulaValue: { required: true, trigger: 'blur', validator: validateformulaValue }
      }
    }
  },
  methods: {
    handleSelect() {

    },
    listLoad() {

    },
    handleUpdate(row, index) {

    },
    headleCancel() {
      this.dialogTableVisible = false
    },
    submitForm() {
      const checkForm = this.checkForm({ formName: 'centerForm', formList: ['formulaName', 'showFormula', 'formulaValue'] })
      if (!checkForm) {
        return false
      }
      this.dialogTableVisible = false
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
