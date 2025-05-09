<template>
    <div class="buttomMenuMine">
        <el-menu :default-active="activeIndex" unique-opened class="el-menu-demo" menu-trigger='click'  mode="horizontal"  @select="handleSelect">
            <div v-for="(item,index) in menus" :key='index'>
                <el-submenu :index="item.index" v-if='item.children' @click.native="handleSubmenuClick(item.index)"   popper-class="menu-popper" >
                    <template slot="title" >
                        <div class="conent">
                            <img class="MenuIcon" v-show="activeIndex==item.index" src="@/assets/img/多边形1_@1x.png" alt="">
                            {{item.title}}
                            <img class="MenuIcon" v-show="activeIndex==item.index" src="@/assets/img/多边形2_@1x.png" alt="">
                        </div>
                    </template>
                    <div v-for="(items,indexs) in item.children" :key='indexs'>
                        <el-submenu :index="items.index" popper-append-to-body v-if='items.children' @click.native="handleSubmenuClick(items.index,'secode')"  popper-class="menu-popper-box" >
                            <template slot="title">
                                <img class="MenuIcon" v-show="activeIndex2==items.index" src="@/assets/img/多边形1_@1x.png" alt="">
                                    {{items.title}}
                                <img class="MenuIcon" v-show="activeIndex2==items.index" src="@/assets/img/多边形2_@1x.png" alt="">
                            </template>
                            <div v-for="(itemss,indexss) in items.children" :key='indexss'>
                                <el-menu-item :index="itemss.index" >
                                    <img class="MenuIcon" v-show="isGroup1Active" src="@/assets/img/多边形1_@1x.png" alt="">
                                        {{itemss.title}}
                                    <img class="MenuIcon" v-show="isGroup1Active" src="@/assets/img/多边形2_@1x.png" alt="">
                                </el-menu-item>
                            </div>
                        </el-submenu>
                        <el-menu-item :index="items.index" v-else >
                            {{items.title}}
                        </el-menu-item>
                    </div>
                </el-submenu>
                <el-menu-item :index="item.index" v-else>
                    <img class="MenuIcon" v-show="activeIndex==item.index" src="@/assets/img/多边形1_@1x.png" alt="">
                        {{item.title}}
                    <img class="MenuIcon" v-show="activeIndex==item.index" src="@/assets/img/多边形2_@1x.png" alt="">
                </el-menu-item>
            </div>
        </el-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeIndex: '1',
            activeIndex2:'',
            isGroup1Active:false,
            menus: [
                {
                    index: "1",
                    title: "训练规划",
                    icon: "el-icon-setting",
                    children: [
                        { 
                            index: "1-1", 
                            title: "训练控制",
                            children: [
                                    { index: "1-1-1", title: "启动" },
                                    { index: "1-1-2", title: "暂停/继续" },
                                    { index: "1-1-3", title: "停止" },
                                ]
                        },
                        { 
                            index: "1-2", 
                            title: "任务管理",
                        }, 
                        { 
                            index: "1-3", 
                            title: "方案规划",
                        } ,
                        { 
                            index: "1-4", 
                            title: "任务管理",
                        } 
                    ]
                },
                {
                    index: "2",
                    title: "通讯对抗分系统",
                    icon: "el-icon-tickets",
                    children: [
                        { index: "2-1", title: "信号干扰模板" },
                        { index: "2-2", title: "信号模拟模板" }
                    ]
                },
                {
                    index: "3",
                    title: "雷达对抗分系统",
                },
                {
                    index: "4",
                    title: "光电对抗分系统",
                },
                {
                    index: "5",
                    title: "系统管理",
                    children: [
                            { index: "5-1", title: "设备管理" },
                            { index: "5-2", title: "部署配置" },
                            { index: "5-3", title: "保护频段" },
                        ]
                },
            ]
        };
    },
    methods: {
         // 点击一级菜单时手动切换展开状态
        handleSubmenuClick(index,code) {
            if(code){
                this.activeIndex2=index
            }else{
                this.activeIndex = index;
                this.activeIndex2=''
            }
            console.log(index,'handleSubmenuClick');

        },

        handleSelect(key, keyPath) {
            clearInterval(this.$store.state.tiemer)
            if(keyPath.length>1){
                this.activeIndex = keyPath[0];
            }else{
                this.activeIndex = key[0];
            }

            this.$emit('handleSelect',key, keyPath)
            // console.log(this.activeIndex,key, keyPath,'activeIndex');
        },
        handleOpen(index) {
            console.log(index,'handleOpen');
            // this.activeIndex = key;
            // console.log(this.activeIndex,'handleOpen');
            
        }
    }
    
}
</script>
<style lang="less" scoped>
/* 隐藏所有 el-submenu 的右侧箭头 */
::v-deep .el-submenu__icon-arrow {
  display: none;
} 


/* 修改弹出菜单的背景、阴影、边框等 */
.custom-submenu-popup {
  background: #f0f9eb !important; /* 背景色 */
  border: 1px solid #67c23a !important; /* 边框 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15) !important; /* 阴影 */
}

    
.buttomMenuMine{
    width: 1000px;
    height: 100%;
    margin: auto;
    background-color: transparent;
    padding-top: 20px;
    border: none;
}
.el-menu-demo{
    display: flex;
    justify-content: space-around;
    background-color: transparent;
    margin-top: 20px;
    border: none;
    li{
        width: 163px;
        height: 48px;
        color: #FFFFFF7F;
        font-family: Microsoft YaHei;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #2CE5BA66;
        border-bottom:none;
        background: linear-gradient(180deg, #022920 0%, #02292000 100%);
    }
    ::v-deep .el-menu-item{
        .MenuIcon{
            margin: 0px 5px;
        }
    }
    ::v-deep .el-menu-item:hover{
        background: linear-gradient(180deg, #022920 0%, #02292000  100%);
        color: #fff;
        
    }
    ::v-deep .el-submenu .el-submenu__title{
            font-family: Microsoft YaHei;
            font-size: 18px;
            line-height: normal;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom:1px solid #2CE5BA;
    }
    .menu-popper .el-submenu:hover{
        border: 1px solid #2CE5BA!important;
        border-bottom: none!important;
    }
    // ::v-deep .el-submenu .is-opened {
    //     background-color: transparent;
    //     border: 1px solid #2CE5BA;
    //     border-bottom: none;
    //     color: #fff;
    // }

}

</style>