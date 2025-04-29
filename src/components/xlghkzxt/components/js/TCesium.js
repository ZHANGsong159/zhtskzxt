export class TCesium {

    viewer = null;
    scene = null;
  
    /**
     * 构造器函数：实例化cesium
     * @param {*} dom 节点id
     */
    constructor(dom) {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYzQxMmViYS02YzY0LTQwZTctYmZiNi1lMjFiZmVjMTZhNmIiLCJpZCI6Mjk0NTY0LCJpYXQiOjE3NDQ4NTk3OTZ9.oHF5XLaESJXaAiL-6rup9N3qL7gi475B9QcTT8DqiaQ'
        this.viewer = new Cesium.Viewer(dom, {
            terrain: Cesium.Terrain.fromWorldTerrain({
              requestWaterMask: true,
              requestVertexNormals: true,
            }),
            homeButton: false,
            sceneModePicker: false,
            baseLayerPicker: false, // 影像切换
            animation: false, // 是否显示动画控件
            infoBox: false, // 是否显示点击要素之后显示的信息
            selectionIndicator: false, // 要素选中框
            geocoder: false, // 是否显示地名查找控件
            timeline: false, // 是否显示时间线控件
            fullscreenButton: false,
            shouldAnimate: false,
            navigationHelpButton: false, // 是否显示帮助信息控件


            orderIndependentTranslucency: true,
            contextOptions: {
                webgl: {
                    alpha: true,
                }
            },
            
        });

        this.viewer.scene.skyBox.show = false;//背景天空去除
        this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0); // 设置背景颜色为透明

      
        this.viewer._cesiumWidget._creditContainer.style.display = 'none'

        this.scene = this.viewer.scene

    }
  }
  