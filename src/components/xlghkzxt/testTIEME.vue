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

// 初始化Highcharts模块
exporting(Highcharts)
exportData(Highcharts)
accessibility(Highcharts)

export default {
  name: 'SpectrumChart',
  data() {
    return {
      mainChart: null,
      detailChart: null,
      spectrumData: []
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
        this.updateCharts()
      })
    },
    
    // 生成模拟频谱数据
    generateMockData() {
      return new Promise(resolve => {
        const data = []
        for (let i = 0; i < 1000; i++) {
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
      this.mainChart = Highcharts.chart(this.$refs.mainChart, {
        chart: {
          type: 'line',
          zoomType: 'x',
          panning: true,
          panKey: 'shift',
          events: {
            selection: event => this.handleSelection(event)
          }
        },
        title: {
          text: '频谱图 - 框选区域查看细节'
        },
        xAxis: {
          title: {
            text: '频率 (Hz)'
          }
        },
        yAxis: {
          title: {
            text: '振幅'
          },
          min: 0
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: event => this.handlePointClick(event.point)
              }
            }
          }
        },
        series: [{
          name: '频谱',
          data: [],
          color: '#06C',
          lineWidth: 1,
          marker: {
            enabled: false
          }
        }],
        tooltip: {
          valueDecimals: 2
        },
        exporting: {
          enabled: true
        }
      })

      // 细节图表配置
      this.detailChart = Highcharts.chart(this.$refs.detailChart, {
        chart: {
          type: 'line'
        },
        title: {
          text: '选中区域的详细频谱'
        },
        xAxis: {
          title: {
            text: '频率 (Hz)'
          },
          min: 0,
          max: 100
        },
        yAxis: {
          title: {
            text: '振幅'
          },
          min: 0
        },
        legend: {
          enabled: false
        },
        series: [{
          name: '详细频谱',
          data: [],
          color: '#06C',
          lineWidth: 1,
          marker: {
            enabled: false
          }
        }],
        tooltip: {
          valueDecimals: 2
        },
        exporting: {
          enabled: true
        }
      })
    },
    
    // 更新图表数据
    updateCharts() {
      if (!this.mainChart || !this.detailChart) return
      
      this.mainChart.series[0].setData(this.spectrumData)
      // 初始显示前100个点
      this.updateDetailChart(0, 100)
    },
    
    // 处理框选事件
    handleSelection(event) {
      if (event.xAxis) {
        const min = Math.floor(event.xAxis[0].min)
        const max = Math.ceil(event.xAxis[0].max)
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
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

#main-chart,
#detail-chart {
  width: 100%;
  height: 100%;
}
</style>