<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :span="5" >
        <div style="border:1px solid #EBEEF5;background:#fff">
          <div class="menu_btnlist">
            <el-row>
              <el-col :span="8">
                <div class="add_menu menu_btn" @click="addMenu">
                  新增
                </div>

              </el-col>
              <el-col :span="8">
                <div class="update_menu menu_btn" @click="updateMenu">
                  修改
                </div>

              </el-col>
              <el-col :span="8">
                <div class="remove_menu menu_btn" @click="deletaMenu">
                  删除
                </div>

              </el-col>
            </el-row>
          </div>
          <div class="scroll_list">
            <el-scrollbar style="height:100%" wrap-class="default-scrollbar__wrap">
              <el-tree
                ref="tree"
                :data="treeData"
                :expand-on-click-node="false"
                :default-expand-all="true"
                node-key="id"
                @node-click="treeClick"
                @node-expand="InitializeId"
                @node-collapse ="InitializeId"
              />
            </el-scrollbar>

          </div>

        </div>
      </el-col>
      <el-col :span="19">
        <el-card v-show="id" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>详细信息</span>
          </div>
          <div>
            <div class="menu_info1 menu_info_div">
              <el-row>
                <el-col :span="12">
                  <span>上级菜单:{{ menuInfo.parentMenu }}</span>
                </el-col>
                <el-col :span="12">
                  <span>菜单名称:{{ menuInfo.menuName }}</span>
                </el-col>
              </el-row>

            </div>
            <div class="menu_info1 menu_info_div">
              <span>&nbsp;&nbsp;&emsp;name:{{ menuInfo.pathName }}</span>
            </div>
            <div class="menu_info1 menu_info_div">
              <el-row>
                <el-col :span="12">
                  <span>同层顺序:{{ menuInfo.orderNo }}</span>
                </el-col>
                <el-col :span="12">
                  <span>是否禁用:{{ menuInfo.isDisabled }}</span>
                </el-col>
              </el-row>

            </div>
            <!-- <span>id:{{ id }}</span>
            <p>parentid:{{ parentId }}</p> -->
          </div>
        </el-card>

      </el-col>
    </el-row>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogTableVisible"
      :before-close="closeDia"
      :title="!isEidt?'新增系统菜单':'修改系统菜单'">
      <el-row>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="80px">
            <el-form-item label="父级菜单">
              <el-input v-model="formInfo.parentMenu" disabled/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="80px">
            <el-form-item label="菜单名称">
              <el-input v-model="formInfo.menuName" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form :label-position="'right'" label-width="80px">
            <el-form-item label="name">
              <el-input v-model="formInfo.pathName" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="80px">
            <el-form-item label="同级排序">
              <el-input v-model="formInfo.orderNo" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :label-position="'right'" label-width="80px">
            <el-form-item label="是否可用">
              <el-radio-group v-model="formInfo.isDisabled" @change="radioChange">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
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
// import { mapGetters } from 'vuex'
let id = Math.floor(Math.random() * 1000)
import { getMenu, addMenu, updateMenu, deleteMenu } from '@/api/system/menu'
import elDragDialog from '@/directive/el-dragDialog'
export default {
  name: 'Menumanager',
  directives: {
    elDragDialog
  },
  components: { },
  data() {
    return {
      loading: false,
      isEidt: false,
      dialogTableVisible: false,
      treeData: [],
      id: '',
      parentId: '',
      choiceTreeNode: null,
      choiceTreeData: null,
      menuInfo: { // 显示右侧面板数据
        parentMenu: '', // 上级菜单
        menuName: '', // 菜单名称
        pathName: '', // name名称
        orderNo: '', // 同层顺序
        isDisabled: '否'
      },
      formInfo: { // 绑定弹窗数据
        parentMenu: '', // 父级菜单
        menuName: '', // 菜单名称
        pathName: '', // name
        orderNo: '', // 同层顺序
        isDisabled: '0'
      }
    }
  },
  computed: {
  },
  watch: {
    treeData() {
      console.log('改变了')
      this.$forceUpdate()
    }
  },
  created() {
    this.getMenu()
  },
  mounted() {

  },
  methods: {
    sortorderNo(a, b) {
      return a.orderNo - b.orderNo
    },
    treeClick(e) {
      this.choiceTreeNode = this.$refs.tree.getNode(e.id)
      this.choiceTreeData = this.$refs.tree.getNode(e.id).data
      // console.log(this.choiceTreeNode)
      this.menuInfo = {
        parentMenu: this.$refs.tree.getNode(e.id).parent.parent ? this.$refs.tree.getNode(e.id).parent.data.label : '顶层菜单',
        menuName: e.label,
        orderNo: e.orderNo,
        pathName: e.pathName,
        isDisabled: e.isDisabled === 1 ? '是' : '否'
      }
      this.id = e.id
      this.parentId = this.$refs.tree.getNode(e.id).parent.parent ? this.$refs.tree.getNode(e.id).parent.data.id : ''
    },
    InitializeId(e) {
      this.id = ''
      this.parentId = ''
    },
    restForm() {
      this.formInfo = {
        parentMenu: '', // 父级菜单
        menuName: '', // 菜单名称
        pathName: '', // name
        orderNo: '', // 同层顺序
        isDisabled: '0'
      }
      this.dialogTableVisible = false
    },
    // 获取数据
    getMenu() {
      this.loading = true
      getMenu().then(({ data }) => {
        this.loading = false
        this.treeData = data.data
      })
    },
    // 添加菜单
    addMenu() {
      // console.log(this.menuInfo)
      this.dialogTableVisible = true
      this.formInfo.parentMenu = this.parentId ? this.menuInfo.menuName : '顶层菜单'
    },
    // 修改菜单
    updateMenu() {
      console.log(this.treeData)
      if (!this.id) {
        this.$alert('请选中需要修改的菜单', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.dialogTableVisible = true
      this.isEidt = true
      this.formInfo = { ...this.menuInfo }
      this.formInfo.isDisabled = this.menuInfo.isDisabled === '是' ? '1' : '0'
    },
    // 删除菜单
    deletaMenu() {
      if (!this.id) {
        this.$alert('请选中需要删除的菜单', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm(`您确定删除${this.menuInfo.menuName}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({ id: this.id }).then(({ data }) => {
          // this.getMenu()
          const parent = this.choiceTreeNode.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === this.choiceTreeData.id)
          children.splice(index, 1)
          this.$message({
            type: 'success',
            message: '已删除'
          })
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    radioChange(e) {
      // console.log(e)
      this.formInfo.isDisabled = e
    },
    closeDia(done) {
      this.isEidt = false
      this.restForm()
      done()
    },
    headleCancel() {
      this.isEidt = false
      this.restForm()
    },
    submitForm() {
      if (!this.formInfo.menuName) {
        this.meassageConfirm('请输入菜单名称')
        return false
      }
      if (!this.formInfo.pathName) {
        this.meassageConfirm('请输入name')
        return false
      }
      if (!this.formInfo.orderNo) {
        this.meassageConfirm('请输入同级排序')
        return false
      }
      // 新增
      if (!this.isEidt) {
        addMenu({ ...this.formInfo, ...{ parentId: this.parentId }}).then(({ data }) => {
          const newChild = { ...{ id: id++ },
            ...{ label: this.formInfo.menuName },
            ...this.formInfo,
            ...{ isDisabled: this.formInfo.isDisabled * 1 },
            ...{ children: [] }}
          if (!this.id) {
            this.treeData.push(newChild)
            this.treeData.sort(this.sortorderNo)
          } else {
            if (!this.choiceTreeData.children) {
              this.$set(this.choiceTreeData, 'children', [])
            }
            this.choiceTreeData.children.push(newChild)
            this.choiceTreeData.children.sort(this.sortorderNo)
          }
          this.restForm()
          this.$message({
            type: 'success',
            message: '已新增'
          })
        })
      } else { // 修改
        updateMenu({ ...this.formInfo, ...{ id: this.id }}).then(({ data }) => {
          if (data.code === 0) {
            this.menuInfo = { ...this.formInfo }
            this.menuInfo.isDisabled = this.menuInfo.isDisabled === '1' ? '是' : '否'
            console.log(this.treeData)
            this.updateTreeData(this.treeData, this.formInfo)
            this.$forceUpdate()
            this.restForm()
            this.$message({
              type: 'success',
              message: '已修改'
            })
          }
        })
      }
    },
    updateTreeData(obj, updateObj) {
      obj.forEach(r => {
        if (r.id === this.id) {
          r.orderNo = updateObj.orderNo * 1
          r.label = updateObj.menuName
          r.isDisabled = updateObj.isDisabled * 1
          r.pathName = updateObj.pathName
        }
        if (!r.children) {
          obj.sort((a, b) => {
            return a.orderNo - b.orderNo
          })
        }
        if (r.children && r.children.length > 0) {
          r.children.sort((a, b) => {
            console.log(a.orderNo, b.orderNo)
            return a.orderNo - b.orderNo
          })
          this.updateTreeData(r.children, this.formInfo)
        }
      })
    },
    meassageConfirm(text) {
      this.$alert(text, '警告', {
        confirmButtonText: '确定',
        type: 'warning',
        callback: action => {
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$color:#409EFF;
$dangerColor:#F56C6C;
  .menu_info_div{
    padding: 5px;
    font-size: 14px;
  }
  .menu_btnlist{
    border-bottom: 1px solid #ebeef5;
    .update_menu{
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
    }

    .menu_btn{
      text-align: center;
      padding: 10px 0;
      font-size: 14px;
      cursor: pointer;
      color: $color;
    }
    .remove_menu{
      color: $dangerColor
    }
  }
  .scroll_list{
       height: calc(100vh - 220px  );
  }
</style>
