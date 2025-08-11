<template>
  <div class="pingPuBox">
    <div class="main">
      <!-- 频谱图 -->
      <div class="linecharts" :id="shebeiID + 'pinpu'"></div>
      <div class="neirong">
        <!--图例-->
        <div class="legend">
          <canvas ref="legend"></canvas>
        </div>
        <!--瀑布图-->
        <div
          class="waterFall"
          :ref="shebeiID"
          @mousemove="waterFallMove($event)"
          @mouseleave="waterFallLeave"
        >
          <canvas :ref="shebeiID + 'canvas'"></canvas>
          <!--鼠标移入弹出框-->
          <div ref="tip" class="tip"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Highcharts from "highcharts";
import Boost from 'highcharts/modules/boost';
import {getDeployNote} from '@/api/api'
Boost(Highcharts);
export default {
  props: {
    fblbeishu: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      chartInstance:null,
      shebeiID:'',
      options: {
        chart: {
          zoomType: "x",
          backgroundColor: "rgba(0,0,0,0)",
          // polar: true,
          type: "line",
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
      colormap: [], //颜色库
      legend: null, //图例
      waterFall: null, //瀑布图
      waterFallList: [], //瀑布图源数据
      waterFallIndex: 0, //瀑布图定时器用到的计数标识
      waterFallCopyList: [], //瀑布图二维数组（用来显示数据做的临时储存）
      timer: null, //瀑布图定时器
      waterFallWidth: 0, //瀑布图的宽度（后端返回的数据length）
      waterFallHeight: 0, //瀑布图定高度（也可以理解成渲染次数 例如30次渲染完成）
      maxNum: 120, //图例最大值
      minNum: 0, //图例最小值
      messages: [],
      ymessages:[],

      maxvalue:1000,
      minvalue:0,
      noiseData: {},
    };
  },
  methods: {
    waterFallMove() {},
    waterFallLeave() {},
    getDeployNote(){
      let noise ='noise'
      getDeployNote(noise).then(res => { 
        return res.data
      }).then(res=>{
        this.noiseData = res.data
        this.options.yAxis.min = Number(res.data.configValue)
        console.log(this.options.yAxis.min,'this.options.yAxis.min');
        
      }).catch(error => { 
        console.log(error);
      });
    },
    // 清空图表数据
    clearChart() {
      if (this.chartInstance) {
        // 清空所有系列数据
        while(this.chartInstance.series.length > 0) {
          this.chartInstance.series[0].remove(false); // false 表示不重绘
        }
        // 重绘图表
        this.chartInstance.redraw();
      }
    },
    initMessage(max, min) {
      var data = [];
      var yData = [];
      data = this.messages;
      yData = this.ymessages;

      this.highInit(data, max, min);
      this.queryChartList(yData);
    },
    // 生成范围区间的值
    RandomNumBoth(Min, Max) {
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range); //四舍五入
      return num;
    },
    //频谱渲染值
    highInit(data, max, min) {
      this.options.series[0].data = data;
      this.options.xAxis.min = min;
      this.options.xAxis.max = max;
      this.chartInstance=Highcharts.chart(this.shebeiID + "pinpu", this.options);
    },
    // 创建颜色库
    setColormap() {
      let that = this;
      let colormap = require("colormap");
      that.colormap = colormap({
        colormap: "jet", //jet,cool,winter
        nshades: 150,
        format: "rba",
        alpha: 1,
      });
    },
    // 创建图例
    createLegendCanvas() {
      let that = this;
      let legendRefs = that.$refs.legend;
      that.legend = legendRefs.getContext("2d");
      let legendCanvas = document.createElement("canvas");
      legendCanvas.width = 1;
      let legendCanvasTemporary = legendCanvas.getContext("2d");
      const imageData = legendCanvasTemporary.createImageData(
        1,
        that.colormap.length
      );
      for (let i = 0; i < that.colormap.length; i++) {
        const color = that.colormap[i];
        imageData.data[imageData.data.length - i * 4 + 0] = color[0];
        imageData.data[imageData.data.length - i * 4 + 1] = color[1];
        imageData.data[imageData.data.length - i * 4 + 2] = color[2];
        imageData.data[imageData.data.length - i * 4 + 3] = 255;
      }
      legendCanvasTemporary.putImageData(imageData, 0, 0);
      that.legend.drawImage(legendCanvasTemporary.canvas,0,0,1,that.colormap.length,50,0,200,that.legend.canvas.height);
    },
    // 创建瀑布图
    createWaterFallCanvas() {
      let that = this;
      let waterFall = that.$refs[`${this.shebeiID}canvas`];
      
      that.waterFall = waterFall.getContext("2d");


      waterFall.width = that.waterFallWidth;
      waterFall.height = that.$refs[this.shebeiID].offsetHeight;
    },
    // 绘制单行图像
    rowToImageData(data) {
      let that = this;
      if (that.$refs[this.shebeiID] !== undefined) {
        let canvasHeight = 1;
        // if (that.waterFallHeight == 0) {
        //   clearInterval(this.timer);
        // } else {
        //   canvasHeight = Math.floor(
        //     that.$refs[this.shebeiID].offsetHeight / that.waterFallHeight
        //   );
        // }
        let imgOld = that.waterFall.getImageData(0,0,that.waterFallWidth,canvasHeight * that.waterFallIndex + 1);
        const imageData = that.waterFall.createImageData(data.length, 1);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const cindex = that.colorMapData(data[i / 4], 0, 130);
          const color = that.colormap[cindex];
          imageData.data[i + 0] = color[0];
          imageData.data[i + 1] = color[1];
          imageData.data[i + 2] = color[2];
          imageData.data[i + 3] = 255;
        }
        for (let i = 0; i < canvasHeight; i++) {
          that.waterFall.putImageData(imageData, 0, i);
        }
        that.waterFall.putImageData(imgOld, 0, canvasHeight);
      }
    },
    // 还回对应的颜色
    colorMapData(data, outMin, outMax) {
      let that = this;
      if (data <= that.minNum) {
        return outMin;
      } else if (data >= that.maxNum) {
        return outMax;
      }
      return Math.round(
        ((data - that.minNum) / (that.maxNum - that.minNum)) * outMax
      );
    },

    queryChartList(data,max) {
      let hightEchartsbox = this.$refs[this.shebeiID].offsetHeight;
      
      let that = this;
      that.waterFallWidth = max;
      that.waterFallHeight = hightEchartsbox;
      if (that.waterFall === null) {
        that.createWaterFallCanvas(data.length);
      }

      that.rowToImageData(data);
      that.waterFallCopyList.unshift(data);
      that.waterFallIndex++;
      if (that.waterFallIndex > that.waterFallHeight) {
        that.waterFallCopyList.pop();
      }
    },

    //canvas自适应高度
    HightCanvas() {
      let that = this;
      let waterFall = that.$refs[`${this.shebeiID}canvas`];
      waterFall.height = that.$refs[this.shebeiID].offsetHeight;
      let ctx = waterFall.getContext("2d");
      ctx.clearRect(0, 0, waterFall.width, waterFall.height);
      this.draw(ctx);
    },

    draw(ctx) {
      ctx.fillStyle = "blue";
      ctx.fillRect(10, 10, 100, 100);
    },

    tesxttu(){
          var xdata=[],yData=[];
        for(var i =950;i<2150;i+=0.3){
          if(i>=1200&&i<=1230){
             let nums=this.RandomNumBoth(60,70);
            yData.push(nums) 
            xdata.push([i,nums])
           }else if(i>=1450&&i<=1500){
             let nums=this.RandomNumBoth(50,60);
            yData.push(nums) 
            xdata.push([i,nums])
           }else if(i>=1800&&i<=1850){
             let num1=this.RandomNumBoth(40,50);
            yData.push(num1) 
            xdata.push([i,num1])
           }else{
              let num=this.RandomNumBoth(2,30);
                yData.push(num);
                xdata.push([i,num])
           }
        }
        console.log(xdata,yData,'data');
        
        this.queryChartList(yData);

    },

    
  },
  created(){
    this.shebeiID=this.$route.params.id
    this.getDeployNote()
  },
  mounted() {
    let that = this;
    that.setColormap();
    that.createLegendCanvas();
    this.highInit([], this.maxvalue, this.minvalue)
    
    this.$store.state.socket.on('message', (data) => {
      if(data.msgCode=="rate_data"){
        let min=data.ratePushDTO.startRate
        let max=data.ratePushDTO.endRate

        if(data.ratePushDTO.segmentStartRate==min){
          this.messages=[]
          this.ymessages=[]
        }
        data.ratePushDTO.values.forEach((item,index)=>{
          this.messages.push([(index*this.fblbeishu/1000)+Number(data.ratePushDTO.segmentStartRate),item]);
          // this.messages.push([(index*1000/1000)+Number(data.ratePushDTO.segmentStartRate),item]);
          this.ymessages.push(item)
        })

        this.chartInstance.xAxis[0].setExtremes(min, max);
        this.chartInstance.series[0].setData(this.messages)
        this.queryChartList(this.ymessages,max);
      }
    }); 
  },
};
</script>

<style lang="less" scoped>
.pingPuBox {
  height: 100%;
  width: 100%;
  // padding: 5px;
  background-color: #ffffff26;
}
.main {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-size: cover;
  background-repeat: no-repeat;
}
.linecharts {
  width: 100%;
  height: 70%;
}
.neirong {
  width: 100%;
  height: 30%;
  // height: 300px;
  display: flex;
  border-top: none;
}

.legend {
  width: 37px;
  height: 100%;
}

canvas {
  width: 100%;
  height: 100%;
}

.waterFall {
  width: calc(100% - 44px);
  height: 100%;
  // position: relative;
}

.tip {
  pointer-events: none;
  display: none;
  background-color: #0404049e;
  border-radius: 10px;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
}
</style>
