<template>
  <div class="spectrum-container">
    <div class="chart-container">
      <div id="main-chart" ref="mainChart"></div>
    </div>
    <div class="chart-container">
      <div id="detail-chart" ref="detailChart"></div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import exporting from 'highcharts/modules/exporting'
import exportData from 'highcharts/modules/export-data'
import accessibility from 'highcharts/modules/accessibility'
import Boost from 'highcharts/modules/boost';
Boost(Highcharts);


// 初始化Highcharts模块
exporting(Highcharts)
exportData(Highcharts)
accessibility(Highcharts)

export default {
  name: 'EchartsXHFX',
  props: {
    shebeiID: {
      type: String,
      default: '333',
    },
    minvalue: {
      type: Number,
      default: 0,
    },
    maxvalue: {
      type: Number,
      default: 1000,
    },
    // 修改为小写开头的camelCase
    messagesdata: {
      type: Array,
      default:()=>[],
    },
  },
  data() {
    return {
      mainChart: null,
      detailChart: null,
      spectrumData: [],
      bottomMIN:'',
      bottomMAX:'',
      // socket: null,
      minvalueZJ:0,
      maxvalueZJ:100,
      optionTop:{
         chart: {
          type: 'line',
          zoomType: 'x',
          panning: true,
          backgroundColor: "rgba(0,0,0,0)",
          panKey: 'shift',
          events: {
            selection: event => this.handleSelection(event)
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          title: {
            text: '频率 (Hz)'
          },
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
          min: this.minvalueZJ,
          max: this.maxvalueZJ,
          showLastLabel: true,
          gridLineColor: "rgba(46, 54, 92, 0.69)",
          lineColor: "rgba(165,165,165, 0.3)",
          showFirstLabel: true,
          tickColor: false,
          plotBands: [], //标注区
          plotLines: [],
        },
        yAxis: {
          title: {
            enabled: false,
          },
          gridLineColor: "rgba(46, 54, 92, 0.69)",
          lineColor: "rgba(46, 54, 92, 0.69)",
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            animation: false, // 禁用动画
            marker: { enabled: false }, // 关闭数据点标记
            shadow: false, // 关闭阴影
            lineWidth: 1 ,// 减少线宽
            point: {
              events: {
                click: event => this.handlePointClick(event.point)
              }
            }
          }
        },
        boost: {
          enabled: true, // 必须开启
          useGPUTranslations: true, // 启用GPU加速
          seriesThreshold: 1 // 当序列数超过阈值时启用boost
        },

        series: [
            {
                color: "#00ffff",
                marker: {
                  enabled: false,
                },
                turboThreshold: 0,
                boostThreshold: 1,  // 强制所有系列使用boost
                dataGrouping: {
                  enabled: true,    // ✅ 关键：在boost模式下启用分组
                  approximation: 'average',
                  groupPixelWidth: 4
                },
                enableMouseTracking: false,
                type: "line",
                data: [],
                lineWidth: 0.5,
            }
        ],
        tooltip: {
          valueDecimals: 2
        },
        exporting: {
          enabled: false
        },
        credits: {
          //版权
          enabled: false,
        },

      },
      optionBotoom:{
        chart: {
          zoomType: "x",
          backgroundColor: "rgba(0,0,0,0)",
          polar: true,
          type: "line",
        },
        reflow: true,
        credits: {
          //版权
          enabled: false,
        },
        resetZoomButton: {
          // theme: { style: { display: 'none'} }
        },
        title: {
          text: '',
          style: {
            color: '#dfdfdf',
          },
        },
        xAxis: {
          title: {
            text: ''
          },
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
          min: 0,
          max: 100,
          showLastLabel: true,
          gridLineColor: "rgba(46, 54, 92, 0.69)",
          lineColor: "rgba(165,165,165, 0.3)",
          showFirstLabel: true,
          tickColor: false,
          plotBands: [], //标注区
          plotLines: [],
        },
        yAxis: {
          title: {
            text: ''
          },
          min: 0,
          gridLineColor: "rgba(46, 54, 92, 0.69)",
          lineColor: "rgba(46, 54, 92, 0.69)",
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
        },
        legend: {
          enabled: false
        },
        boost: {
          enabled: true, // 必须开启
          useGPUTranslations: true, // 启用GPU加速
          seriesThreshold: 1 // 当序列数超过阈值时启用boost
        },
        series: [
        {
          color: "#00ffff",
            marker: {
              enabled: false,
            },
            turboThreshold: 0,
                boostThreshold: 1,  // 强制所有系列使用boost
                dataGrouping: {
                  enabled: true,    // ✅ 关键：在boost模式下启用分组
                  approximation: 'average',
                  groupPixelWidth: 4
            },
            animation: false,
            enableMouseTracking: false,
            type: "line",
            data: [],
            lineWidth: 0.5,
        }
        ],
        tooltip: {
          valueDecimals: 2
        },
        //右上角菜单
        exporting: {
          enabled: false
        },
        

      },

    }
  },
  mounted() {
    this.initCharts()
    this.loadData()
  },
  beforeDestroy() {
    // 销毁图表实例
    if (this.mainChart) {
      this.mainChart.destroy()
    }
    if (this.detailChart) {
      this.detailChart.destroy()
    }
  },
  watch: {
        messagesdata: {
          handler(val) {
            console.log(val,'messages');
            this.spectrumData = val;
            if (val.length) {
              // this.initCharts();
              this.updateCharts(val,this.maxvalue,this.minvalue)
            }
          },
          deep: true,
          immediate: true
        },
     
  },
  methods: {

    
    // 模拟或加载实际频谱数据
    loadData() {
      // 这里替换为实际的API调用
      // this.fetchSpectrumData().then(data => {
      //   this.spectrumData = data
      //   this.updateCharts()
      // })
      // 模拟数据
      this.generateMockData().then(data => {
        this.spectrumData = data
        console.log(data,'模拟数据');
        
        this.updateCharts(this.spectrumData,100000,0)
      })
    },
    // 生成模拟频谱数据
    generateMockData() {
      return new Promise(resolve => {
        const data = []
        for (let i = 0; i < 100000; i++) {
          // 模拟几个不同频率的峰值
          const value = Math.random() * 0.5 + 
            Math.sin(i / 20) * 0.5 + 
            Math.sin(i / 5) * 0.3 + 
            Math.sin(i / 50) * 0.2
          data.push([i, Math.max(0, value)])
        }
        resolve(data)
      })
    },
    
    // 初始化图表
    initCharts() {
      // 主图表配置
      this.mainChart = Highcharts.chart(this.$refs.mainChart,this.optionTop)

      // 细节图表配置
      this.detailChart = Highcharts.chart(this.$refs.detailChart,this.optionBotoom)
    },
    
    // 更新图表数据
    updateCharts(data,max,min) {

      if (!this.mainChart || !this.detailChart) return
      console.log(data,max,min);
      
      this.mainChart.xAxis[0].setExtremes(min, max, false);
      this.mainChart.series[0].setData(data,false)
      this.mainChart.redraw();
      // 初始显示前100个点
      // this.updateDetailChart(0, 100)
    },
    
    // 处理框选事件
    handleSelection(event) {
      if (event.xAxis) {
        const min = Math.floor(event.xAxis[0].min)
        const max = Math.ceil(event.xAxis[0].max)
        // this.bottomMIN=min
        // this.bottomMAX=max
        this.$emit('handleSelection',{min:min,max:max})
        this.updateDetailChart(min, max)
      }
      return true
    },
    
    // 处理点击事件
    handlePointClick(point) {
      const range = 50 // 显示点击点前后50个点
      const min = Math.max(0, point.x - range)
      const max = Math.min(this.spectrumData.length - 1, point.x + range)
      this.updateDetailChart(min, max)
      
      // 在主图上高亮显示选中区域
      this.highlightSelection(min, max)
    },
    
    // 更新细节图表
    updateDetailChart(min, max) {
      const filteredData = this.spectrumData.filter(
        point => point[0] >= min && point[0] <= max
      )
      this.detailChart.series[0].setData(filteredData)
      this.detailChart.xAxis[0].setExtremes(min, max)
      
      // 在主图上高亮显示选中区域
      this.highlightSelection(min, max)
    },
    
    // 在主图上高亮选中区域
    highlightSelection(min, max) {
      this.mainChart.xAxis[0].removePlotBand('selection-band')
      this.mainChart.xAxis[0].addPlotBand({
        from: min,
        to: max,
        color: 'rgba(68, 170, 213, 0.2)',
        id: 'selection-band'
      })
    },
    
    // 实际项目中从API获取数据的方法
    async fetchSpectrumData() {
      try {
        const response = await this.$http.get('/api/spectrum')
        return response.data.map((item, index) => [index, item.amplitude])
      } catch (error) {
        console.error('获取频谱数据失败:', error)
        return []
      }
    }
  }
}
</script>

<style scoped>
.spectrum-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ffffff26;
}

.chart-container {
  width: 100%;
  height: 50%;
  margin-bottom: 20px;
}

#main-chart,
#detail-chart {
  width: 100%;
  height: 100%;
}
</style>