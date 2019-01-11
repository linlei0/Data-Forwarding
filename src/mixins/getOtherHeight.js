const otherHeight = {
  methods: {
    getOtherHeight(obj) {
      if (obj) {
        // 如果有部分 结构不类似在此计算高度
      }
      // 获取header高度
      const headerHeight = document.querySelector('.app-header').offsetHeight
      // 获取app-main-wrapper padding值
      const mainWrapperPadding = this.getStyle(document.querySelector('.app-main-wrapper'), 'padding') * 2
      // 获取tags-view-container高度
      const tagsViewHeight = document.querySelector('.tags-view-container').offsetHeight
      // 获取app-main padding值
      const appMainPadding = this.getStyle(document.querySelector('.app-main'), 'padding') * 2
      // 获取 search_list高度
      const searchHeight = document.querySelector('.search_list').offsetHeight
      // 获取add-btn 高度
      const btnHeight = document.querySelector('.add-btn').offsetHeight
      // 获取add-btn padding值
      const btnPadding = this.getStyle(document.querySelector('.add-btn'), 'paddingTop') * 2
      // 获取 分页器高度pagination-container
      const paginationHeight = document.querySelector('.pagination-container').offsetHeight

      const otherHeight = headerHeight + mainWrapperPadding + tagsViewHeight + appMainPadding + searchHeight + btnPadding + btnHeight + paginationHeight + 5

      return otherHeight
    },
    getStyle(obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr].replace('px', '')
      } else {
        return document.defaultView.getComputedStyle(obj, null)[attr].replace('px', '')
      }
    }
  }
}
export { otherHeight }
