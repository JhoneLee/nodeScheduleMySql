/*
* @Author: liyunjiao2048@163.com
* @Date:   2018-07-11 16:20:46
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2018-07-12 16:22:46
*/

//获取正在热映的电影
const pool = require('../sql/pool');
const request = require('../utils/request').request;
const api = require('../config/datasource');
const tool = require('../utils/tools');

let {query} = pool;
let {htmlEncode} = tool;




async function getData(){
    console.log('begin getData');
    // 从mtime api 获取数据
    let source = await request({
        uri:api.mtime,
        params:{
            locationId:290
        }
    });
    let arrs = dealData(source);
    // 插入正在热映数据---
    let sqlShow = `insert into current_show(m_id,date,m_cc,m_sc,m_record) values${arrs.show.join(',')}`;
    // await query(sqlShow);
    // todo 待完成出错数据回滚
     
    let sql1 = 'select m_id,m_name,m_record from movie_detail where m_id=242167';
    let result = await query(sql1);
    console.log(result);
    // 插入detail数据
    if(arrs.detail.length){
        let sqlDetail = `insert into movie_detail(m_id,m_record,m_name,m_an1,m_an2,m_desc,m_dn,m_type,m_img,m_is3d,m_date,m_ename,m_year,m_actors) values${arrs.detail.join(',')}
                        on duplicate key update m_record=values(m_record);`;
        // 使用 on duplicate key update ，在插入时有则更新评分，否则插入
        await query(sqlDetail).then((res)=>{
            console.log('success',res);
        }).catch((e)=>{
            console.log('error',e);
        });
    }
    let res = await query(sql1);
    console.log('第二次：',res);
}


async function execAffairs(){
    console.log('begin execAffairs');
     // 写事务
    const conn = await query();
    await conn.beginTransaction(); // begin;
    try{
        await conn.query('select * from movie_detail where m_id=242167 for update');
        await conn.query('update movie_detail set m_record=7.5 where m_id=242167');
        await conn.commit();// commit
        console.log('commit 完毕');
    } catch(e){
        console.log('事务出错',e);
        await conn.rollback();
    }
}

async function init(){
    await execAffairs();
    await getData();
}

init();


// 拆解需要的字段
/*
 本例子为了简化，将正在上映的数据拆为两个表，一个存电影基本信息，一个存正在上映的相关数据
 十分粗糙 请忽略
*/

function dealData(data,table){
    let show = [];
    let detail = [];
    if(data.ms.length){
        data.ms.forEach((e)=>{
            let val1 = [e.id,e.NearestDay,e.cC,e.NearestShowtimeCount,e.r];
            show.push(`(${val1.join(',')})`);
            // if(!table[e.id]){
            detail.push(`(${e.id},${e.r},"${htmlEncode(e.t)}","${e.aN1}","${e.aN2}","${htmlEncode(e.commonSpecial)}","${e.dN}","${htmlEncode(e.movieType)}","${e.img}",${e.is3D},"${e.rd}","${e.tEn}","${e.year}","${htmlEncode(e.actors)}")`);
            //}
        });
        return {
            show,
            detail
        }
    } else {
        return false;
    }
}

module.exports = {
    getCurrentShow:getData
}
