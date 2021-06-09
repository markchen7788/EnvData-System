layui.use(['table', 'jquery'], function () {
    var table = layui.table;
    const $ = layui.jquery;
    var data1 = data1;

    var load = layer.load({ time: 10 * 1000 });
    $.ajax({
        url: hostName + '/test/getStatistics',
        type: 'post',
        data: { "tableName": getQueryVariable("tableName") },
        success: function (res) {
            //console.log(res)
            data1 = res;
            var col = [[{ field: '统计项目', title: '统计项目' }]];
            for (var key in data1[0]) {
                if(key=='统计项目') continue;
                var item = { field: key, title: key }
                col[0].push(item)
            }
            table.render({
                elem: '#test'
                , data: data1
                , height: 'full'
                , even: 'true'
                , size: 'sm'
                , cellMinWidth: 100 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                , toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
                , defaultToolbar: ['filter', 'print', "exports"]
                , cols: col
            });

            layer.close(load);
        }
        //…
    });


});