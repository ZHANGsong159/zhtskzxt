import http from '../utils/http'
// 
/** * @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/... * @param '/testIp'代表vue-cil中config，index.js中配置的代理 */
let resquest = "/fd"



// post请求


//登录接口
export function postLogin(params){ 
    return http.post(`${resquest}/sys/login`,params)
}
//退出登录
export function postLoginOut(params){ 
    return http.post(`${resquest}/sys/logout`,params)
}






// //频谱查询
export function getCmdRate(params){ 
    return http.get(`${resquest}/cmd/rate`,params)
}
//  频谱查询停止
export function getCmdRateStop(params){ 
    return http.get(`${resquest}/cmd/rate/stop`,params)
}


//频谱查询开始信号分析
export function getCmdRateXHFX(params){ 
    return http.get(`${resquest}/cmd/signal/identify`,params)
}









//设备列表
export function getShebeiList(params){ 
    return http.get(`${resquest}/sys-device`,params)
}

// 添加设备
export function postAddShebei(params){ 
    return http.post(`${resquest}/sys-device`,params)
}


// 删除设备
export function deleteShebeiById(params){ 
    return http.delete(`${resquest}/sys-device/${params}`)
}

//更新设备
export function putShebeiUpdata(params){ 
    return http.put(`${resquest}/sys-device/`,params)
}

//手动保存经纬度
export function saveLngLat(params){ 
    return http.put(`${resquest}/sys-device/position`,params)
}





//通抗干扰模块
export function getTongKangGR(params){ 
    return http.get(`${resquest}/tk-template-disturb`,params)
}
//新建通抗干扰模块
export function postTongKangGR(params){ 
    return http.post(`${resquest}/tk-template-disturb`,params)
}
//更新通抗干扰模块
export function putTongKangGR(params){ 
    return http.put(`${resquest}/tk-template-disturb`,params)
}
//删除通抗干扰模块
export function deleteTongKangGR(params){ 
    return http.delete(`${resquest}/tk-template-disturb/${params}`)
}



//通抗模拟模块
export function getTongKangMN(params){ 
    return http.get(`${resquest}/tk-template-simulate`,params)
}
//新建通抗模拟模块
export function postTongKangMN(params){ 
    return http.post(`${resquest}/tk-template-simulate`,params)
}
//更新通抗模拟模块
export function putTongKangMN(params){ 
    return http.put(`${resquest}/tk-template-simulate`,params)
}
//删除通抗模拟模块
export function deleteTongKangMN(params){ 
    return http.delete(`${resquest}/tk-template-simulate/${params}`)
}






//部署配置

//获取部署方式
export function getDeployNote(params){ 
    return http.get(`${resquest}/sys-config/key/${params}`)
}
//修改部署方式
export function UpdataDeployNote(params){ 
    return http.put(`${resquest}/sys-config`,params)
}







//保护频段

//获取保护频段
export function getProtectFrequency(params){ 
    return http.get(`${resquest}/sys-rate-protect`,params)
}
//添加保护频段
export function postProtectFrequency(params){ 
    return http.post(`${resquest}/sys-rate-protect`,params)
}
//删除保护频段
export function deleteProtectFrequency(params){ 
    return http.delete(`${resquest}/sys-rate-protect/${params}`)
}




//控制命令
//下方启动命令
export function postControlCommand(params){ 
    return http.post(`${resquest}/cmd/start`,params)
}
//下发暂停命令
export function postControlCommandPause(params){ 
    return http.post(`${resquest}/cmd/pause`,params)
}
//下发停止命令
export function postControlCommandStop(params){ 
    return http.post(`${resquest}/cmd/stop`,params)
}
//下发干扰命令
export function postControlCommandInterference(params){ 
    return http.post(`${resquest}/cmd/disturb`,params)
}
//下发模拟命令
export function postControlCommandSimulation(params){ 
    return http.post(`${resquest}/cmd/simulate`,params)
}






// put 请求
export function putSomeAPI(params){ 
    return http.put(`${resquest}/putSome.json`,params)
}
// delete 请求
export function deleteListAPI(params){ 
    return http.delete(`${resquest}/deleteList.json`,params)
}



//任务管理
export function getRenWu(params){ 
    return http.get(`${resquest}/sys-task`,params)
}

export function addRenWu(params){ 
    return http.post(`${resquest}/sys-task`,params)
}



//规划方案
export function getGuiHua(params){ 
    return http.get(`${resquest}/sys-plan`,params)
}
export function addGuiHua(params){ 
    return http.post(`${resquest}/sys-plan`,params)
}

export function deleteGuiHua(params){ 
    return http.delete(`${resquest}/sys-plan/${params}`)
}

export function getGuiHuaxiafa(params){ 
    return http.get(`${resquest}/sys-plan/issue/${params}`)
}



//规划设备任务
export function addGuiHuaShebei(params){ 
    return http.post(`${resquest}/sys-plan-device-task`,params)
}


//修改设备设置
export function putGuihuaYSRenWu(params){ 
    return http.put(`${resquest}/sys-plan-device-task`,params)
}




export function deleteGuiHuaShebei(params){ 
    return http.delete(`${resquest}/sys-plan-device-task/${params}`)
}

export function getGuiHuaListShebei(id,pageNum,pageSize,planId){
    return http.get(`${resquest}/sys-plan-device-task?deviceId=${id}&pageSize=${pageSize}&pageNum=${pageNum}&planId=${planId}`)
}

export function getGuiHuaListShebeiByid(params){ 
    return http.get(`${resquest}/sys-plan-device-task/${params}`)
}




export function putGuihuaYStime(params){ 
    return http.put(`${resquest}/sys-plan-device-task/delayed`,params)
}






//雷抗干扰模版
export function getLeiKangGR(params){ 
    return http.get(`${resquest}/lk-template-disturb/`,params)
}


export function postLeiKangGR(params){ 
    return http.post(`${resquest}/lk-template-disturb/`,params)
}

export function putLeiKangGR(params){ 
    return http.put(`${resquest}/lk-template-disturb/`,params)
}


export function deleteLeiKangGR(id){ 
    return http.delete(`${resquest}/lk-template-disturb/${id}`)
}







//雷抗模拟模版
export function getLeiKangMN(params){ 
    return http.get(`${resquest}/lk-template-simulate`,params)
}

export function postLeiKangMN(params){ 
    return http.post(`${resquest}/lk-template-simulate`,params)
}

export function putLeiKangMN(params){ 
    return http.put(`${resquest}/lk-template-simulate`,params)
}


export function deleteLeiKangMN(id){ 
    return http.delete(`${resquest}/lk-template-simulate/${id}`)
}




//规划设备
export function getGHdevice(params){ 
    return http.get(`${resquest}/sys-plan-device?planId=${params}`)
}

export function postGHdevice(params){ 
    return http.post(`${resquest}/sys-plan-device`,params)
}

export function putGHdevice(params){ 
    return http.put(`${resquest}/sys-plan-device`,params)
}






