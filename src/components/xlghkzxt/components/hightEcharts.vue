<template>
<div  class="pingPuBox">
    <div class="main">
      <!-- 频谱图 -->
      <div class="linecharts" :id="shebeiID"></div>
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
          <canvas :ref="shebeiID+'canvas'"></canvas>
          <!--鼠标移入弹出框-->
          <div ref="tip" class="tip"></div>
        </div>
      </div>
    </div>
</div>
</template>
<script>
import Highcharts from "highcharts";
export default {
  props: {
    shebeiID:{
      type: String,
      default: "333",
    }
  },
  data() {
    return {
      options: {
        chart: {
          zoomType: "x",
          backgroundColor: "rgba(0,0,0,0)",
          polar: true,
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
        xAxis: {
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
          plotBands: [
            // {
            //   from: 1200, // 标示区开始值
            //   to: 1230, // 标示区结束值
            //   color: "rgba(225, 90, 47, 0.3)", // 标示区背景颜色
            //   borderWidth: 0, // 标示区边框宽度
            //   borderColor: "#aca", // 标示区边框颜色
            // },
            // {
            //   from: 1450, // 标示区开始值
            //   to: 1500, // 标示区结束值
            //   color: "rgba(225, 90, 47, 0.3)", // 标示区背景颜色
            //   borderWidth: 0, // 标示区边框宽度
            //   borderColor: "#aca", // 标示区边框颜色
            // },
            // {
            //   from: 1800, // 标示区开始值
            //   to: 1850, // 标示区结束值
            //   color: "rgba(225, 90, 47, 0.3)", // 标示区背景颜色
            //   borderWidth: 0, // 标示区边框宽度
            //   borderColor: "#aca", // 标示区边框颜色
            // },
          ], //标注区
          plotLines: [
            // {
            //   color: "#EB3C0A",
            //   width: 1,
            //   value: 1215,
            //   zIndex: 5,
            //   dashStyle: "LongDash",
              // label:{
              //     text:"DVB",
              //     align:'left',
              //     x:-34,
              //     y:6,
              //     style:{color:"#EB3C0A"}
              // }
            // },
            // {
            //   color: "#EB3C0A",
            //   width: 1,
            //   value: 1475,
            //   zIndex: 5,
            //   dashStyle: "LongDash",
            // },
            // {
            //   color: "#EB3C0A",
            //   width: 1,
            //   value: 1825,
            //   zIndex: 5,
            //   dashStyle: "LongDash",
            // },
          ],
        },
        title: {
          enabled: false,
          text: "",
        },
        boost: {
          useGPUTranslations: true,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          shared: true,
          crosshairs: true,
          headerFormat: "111",
          pointFormat: "222",
        },
        series: [
          {
            color: "#00ffff",
            marker: {
              enabled: false,
            },
            animation: false,
            enableMouseTracking: false,
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
      maxNum: 80, //图例最大值
      minNum: 0, //图例最小值
      messages:[],
    };
  },
  methods: {
    waterFallMove(){},
    waterFallLeave(){},
    initMessage() {
      // var pin = this.RandomNumBoth(40, 60);
      // console.log(pin);

      var data = [],
        yData = [];
      // for (var i = 950; i < 2150; i += 0.3) {
      //   if (i >= 1200 && i <= 1230) {
      //     let nums = this.RandomNumBoth(60, 70);
      //     yData.push(nums);
      //     data.push([i, nums]);
      //   } else if (i >= 1450 && i <= 1500) {
      //     let nums = this.RandomNumBoth(50, 60);
      //     yData.push(nums);
      //     data.push([i, nums]);
      //   } else if (i >= 1800 && i <= 1850) {
      //     let num1 = this.RandomNumBoth(40, 50);
      //     yData.push(num1);
      //     data.push([i, num1]);
      //   } else {
      //     let num = this.RandomNumBoth(2, 30);
      //     yData.push(num);
      //     data.push([i, num]);
      //   }
      // }
      data=this.$store.state.messages
      yData=this.$store.state.ymessages

      
      // 折线图
      // console.log(yData,'瀑布图瀑布图瀑布图');
      //瀑布图
      // if(yData.length>0){
        this.highInit(data);
        this.queryChartList(yData);

      // }
    },
    // 生成范围区间的值
    RandomNumBoth(Min, Max) {
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range); //四舍五入
      return num;
    },
    //频谱渲染值
    highInit(data) {
      this.options.series[0].data = data;
      console.log(this.options.series[0].data,'highInithighInit');
      
      Highcharts.chart(this.shebeiID, this.options);
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
      const imageData = legendCanvasTemporary.createImageData(1,that.colormap.length);
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
        let  canvasHeight = 1
        if(that.waterFallHeight == 0){
          console.log('that.waterFallHeight',that.waterFallHeight);
          clearInterval(this.timer);
        }else{
          canvasHeight = Math.floor(that.$refs[this.shebeiID].offsetHeight / that.waterFallHeight);
        }
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

    queryChartList(data) {
      let hightEchartsbox=this.$refs[this.shebeiID].offsetHeight
      // console.log(hightEchartsbox,'hightEchartsboxhightEchartsbox');
      
      let that = this;
      that.waterFallWidth = data.length;
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
    HightCanvas(){
      let that = this;
      let waterFall = that.$refs[`${this.shebeiID}canvas`];
      waterFall.height = that.$refs[this.shebeiID].offsetHeight;

      let ctx=waterFall.getContext('2d');
      ctx.clearRect(0, 0, waterFall.width, waterFall.height);
      this.draw(ctx)

    },
    draw(ctx) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(10, 10, 100, 100);
    },
    dianji(){
      console.log('dianjidianjidianjidianjidianjidianjidianji');
      
    },
  },
  mounted() {
    let that = this;
    that.setColormap();
    that.createLegendCanvas();
    // console.log(this.shebeiID,'shebeiIDshebeiID');
    
      // 模拟假数据
    this.timer = setInterval(() => {
      if(this.$store.state.messages.length>0){
        this.initMessage();
      }
      console.log('setIntervalsetInterval');
      
    }, 30);


    

  },
  beforeDestroy() {
    let that = this;
    clearInterval(that.timer);
  },
};
</script>

<style lang="less" scoped>
.pingPuBox{
  height: 100%;
  width: 100%;
  // padding: 5px;
  background-color: #FFFFFF26;
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
  height:70%
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
