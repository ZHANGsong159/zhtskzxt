<template>
    <div class="leftPinpu-title">
      <div class="leftText">
          <img src="@/assets/img/组21_@1x.png" alt="" />
          <span class="pinputext">{{tittlename}}</span>
      </div>
    </div>
</template>
<script>
export default {
    props: {
        tittlename: {
            type: String,
            default: ''
        }
    },
    
}
</script>
<style lang="less" scoped>
.leftPinpu-title {
  margin: auto;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  background: linear-gradient(270deg, #ffffff00 0%, #ffffff26 100%);
  .leftText {
    width: 300px;
    height: 36px;
    display: flex;
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
</style>