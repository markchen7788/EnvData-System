var hostName = 'markchen7788.xyz:8888'//'localhost:8888'
var bg_num = 7;
var current_bg_num = 0;
var changedCols = [], tableInfoChanged = false;
function onChange(Id, c) {
    if (Id > 0 && changedCols.indexOf(Id) == -1 && addCol.indexOf(Id) == -1)
        changedCols.push(Id);
    layui.use("jquery", function () {
        const $ = layui.jquery;
        switch (c) {
            case 0: $("#parameterName" + Id).attr("class", "layui-badge-dot layui-bg-green"); break;
            case 1: $("#parameterUnit" + Id).attr("class", "layui-badge-dot layui-bg-green"); break;
            case 2: $("#parameterType" + Id).attr("class", "layui-badge-dot layui-bg-green"); break;
            case 3: $("#parameterMemo" + Id).attr("class", "layui-badge-dot layui-bg-green"); break;
            case 4: tableInfoChanged = true; $("#tableName").attr("class", "layui-badge-dot layui-bg-green"); break;
            case 5: tableInfoChanged = true; $("#tableComment").attr("class", "layui-badge-dot layui-bg-green"); break;
        }

    });

}
function changeBg() {
    current_bg_num++;
    if (current_bg_num > bg_num) current_bg_num = 0;
    document.body.style.background = "url(./res/index_bg" + current_bg_num + ".jpg) no-repeat";
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
