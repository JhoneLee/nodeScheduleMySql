/*
* @Author: liyunjiao2048@163.com
* @Date:   2018-07-11 16:20:46
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2018-07-11 17:00:37
*/

//获取正在热映的电影
const pool = require('../sql/pool');
const request = require('../utils/request');
const api = require('../config.datasource');
const tool = require('../utils/tools');

let {query} = pool;
let {htmlEncode} = tool;




async function getData(){
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
    await query(sqlShow);
    // todo 待完成出错数据回滚

    // 查询当前详情表中已有的数据
    let sql = `select m_id from movie_detail;`
    let result = await query(sql).then((res=>res).catch((err)=>{
        console.log(err);
        return false;
    });
    let table = {};
    result.forEach((e)=>{
        table[e['m_id']] = true;
    });

    // 插入detail数据
    if(arrs.detail.length){
        let sqlDetail = "insert into movie_detail(m_id,m_record,m_name,m_an1,m_an2,m_desc,m_dn,m_type,m_img,m_is3d,m_date,m_ename,m_year,m_actors) values${arrs.detail.join(',')}";
        await query(sqlDetail);
    }
}

// 拆解需要的字段
/*
 本例子为了简化，将正在上映的数据拆为两个表，一个存电影基本信息，一个存正在上映的相关数据
 十分粗糙 请忽略
*/

function dealData(data,table){
    let show = [];
    let detail = [];
    if(res.ms.length){
        res.ms.forEach((e)=>{
            let val1 = [e.id,e.NearestDay,e.cC,e.NearestShowtimeCount,e.r];
            show.push(`(${val1.join(',')})`);
            if(!table[e.id]){
                detail.push(`(${e.id},${e.r},"${html_encode(e.t)}","${e.aN1}","${e.aN2}","${htmlEncode(e.commonSpecial)}","${e.dN}","${htmlEncode(e.movieType)}","${e.img}",${e.is3D},"${e.rd}","${e.tEn}","${e.year}","${htmlEncode(e.actors)}")`);
            }
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
