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
      optionTop: {
        chart: {
          zoomType: "x",
          backgroundColor: "rgba(0,0,0,0)",
          // polar: true,
          type: "line",
          events: {
          // 点击图表空白区域时触发 [4,6](@ref)
          click: (event)=> {
            this.$emit('clickpoint', event.xAxis[0].value,event.yAxis[0].value)
          }
        }
        },
        resetZoomButton: {
          // theme: { style: { display: 'none'} }
        },
        reflow: true,
        credits: {
          //版权
          enabled: false,
        },
        exporting: {
          enabled: false
        },
        yAxis: {
          title: {
            enabled: false,
          },
          min:0,
          startOnTick: false, // 必须：禁用起始刻度调整
          gridLineColor: "rgba(255,255,255,0.5)",
          gridLineWidth: 1,
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
        },
        xAxis: {
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
          min: 0,
          max: 100,
          showLastLabel: true,
          gridLineColor: "rgba(255,255,255,0.5)",
          gridLineWidth: 1, 
          lineColor: "rgba(165,165,165, 0.3)",
          showFirstLabel: true,
          tickColor: true,
          plotBands: [], //标注区
        },
        title: {
          enabled: false,
          text: "",
        },

        legend: {
          enabled: false,
        },
        tooltip: {
            enabled: true, // 必须设置为true
            useHTML: true, // 启用HTML内容
            zIndex: 100,
            formatter: function() {
                // 使用this.point访问当前数据点
                return `
                    <div>频率: <b>${this.x} MHz</b></div>
                    <div>信号强度: <b>${this.y} dB</b></div>
                `;
            },
            // 样式配置
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: '#4dabf7',
            borderRadius: 8,
            style: {
                color: '#fff',
                fontSize: '14px'
            }
        },
        boost: {
          enabled: true, // 必须开启
          useGPUTranslations: true, // 启用GPU加速
          seriesThreshold: 1 // 当序列数超过阈值时启用boost
        },
        // plotOptions: {
        //   scatter: {
        //     // 数据点点击事件 [1,6](@ref)
        //     point: {
        //       events: {
        //         click: function() {
        //           const infoDiv = document.getElementById('info');
        //           infoDiv.innerHTML = `🔥 点击峰值点：频率 = ${this.frequency}，强度 = ${this.y.toFixed(1)}dB`;
        //         }
        //       }
        //     },
        //     marker: {
        //       radius: 6,
        //       states: {
        //         hover: { radius: 8 }
        //       }
        //     }
        //   }
        // },
        series: [
          {
            color: "rgba(234,225,113,1)",
            marker: {
                enabled: false, // 启用标记点
                states: {
                    hover: {
                        enabled: true // 启用悬停状态
                    }
                }
            },
            
            turboThreshold: 0,
                boostThreshold: 1,  // 强制所有系列使用boost
                dataGrouping: {
                  enabled: true,    // ✅ 关键：在boost模式下启用分组
                  approximation: 'average',
                  groupPixelWidth: 4
            },
            animation: false,
            enableMouseTracking: true,
            type: "line",
            data: [],
            lineWidth: 0.5,
          },
        ],
      },
      optionBotoom:{
        chart: {
          zoomType: "x",
          backgroundColor: "rgba(0,0,0,0)",
          // polar: true,
          type: "line",
          events: {
        }
        },
        resetZoomButton: {
          // theme: { style: { display: 'none'} }
        },
        reflow: true,
        credits: {
          //版权
          enabled: false,
        },
        exporting: {
          enabled: false
        },
        yAxis: {
          title: {
            enabled: false,
          },
          min:0,
          startOnTick: false, // 必须：禁用起始刻度调整
          gridLineColor: "rgba(255,255,255,0.5)",
          gridLineWidth: 1,
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
        },
        xAxis: {
          labels: {
            style: {
              color: "#dfdfdf",
            },
          },
          min: 0,
          max: 100,
          showLastLabel: true,
          gridLineColor: "rgba(255,255,255,0.5)",
          gridLineWidth: 1, 
          lineColor: "rgba(165,165,165, 0.3)",
          showFirstLabel: true,
          tickColor: true,
          plotBands: [], //标注区
        },
        title: {
          enabled: false,
          text: "",
        },

        legend: {
          enabled: false,
        },
        tooltip: {
            enabled: true, // 必须设置为true
            useHTML: true, // 启用HTML内容
            zIndex: 100,
            formatter: function() {
                // 使用this.point访问当前数据点
                return `
                    <div>频率: <b>${this.x} MHz</b></div>
                    <div>信号强度: <b>${this.y} dB</b></div>
                `;
            },
            // 样式配置
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: '#4dabf7',
            borderRadius: 8,
            style: {
                color: '#fff',
                fontSize: '14px'
            }
        },
        boost: {
          enabled: true, // 必须开启
          useGPUTranslations: true, // 启用GPU加速
          seriesThreshold: 1 // 当序列数超过阈值时启用boost
        },
        series: [
          {
            color: "rgba(234,225,113,1)",
            marker: {
                enabled: false, // 启用标记点
                states: {
                    hover: {
                        enabled: true // 启用悬停状态
                    }
                }
            },
            turboThreshold: 0,
                boostThreshold: 1,  // 强制所有系列使用boost
                dataGrouping: {
                  enabled: true,    // ✅ 关键：在boost模式下启用分组
                  approximation: 'average',
                  groupPixelWidth: 4
            },
            animation: false,
            enableMouseTracking: true,
            type: "line",
            data: [],
            lineWidth: 0.5,
          },
        ],
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