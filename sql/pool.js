/*
* @Author: liyunjiao2048@163.com
* @Date:   2018-07-11 16:10:10
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2018-07-12 16:33:37
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
        return sql?con.query(sql):con;
    })
}

// 连接测试
// async function getkkk(){
//     let con = await pool.getConnection();
//     await con.query('select * from movie_detail where m_id=242167');
//     await con.release();
// }
// for(let i=0;i<20;i++){
//     getkkk();
// }




module.exports ={
    pool,
    getSqlConnection,
    query
}