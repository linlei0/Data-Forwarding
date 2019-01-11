<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card :body-style="{padding:0}" class="box-card" shadow="never">
          <div slot="header">
            <span>角色</span>
          </div>
          <div class="scroll_div">
            <el-scrollbar style="height:100%;" wrap-class="default-scrollbar__wrap">
              <ul >
                <li v-for="(item,index) in dataList" :key="index" :class="item.isActive?'span_list':''" @click="toggleRole(item,index)">
                  <span >{{ item.text }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>

        </el-card>
      </el-col>
      <el-col :span="19" >
        <el-card :body-style="{padding:0}" class="box-card" shadow="never">
          <div slot="header">
            <span>菜单列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="saveChecked">保存</el-button>
          </div>
          <div class="scroll_div">
            <el-scrollbar style="height:100%" wrap-class="default-scrollbar__wrap scroll1">
              <el-tree
                ref="tree"
                :data="treeData"
                :default-checked-keys="defaultCheckedKeys"
                :expand-on-click-node="false"
                :default-expand-all="true"
                node-key="id"
                show-checkbox
              />
            </el-scrollbar>
          </div>

        </el-card>

      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getRoleList, getRoleMenu, getRoleMenuSetting, setRoleMenuSetting } from '@/api/system/menuAuthorize'
export default {
  name: 'MenuAuthorize',
  components: {},
  data() {
    return {
      loading: false,
      roleId: '',
      defaultCheckedKeys: [],
      dataList: [],
      treeData: []
    }
  },
  created() {
    this.getRoleList()
  },

  methods: {
    // 获取左侧角色列表
    getRoleList() {
      this.loading = true
      getRoleList().then(({ data }) => {
        if (data.code === 0) {
          this.loading = false
          for (let i = 0; i < data.data.length; i++) {
            const o = { isActive: false }
            if (i === 0) {
              o.isActive = true
              this.roleId = data.data[0].value
            }
            this.dataList.push(
              { ...data.data[i], ...o }
            )
          }
          this.getRoleMenu()
        }
      })
    },
    // 获取全部菜单
    getRoleMenu() {
      getRoleMenu().then(({ data }) => {
        if (data.code === 0) {
          this.treeData = data.data
          this.getRoleMenuSetting({ roleId: this.roleId })
        }
      })
    },
    // 获取当前用户的权限
    getRoleMenuSetting(params) {
      getRoleMenuSetting(params).then(({ data }) => {
        if (data.code === 0) {
          // console.log(data.data)
          this.defaultCheckedKeys = data.data
          this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
        }
      })
    },
    // 切换角色用户
    toggleRole(item, index) {
      if (this.roleId === item.value) {
        return
      }
      this.roleId = item.value
      for (let i = 0; i < this.dataList.length; i++) {
        if (i === index) {
          this.dataList[index].isActive = true
        } else {
          this.dataList[i].isActive = false
        }
      }
      //
      this.getRoleMenuSetting({ roleId: this.roleId })
      document.querySelector('.scroll1').scrollTop = 0
    },
    // 保存
    saveChecked() {
      // console.log(this.$refs.tree.getCheckedNodes())
      const menus = this.$refs.tree.getCheckedKeys()
      const data = { menus: JSON.stringify(menus), roleId: this.roleId }
      setRoleMenuSetting(data).then(({ data }) => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
$hover_color:#ECF5FF;

.scroll_div{
  height: calc(100vh - 240px);
}
ul{
  padding: 0;
  margin: 0;
  li{
    list-style-type: none;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
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
