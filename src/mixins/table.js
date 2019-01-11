/**
 * 分页查询混入
 * 组件必须有一个listLoad方法用来加载列表数据
 */
const pagingMixin = {
  data: function() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  /**
   * 组件挂载自动查询
   */
  created() {
    this.listLoad()
  },
  methods: {
    /**
     * 处理查询
     */
    handleFilter() {
      this.listQuery.pageNum = 1
      this.listLoad()
    },
    /**
     * 处理分页大小改变
     * @param {number} value - 分页大小
     */
    handleSizeChange(value) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = value
      this.listLoad()
    },
    /**
     * 处理页码改变
     * @param {number} value - 页码
     */
    handleCurrentChange(value) {
      // console.log(value)
      this.listQuery.pageNum = value
      this.listLoad()
    }
  }
}

export {
  pagingMixin
}
