/*
* @Author: liyunjiao2048@163.com
* @Date:   2018-07-11 16:10:10
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2018-07-11 16:31:55
*/

const mysql = require('promise-mysql');
const config = require('../config/connect');
const Promise = require('bluebird');
// 建立连接池
const pool = mysql.createPool(config); // 使用pool.query 快速连接

// 用using/dispsoer 模式构建连接
function getSqlConnection(){
    return pool.getConnection().disposer((c)=>{
        pool.releaseConnection(c);
    });
}

// 使用bluebird 封装具有dispsoer功能的promise对象
function query(sql){
    return Promise.using(getSqlConnection(),(con)=>{
        return con.query(sql);
    })
}

module.exports ={
    pool,
    getSqlConnection,
    query
}