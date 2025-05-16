<template>
  <div id="my-maptext"></div>
</template>

<script>
import { TCesium } from "./js/TCesium";
import geojson from "@/assets/country/china.json";

export default {
  name: "HomeView",
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.mapObject = new TCesium("my-maptext"); // 注意，这个my-map就是我们div的id
      this.viewerBF = this.mapObject.viewer; //将创建的地图资源进行赋值
      // setTimeout(() => {
      //   this.flyToTarget(117.000923, 36.675807, 12000000, 0, -90, 0, 2);
      // }, 2000);
      // 添加一个基本标签
      var entity  = this.viewerBF.entities.add({
        name: '标点',
        position: Cesium.Cartesian3.fromDegrees(117.000923, 36.675807, 10),
        label: { //文字标签
          text: "文字标签文字标签文字标签",
          font: '500 30px Helvetica',// 15pt monospace
          scale: 0.5,
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0, -65), //偏移量
          showBackground: true,
          backgroundColor: new Cesium.Color(0, 0, 0, 0)
        },
        billboard:{
            image: require('@/assets/img/组 33@1x.png'),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            width:187*2,
            height: 178*2,
            scale: 0.5,
        }
      })
      console.log(entity);
      
      // this.viewerBF.zoomTo(entity )
      

      
    },

    /**
     * 相机视角移动函数 - by wjw
     * @param lon 目标经度
     * @param lat 目标纬度
     * @param height  相机高度
     * @param heading  航向角
     * @param pitch  俯仰角
     * @param roll   距中心的距离，以米为单位
     * @param duration  飞行时间
     */
    flyToTarget(lon, lat, height, heading, pitch, roll, duration) {
      this.viewerBF.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height), // 经纬度以及相机离地高度
        orientation: {
          heading: Cesium.Math.toRadians(heading), // 航向角
          pitch: Cesium.Math.toRadians(pitch), // 俯仰角
          roll: roll, // 距中心的距离，以米为单位
        },
        duration: duration, // 飞行时间
      });

      setTimeout(() => {
        this.addBoundaryWall();
      }, 2000);
    },

    // 多维数组转一维数组
    flatten(arr) {
      return [].concat(
        ...arr.map((x) => (Array.isArray(x) ? this.flatten(x) : x))
      );
    },

    //获取渐变色
    getColorRamp(val){
      if(val==null){
        val={1:"#2CE5BA",0.90:"#2CE5BA",0.8:"#2CE5BA2F",0.3:"#2CE5BA"}
      }
      
      var ramp=document.createElement('canvas');
      ramp.width=1;
      ramp.height=100;
      var ctx=ramp.getContext('2d');
      var grd=ctx.createLinearGradient(0,0,0,100);


      for(var key in val){
        grd.addColorStop(1-Number(key),val[key]);					
      }
      ctx.fillStyle=grd;
      ctx.fillRect(0,0,1,100);
      return ramp;


    },
    addBoundaryWall() {
      // 绘制墙体的数据，将多维数组转成一维数组
      let coordinates = this.flatten(geojson.features[0].geometry.coordinates[0]);

      // 因为地图影像数据是贴地的，所以给个墙的高度设为负数则会有厚度的感觉
      // 墙体最高为0
      let maximumHeights = new Array(coordinates.length / 2).fill(6000);
      // 墙体最低为-1600
      let minimumHeights = new Array(coordinates.length / 2).fill(0);
      let position = Cesium.Cartesian3.fromDegreesArray(coordinates);

      const wallEntity = this.viewerBF.entities.add({
        id: "wall",
        wall: {
          positions: position,
          maximumHeights: maximumHeights,
          minimumHeights: minimumHeights,

          // material: Cesium.Color.fromCssColorString("rgba(0,255,255,0.4)")
          material: new Cesium.ImageMaterialProperty({
            transparent:true,//设置透明
            image:this.getColorRamp()//Canvas
          }),
          outline: false, // 关闭默认边框
        },
      });
      this.viewerBF.zoomTo(wallEntity);
    },
  },
};
</script>

<style scoped>
#my-map {
  width: 100%;
  height: 100%;
  /* background-color: black; */
  background-color: transparent;
}
</style>

