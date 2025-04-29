<template>
  <div class="Pinpumind">
    <div class="leftPinpu-title">
      <div class="leftText">
        <img src="@/assets/img/组21_@1x.png" alt="" />
        <span class="pinputext">频谱图</span>
        <span class="pinputext pintutextEnglish">Spectrum</span>
      </div>
    </div>
    <div class="pinPuBody">
      <div
        class="pinPuBody-box"
        v-for="(item, index) in leftPinpu"
        :key="index"
        @click="clickPinPu(item.id)"
      >
        <div class="pinPuBody-box-tittle">
          <span class="pinpuTextLite">
            {{ item.name }}
          </span>
          <img
            class="pinpuTextLiteImg"
            src="@/assets/img/组55_@1x.png"
            alt=""
          />
        </div>
        <div class="pinPuBody-box-body">
          <hightEcharts :shebeiID='item.id'></hightEcharts>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import hightEcharts from "./hightEcharts.vue";
export default {
  components: {
    hightEcharts,
  },
  data() {
    return {
      messages:[],
      leftPinpu: [
        {
          name: "设备一",
          img: "@/assets/img/组21_@1x.png",
          id: "sheibei1",
        },
        {
          name: "设备二",
          img: "@/assets/img/组21_@1x.png",
          id: "sheibei2",
        },
        {
          name: "设备三",
          img: "@/assets/img/组21_@1x.png",
          id: "sheibei3",
        },
        {
          name: "设备四",
          img: "@/assets/img/组21_@1x.png",
          id: "sheibei4",
        },
      ],
    };
  },
  methods:{
    clickPinPu(id){
      this.$emit('clickPinPu',id)
    }
  },
  


};
</script>
<style lang="less" scoped>
.Pinpumind {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  //   padding-top: 10px;
}
.leftPinpu-title {
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background: linear-gradient(270deg, #ffffff00 0%, #ffffff26 100%);
  .leftText {
    width: 300px;
    height: 36px;
    display: flex;
    // justify-content: center;
    align-items: center;
    .pinputext {
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: normal;
      font-size: 18px;
      margin-left: 10px;
    }
    .pintutextEnglish {
      font-weight: 400;
      margin-left: 10px;
    }
    img {
      width: 30px;
      height: 16px;
      margin-left: 10px;
    }
  }
}
.pinPuBody::-webkit-scrollbar {
  display: none;
}
.pinPuBody {
  overflow: auto;
  .pinPuBody-box {
    width: 276px;
    height: 200px;
    // background-color: aliceblue;
    margin-bottom: 15px;
    margin: auto;
    .pinPuBody-box-tittle {
      margin-bottom: 12px;
      position: relative;
      .pinpuTextLite {
        font-size: 14px;
      }
      .pinpuTextLiteImg {
        position: absolute;
        left: calc(50% - 87.5px);
        top: 0px;
      }
    }
    .pinPuBody-box-body {
      width: 276px;
      height: 165px;
      overflow: hidden;
    }
  }
}
</style>