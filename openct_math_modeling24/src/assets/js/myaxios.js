import axios from 'axios'
import qs from 'qs'
axios.defaults.baseURL="http://127.0.0.1:8088" 
axios.defaults.withCredentials = true;
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){   
    if(url.includes('login')) {  //登录接口不带cookie
        console.log('设置不带cookie')
        axios.defaults.withCredentials = false;
    }
    else{
        axios.defaults.withCredentials = true;
        console.log('设置带cookie');
    }
    return new Promise((resolve, reject) =>{
         
        console.log('axios.defaults.withCredentials',axios.defaults.withCredentials)       
        axios.get(url, {            
            params: params ,
            headers: {},     
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */

export function post(url, params) {
    if(url.includes('login')) {  //登录接口不带cookie
        console.log('设置不带cookie');
        axios.defaults.withCredentials = false;
    }
    else{
        axios.defaults.withCredentials = true;
        console.log('设置带cookie');
    }  
    return new Promise((resolve, reject) => {
        console.log('axios.defaults.withCredentials',axios.defaults.withCredentials)       
         axios.post(url, qs.stringify(params))
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}


export function registerhttp(url, params) {

     axios.defaults.withCredentials = true;
    return new Promise((resolve, reject) => {
        //console.log('axios.defaults.withCredentials',axios.defaults.withCredentials)       
         axios.post(url, params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}