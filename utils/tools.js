/*
* @Author: liyunjiao2048@163.com
* @Date:   2018-07-11 16:13:39
* @Last Modified by:   liyunjiao2048@163.com
* @Last Modified time: 2018-07-11 16:58:26
*/

module.exports = {
    htmlEncode(str) { 
        var s = ""; 
        if (str.length == 0) return ""; 
        s = str.replace(/&/g, "&amp;"); 
        s = s.replace(/</g, "&lt;"); 
        s = s.replace(/>/g, "&gt;"); 
        s = s.replace(/ /g, "&nbsp;"); 
        s = s.replace(/\'/g, "&#39;"); 
        s = s.replace(/\"/g, "&quot;"); 
        s = s.replace(/\n/g, "<br/>"); 
        return s; 
    } 
}