<template>
  <div>
    <template v-for="list in menuList" v-if="!list.hidden" >
      <el-submenu v-if="list.children" :key="list.pathName" :index="list.path" >
        <template slot="title" style="padding-left:10px" >
          <i class="el-icon-menu"/>
          <span slot="title" >{{ list.menuName }}</span>
        </template>
        <Menu :menuList="list.children"/>
      </el-submenu>
      <el-menu-item v-else :index="list.path" :key="list.pathName" style="padding-left: 50px;">
        <span>{{ list.menuName }}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<style>
  .el-menu--collapse  span,
  .el-menu--collapse  i.el-submenu__icon-arrow
  {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }
</style>
<script>
export default {
  name: 'Menu',

  props: {
    menuList: {
      type: Array,
      required: true
    }
  }, // 模板名称
  data() {
    return {

    }
  },
  created() {
    // console.log(this.menuList)
  },
  methods: {
    getData(e) {
      // console.log(e)

    }
  }

}
</script>

