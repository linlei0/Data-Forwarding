<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card :body-style="{padding:0}" class="box-card" shadow="never">
          <div slot="header">
            <span>菜单</span>
          </div>
          <div class="scroll_div">
            <el-scrollbar style="height:100%;" wrap-class="default-scrollbar__wrap">
              <ul >
                <li v-for="(item,index) in dataList" :key="index" :class="item.isActive?'span_list':''" @click="toggleRole(index)">
                  <span >{{ item.name }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>

        </el-card>
      </el-col>
      <el-col :span="19">

        <el-card :body-style="{padding:0}" class="box-card" shadow="never">
          <div slot="header">
            <span>用户名称</span>
            <el-button v-waves style="float: right; padding:10px;margin-top:-10px" type="danger">删除选中</el-button>
            <el-button v-waves style="float: right; padding:10px;margin:-10px 10px 0 0" type="primary" @click="addForwordUserName">+ 新增</el-button>
          </div>
          <div class="scroll_div">
            <el-scrollbar style="height:100%;" wrap-class="default-scrollbar__wrap">
              <el-table
                v-loading="listLoading"
                ref="multipleTable"
                :data="list"
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
                <el-table-column :label="$t('table.actions')" align="center" width="100" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="handleDelete(scope)">{{ $t('table.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
              </div>
            </el-scrollbar>
          </div>
        </el-card>

      </el-col>
    </el-row>
    <dialog-table
      :show.sync="show"
      :title="'为用户添加转发用户'"
      @updateShow="updateShow"
    />
  </div>
</template>

<script>
import { pagingMixin } from '@/mixins/table'
import { forwordUserList, forwordUserNameList } from '@/api/forwordUser'
import waves from '@/directive/waves' // 水波纹指令
import dialogTable from './components/index'
export default {
  name: 'ForwardUserAuthorize',
  components: { dialogTable },
  directives: {
    waves
  },
  mixins: [pagingMixin],
  data() {
    return {
      show: false,
      total: 0,
      listLoading: false,
      list: [],
      choiceList: [],
      listQuery: {
        forwordUserId: ''
      },
      dataList: []
    }
  },
  computed: {},
  created() {
    this.getUserList()
  },
  methods: {
    updateShow(e) {
      this.show = e
    },
    addForwordUserName() {
      this.show = true
      console.log(this.show)
    },
    getUserList() {
      forwordUserList().then(({ data }) => {
        if (data.code === 0) {
          for (let i = 0; i < data.data.length; i++) {
            const o = { isActive: false }
            if (i === 0) {
              o.isActive = true
            }
            // 两种合并方法任选一种
            this.dataList.push(
              // Object.assign(data.data[i], o)
              { ...data.data[i], ...o }
            )
          }
          this.listQuery.forwardUserId = data.data.forwardUserId
        }
      })
    },
    toggleRole(index) {
      for (let i = 0; i < this.dataList.length; i++) {
        if (i === index) {
          this.dataList[index].isActive = true
        } else {
          this.dataList[i].isActive = false
        }
      }
      // document.querySelector('.center_content').scrollTop = 0
    },
    listLoad() {
      this.listLoading = true
      forwordUserNameList(this.listQuery).then(({ data }) => {
        this.list = data.data
        this.total = data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(e) {
      // .this
    },
    deleteChoice() {
      // for (let i = 0; i < this.list.length; i++) {
      //   for (let j = 0; j < this.choiceList.length; j++) {

      //   }
      // }
    },
    handleDelete(e) {
      // this.list.splice(e.$index, 1)
      this.$confirm('是否删除此用户名称?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(e.$index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
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
$color:#409EFF;
$hover_color:#ECF5FF;
$height:36px;
.scroll_div{
  height: calc(100vh - 101px - 58px);
}
 ul{
  padding: 0;
  margin: 0;
  li{
    list-style-type: none;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
   text-indent: 10px;
    &:hover{
      background: $hover_color;
    }
  }
  .span_list{
     background: $hover_color;
  }
}

</style>
