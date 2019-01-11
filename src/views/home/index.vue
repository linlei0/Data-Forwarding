<template>
  <div>
    <el-row :gutter="70" class="panel-group" type="flex" justify="center" align="middle">
      <el-col :span="7" class="card-panel-col" >
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待配置
            </div>
            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/>

          </div>
        </div>
      </el-col>
      <el-col :span="7" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待检查
            </div>
            <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待转发
            </div>
            <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <div>
      <!-- <div id="echart" style="width:80%;height:300px"/> -->
    </div>
  </div>
</template>
<script>
// separator
import CountTo from 'vue-count-to'
import echarts from 'echarts'
export default {
  name: 'Home',
  components: { CountTo },
  data() {
    return {
      charts: null
    }
  },
  computed: {

  },
  mounted() {
    // this.echartsInit()
  },
  methods: {
    echartsInit() {
      console.log(echarts)
      this.charts = echarts.init(document.getElementById('echart'))
      var option = {
        title: {
          text: '销量柱状图' // 标题文本内容
        },
        toolbox: { // 可视化的工具箱
          show: true,
          orient: 'vertical',
          x: 'right',
          y: 'top',
          feature: {
            mark: { show: true },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: { // 弹窗组件
          show: true
          // trigger: 'axis'
        },
        dataZoom: {
          show: true,
          realtime: false,
          start: 0
          // end: end
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]

      }
      this.charts.setOption(option, true)
    },
    handleDownload() {
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      //   const data = [[0, '标题1', 'linlei', 3029, '2018-11-15'],
      //     [0, '标题1', 'linlei', 3029, '2018-11-15'],
      //     [0, '标题1', 'linlei', 3029, '2018-11-15']]
      //   excel.export_json_to_excel({
      //     /* 表头 必填*/
      //     header: tHeader,
      //     /* 具体数据 必填*/
      //     data,
      //     /* 非必填*/
      //     filename: 'excel-list',
      //     autoWidth: true,
      //     bookType: 'xlsx'
      //   })
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$color:#409EFF;
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border: 1px solid $color;
    border-radius: 4px;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        padding:8px 0;
        // margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
