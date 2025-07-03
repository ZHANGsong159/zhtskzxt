<template>
  <div class="plandesignbox">
    <el-tabs type="border-card" style="margin-top: 10px">
      <el-tab-pane
        v-for="(item, index) in titlelist"
        :key="index"
        :label="item.name"
      >
        {{ item.name }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",
      titlelist: [
        { name: "干扰信号配置", id: "1" },
        { name: "模拟信号配置", id: "2" },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
.plandesignbox {

}
</style>