/*
* @Author: liyunjiao2048@163.com
* @Date:   2018-07-11 16:36:22
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2018-07-11 16:37:29
*/

const req = require('request-promise');

async function request(opt){
    let {uri,params,headers,method,success,error} = opt;
    let options = {};
    if(method == 'post' || method == 'POST'){
        options = {
            method,
            uri,
            body:params
        };
    } else {
        options = {
            method,
            uri,
            qs:params,
            headers
        }
    }
    options.json = true;
    let kk = await req(options).then((res)=>{
        success && success(res);
        return res;
    }).catch((e)=>{
        console.log(e);
        error && error(e);
        return false;
    });
    return kk;
}

module.exports = {
    request
}