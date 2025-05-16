import http from '../utils/http'
// 
/** * @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/... * @param '/testIp'代表vue-cil中config，index.js中配置的代理 */
let resquest = "/fd"

// get请求
export function getListAPI(params){ 
    return http.get(`${resquest}/sys-device`,params)
}


// post请求


//登录接口
export function postLogin(params){ 
    return http.post(`${resquest}/sys/login`,params)
}
//退出登录
export function postLoginOut(params){ 
    return http.post(`${resquest}/sys/logout`,params)
}

//设备列表
export function getShebeiList(params){ 
    return http.get(`${resquest}/sys-device`,params)
}




// //频谱查询
export function getCmdRate(params){ 
    return http.get(`${resquest}/cmd/rate`,params)
}
//  频谱查询停止
export function getCmdRateStop(params){ 
    return http.get(`${resquest}/cmd/rate/stop`,params)
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

//手动保存经纬度
export function saveLngLat(params){ 
    return http.put(`${resquest}/sys-device/position`,params)
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






// put 请求
export function putSomeAPI(params){ 
    return http.put(`${resquest}/putSome.json`,params)
}
// delete 请求
export function deleteListAPI(params){ 
    return http.delete(`${resquest}/deleteList.json`,params)
}


