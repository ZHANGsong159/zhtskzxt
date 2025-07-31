export class TCesium {

    viewer = null;
    scene = null;

    /**
     * 构造器函数：实例化cesium
     * @param {*} dom 节点id
     */
    constructor(dom) {
        let baseUrl;
        if (process.env.NODE_ENV === 'production') {
            // 生产环境使用相对路径或配置的基地址
            baseUrl = process.env.VUE_APP_BASE_URL || '';
        } else {
            // 开发环境使用本地地址
            // baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
            baseUrl = 'http://192.168.2.170:9000';
        }
        console.log(baseUrl);
        
        // const terrainProvider = new Cesium.CesiumTerrainProvider({
        //     url: `${baseUrl}/map/maps/nanjing/terrain`
        // })
        const imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: `${baseUrl}/map/maps/nanjing/img/{z}/{x}/{y}.png`
        })

        // var provider = new Cesium.UrlTemplateImageryProvider({
        //     url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=[YOUR_ACCESS_TOKEN]'
        // });

        
        this.viewer = new Cesium.Viewer(dom, {
            sceneMode: Cesium.SceneMode.SCENE3D,
            // terrainProvider,
            // imageryProvider,
            animation: !1, // 动画部件设置，地图左下角计时钟
            timeline: false, // 时间刻度条
            fullscreenButton: !1, // 全屏按钮
            vrButton: !1, // VR按钮，需要带VR眼镜
            geocoder: !1, // 地名搜索按钮，因为墙的问题
            sceneModePicker: !1, // 是否显示投影方式控件，三维，2.5维，二维
            homeButton: !1, // 复位到地图初始化位置
            navigationHelpButton: !1, // 帮助提示按钮
            navigationInstructionsInitiallyVisible: !1, // 帮助提示按钮显示设置
            infoBox: !1, // 信息窗口部件，可以重写填充其description，默认有个定位按钮
            selectionIndicator: !1, // 点击覆盖物是否显示十字聚焦效果
            shouldAnimate: !0, // 提前模拟动画设置
            showRenderLoopErrors: !1, // 向包含错误的用户显示HTML面板
            baseLayerPicker: !1, // 底图选择控件
        })
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
        this.viewer.scene.globe.depthTestAgainstTerrain = false // 启用地形
        this.viewer.cesiumWidget.creditContainer.style.display = 'none' // 隐藏cesium版权

        this.viewer.scene.globe.baseColor = 'rgba(255,255,255,0.5)'

        // this.initEvents(this.viewer)
        // this.measureTool = new Measure(this.viewer)
        // this.hx3dTool = new Hx3dTool(this.viewer)
        // this.drawTool = new DrawTool(this.viewer)


    }
}
