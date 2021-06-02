var hostName = ''//'localhost:8888';//'markchen7788.xyz:8888';
var bg_num = 16;
var current_bg_num = 0;
function RandomBg() {
    var num = Math.floor(Math.random() * 100);
    num = num % bg_num;
    //document.body.style.background = "url(./res/index_bg" + num + ".jpg) ";
    document.body.style.cssText = createStyle(num);
}
function createStyle(num) {

    return "background:url(./res/index_bg" + num + ".jpg) top left;background-size:100%; margin: 0px;padding: 0px;height: 100%;"
}
function changeBg() {
    current_bg_num++;
    if (current_bg_num > bg_num) current_bg_num = 0;
    //document.body.style.background = "url(./res/index_bg" + current_bg_num + ".jpg) no-repeat 0px 0px";
    document.body.style.cssText = createStyle(current_bg_num);
    //document.getElementById("bg").innerHTML=createStyle(current_bg_num);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return decodeURI(pair[1]); }
    }
    return "";
}
function getParameter(variable, name) {
    var vars = variable.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == name) { return decodeURI(pair[1]); }
    }
    return "";
}
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function exportToExcel(result) {
    layui.use('table', function () {
        var table = layui.table;
        var tpl = [], exp = [];
        for (var item in result) {
            if (item == 0) {
                for (var key in result[item]) {
                    tpl.push(key);
                }
            }
            var tmp = [];
            for (var key in result[item]) {
                tmp.push(result[item][key]);
            }
            exp.push(tmp);
        }
        table.exportFile(tpl, exp, 'xls');
    });
}
