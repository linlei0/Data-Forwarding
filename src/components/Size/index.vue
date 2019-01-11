<template>
  <el-dropdown size="medium" @command="handleSetSize">
    <el-button type="text" class="btn-icon">
      <!-- <svg-icon icon-class="font-size" /> -->
      <img src="../../assets/images/font-icon.png" alt="">
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="size==='medium'" command="medium">{{ '中' }}</el-dropdown-item>
      <el-dropdown-item :disabled="size==='small'" command="small">{{ '小' }}</el-dropdown-item>
      <el-dropdown-item :disabled="size==='mini'" command="mini">{{ '最小' }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('app/setSize', size)
      this.refreshView()
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('delAllCachedViews', true)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
