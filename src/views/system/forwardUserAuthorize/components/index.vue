<template>
  <div>
    <el-dialog
      v-loading="listLoading"
      v-el-drag-dialog
      :visible.sync="dialogTableVisible"
      :title="title"
      :show="show"
      @close="closedia"
    >
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form :label-position="'right'" label-width="80px">
            <el-form-item label="用户名称">
              <el-input v-model.trim="listQuery.query" @keyup.enter.native="handleFilter"/>
            </el-form-item>
        </el-form></el-col>
        <el-col :span="5">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>

        </el-col>
      </el-row>

      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="list"
        :height="total>6?7*44:(total+1)*44+1"
        border
        style="width:100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          align="center"
          width="55">
          <template slot-scope="scope">{{ (scope.$index+1)+(listQuery.pageNum-1)*listQuery.pageSize }}</template>
        </el-table-column>
        <el-table-column
          type="selection"
          align="center"
          width="55"/>
        <el-table-column
          prop="forwordUserName"
          align="center"
          label="用户名称"
        />
      </el-table>
      <div class="pagination-container">
        <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="headleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addforwordUserNameList } from '@/api/system/forwordUser'
import { pagingMixin } from '@/mixins/table'
import waves from '@/directive/waves' // 水波纹指令
import elDragDialog from '@/directive/el-dragDialog' // 可拖动弹窗
export default {
  directives: {
    waves,
    elDragDialog
  },
  components: {},
  mixins: [pagingMixin],
  props: {
    title: {
      type: String,
      default: '提示'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      total: 0,
      listLoading: false,
      list: [],
      listQuery: {
        forwordUserId: ''
      }
    }
  },
  watch: {
    show() {
      console.log(this.show)
      this.dialogTableVisible = this.show
    }
  },

  created() {
    // this.dialogTableVisible = this.show
    console.log(this.dialogTableVisible)
  },
  methods: {
    listLoad() {
      this.listLoading = true
      addforwordUserNameList(this.listQuery).then(({ data }) => {
        console.log(data)
        this.list = data.data
        this.total = data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(e) {
      // .this
    },
    headleCancel() {
      this.$emit('updateShow', false)
      this.dialogTableVisible = false
    },
    submitForm() {
      this.$emit('updateShow', false)
      this.dialogTableVisible = false
    },
    closedia() {
      this.$emit('updateShow', false)
    }

  }
}
</script>

<style lang='scss' scoped>
  .el-dialog__body{
    padding: 20px 0 !important
  }
</style>
