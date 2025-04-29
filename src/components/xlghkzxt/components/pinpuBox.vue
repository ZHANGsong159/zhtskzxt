<template>
  <div class="main zIndex20">
    <div class="tabChange">
      <!-- 可点击tab头 -->
      <div class="tabChangeBox">
        <ul class="nav">
          <li
            class="item"
            :class="tab === 0 ? 'active' : ''"
            @click="clickTab(0)"
          >
            频谱扫描
          </li>
          <li
            class="item"
            :class="tab === 1 ? 'active' : ''"
            @click="clickTab(1)"
          >
            信号分析
          </li>
          <li
            class="item"
            :class="tab === 2 ? 'active' : ''"
            @click="clickTab(2)"
          >
            网台分选
          </li>
        </ul>
        <ul class="nav navnew">
          <li
            class="item active"
          >
            频谱扫描
          </li>
        </ul>

      </div>

      <!-- 对应 tab 展示区域 -->
      <div class="tab-show">
        <div v-if="tab === 0">
          <div class="tab-help-text">
            
          </div>
        </div>
        <div v-else>
          <!-- tab2里面内容 -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
      return {
        tab: 0,
      };
    },

    methods: {
      clickTab(index) {
        this.tab = index;
      },
    },
};
</script>
<style lang="less" scoped>
.main {
  width: 80%;
  height: 70%;
//   background: #15231e;
}

.tabChange {
  width: 100%;
  height: 100%;
  @include position(absolute, 10, 580px, static, static, static);
  @include flex(column, center, center);
  .tabChangeBox{
    display: flex;
    justify-content: space-between;

  }
  .navnew{
    width: 240px !important;
    height: 60px !important;
    .item{
      border-radius: 15px 0 0 0 !important;

    }

    .item:before {
        width: 0px!important;

      
    }
    .item:after {
      content: "";
      display: block;
      width: 26px;
      height: 101%;
      background: #00644C;
      position: absolute;
      left: -13px;
      top: 0;
      z-index: -1;
      border-radius: 15px 0 0 0;
      transform: skew(-20deg);
    }
  }
  .nav {
    display: flex;
    width: 700px;
    align-items: flex-end;
    .item {
        flex: 0.8;
        width: 216px;
        height: 60px;
        background: #15231E;
        border-radius: 5px 5px 0 0;
        position: relative;
        list-style: none;
        margin: 0px;
        display: flex;
        // text-align: center;
        // vertical-align: middle;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: #fff;
        text-align: left;
        border-radius: 0 15px 0 0;

      
    }
    .item:before {
        content: "";
        display: block;
        width: 26px;
        height: 100%;
        background: #15231E;
        position: absolute;
        right: -13px;
        top: 0;
        z-index: 10;
        border-radius: 0 15px 0 0;
        transform: skew(20deg);
        border-bottom: 1px solid #00644C;
        border-right: 1px solid #00644C;
    }
    // .item:after {
    //   content: "";
    //   display: block;
    //   width: 26px;
    //   height: 101%;
    //   background: orange;
    //   position: absolute;
    //   left: -13px;
    //   top: 0;
    //   z-index: -1;
    //   border-radius: 5px 0 0 0;
    //   transform: skew(-20deg);
    // }

    .active {
        flex: 1;
        height: 60px;
        background: #00644C;
        z-index: 10;
        transform: translateY(1px);
        border-radius: 0 15px 0 0;

    }

    // .active:after {
    //   content: "";
    //   display: block;
    //   width: 26px;
    //   height: 101%;
    //   background: #eee;
    //   position: absolute;
    //   left: -13px;
    //   top: 0;
    //   z-index: 10;
    //   border-radius: 5px 0 0 0;
    //   transform: skew(-20deg);
    // }
    .active::before {
        content: "";
        display: block;
        width: 26px;
        height: 100%;
        background: #00644C;
        position: absolute;
        right: -13px;
        top: 0;
        z-index: 10;
        border-radius: 0 15px 0 0;
        transform: skew(20deg);
        border-bottom: 1px solid #00644C;
        border-right: 1px solid #00644C;
    }
  }

  .tab-show {
    background-color: #15231E;
    // border-radius: 16px;
    border: 1px solid #00644C;
    width: 100%;
    height:calc(100% - 70px);
    // padding: 70px;
  }
}
</style>