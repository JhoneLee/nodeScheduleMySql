/*
* @Author: liyunjiao2048@163.com
* @Date:   2018-07-11 16:58:32
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2018-07-11 17:01:48
*/

const schedule = require('node-schedule');
const getData = require('./task/getCurrentShow');

(function(){
    schedule.scheduleJob('30 5 14 * * *',()=>{
        console.log('定时任务开始')
        getData();
    });
})();