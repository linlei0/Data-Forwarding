<template>
  <div>
    <div class="search_list">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="24">
          <el-form :inline="true" :model="listQuery">
            <el-form-item label="协议名称">
              <el-autocomplete
                v-model="listQuery.variableName"
                :fetch-suggestions="querySearch"
                clearable
                @select="handleSelect">
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

    <el-table
      v-loading="listLoading"
      :data ="list"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ (scope.$index+1)+(listQuery.pageNum-1)*listQuery.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'协议名称'" align="center" width="200" />
      <el-table-column :label="'协议版本'" align="center" width="200" />
      <el-table-column :label="'是否需要密码'" align="center" width="150" />
      <el-table-column :label="'是否需要注册'" align="center" width="150" />
      <el-table-column :label="'加密方式'" align="center" />
      <el-table-column :label="$t('table.actions')" align="center" width="200">
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
      :title="!isEdit?'新增协议数据':'修改协议数据'">
      <el-row>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="100px">
            <el-form-item label="协议名称">
              <el-input v-model="dialogForm.protocolName"/>
            </el-form-item>
            <el-form-item label="协议版本">
              <el-input v-model="dialogForm.protocolVersion"/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="100px">
            <el-form-item label="协议模块名称">
              <el-input v-model="dialogForm.protocolModelName"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="100px">
            <el-form-item label="是否需要密码">
              <el-radio-group v-model="dialogForm.isPwd">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="100px">
            <el-form-item label="是否需要注册">
              <el-radio-group v-model="dialogForm.isRegiste">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
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
import { pagingMixin } from '@/mixins/table'

import waves from '@/directive/waves' // 水波纹指令
import elDragDialog from '@/directive/el-dragDialog' // 可拖动弹窗
export default {
  name: 'ProtocloConfig',
  directives: {
    waves,
    elDragDialog
  },
  mixins: [pagingMixin],
  data() {
    return {
      restaurants: [{ 'value': '数据项名称一' }],
      total: null,
      isEdit: false,
      list: [],
      listLoading: false,
      dialogTableVisible: false,
      dialogForm: {
        protocolName: '', // 协议名称
        protocolModelName: '', // 协议模块名称
        protocolVersion: '', // 协议版本
        isPwd: 0, // 是否需要密码
        isRegiste: 0 // 是否需要注册
      },
      listQuery: {
        variableName: ''
      }
    }
  },
  computed: {
  },
  methods: {
    listLoad() {

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
    handleSelect(item) {
      console.log(item)
    },
    headleCancel() {
      this.dialogTableVisible = false
    },
    submitForm() {
      this.dialogTableVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.search_list{
  .el-form-item{
    margin-bottom: 0
  }
}
</style>
