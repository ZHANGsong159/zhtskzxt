<template>
    <div>
        <div class="content">
            <div class="neirong">
                <!--图例-->
                <div class="legend">
                    <canvas ref="legend"></canvas>
                </div>
                <!--瀑布图-->
                <div class="waterFall" ref="waterFallContent"
                     @mousemove="waterFallMove($event)"
                     @mouseleave="waterFallLeave"
                >
                    <canvas ref="waterFall"></canvas>
                    <!--鼠标移入弹出框-->
                    <div ref="tip" class="tip"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
        name: "echartsBox",
        data() {
            return {
                colormap: [],
                legend: null,
                waterFall: null,
                waterFallList: [],
                waterFallIndex: 0,
                waterFallCopyList: [],
                waterFallIntervals: null,
                waterFallWidth: 0,
                waterFallHeight: 0,
                maxNum: 10,
                minNum: 0
            }
        },
}
</script>