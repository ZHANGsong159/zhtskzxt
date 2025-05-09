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







// put 请求
export function putSomeAPI(params){ 
    return http.put(`${resquest}/putSome.json`,params)
}
// delete 请求
export function deleteListAPI(params){ 
    return http.delete(`${resquest}/deleteList.json`,params)
}


