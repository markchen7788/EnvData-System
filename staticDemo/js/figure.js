var data3 = [];//不要删！！！！！
var categorie = [], res = [], xName;
var axis = getQueryVariable('axis').split(',');
layui.use(['jquery', 'layer'], function () {
    layer.msg("静态演示中横坐标数据未排序,而正式系统里的横坐标数据是经过数据库管理系统排过序的！")
    const $ = layui.jquery;
    $.ajax({
        url: 'testJsonData/' + getQueryVariable("tableName") + '.json',
        type: 'post',
        data: JSON.stringify({ "tableName": getQueryVariable("tableName"), "condition": "", "order": axis[0] }),
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (res) {
            //  console.log(getQueryVariable("tableName"));
            //console.log(res)
            data3 = res;
            //获取用户选取的横纵坐标参数名
            // console.log(data3);
            // console.log(axis[0]);
            //console.log(axis.splice(1, axis.length - 1));
            var categorie = [], res = [], xName;
            var axis = getQueryVariable('axis').split(',');
            transform(data3, axis[0], axis.slice(1, axis.length))
            function transform(data3, xAxis, yAxis) {//将后端传来的数据格式转换成highcharts可以渲染的格式
                //console.log(yAxis);
                xName = xAxis;
                for (var i = 0; i < yAxis.length; i++) {
                    var tmp = {};
                    tmp['name'] = yAxis[i];
                    tmp['data'] = [];
                    res.push(tmp);
                }
                for (var i in data3) {
                    //   console.log(data3[i]);
                    categorie.push(data3[i][xAxis]);
                    for (var j = 0; j < yAxis.length; j++) {
                        res[j].data.push(parseFloat(data3[i][yAxis[j]]));
                    }
                }
                // console.log(res);
                // console.log(categorie);
            }

            Highcharts.chart('container', {
                chart: {
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift',
                    scrollablePlotArea: {
                        minWidth: 600
                    }
                },
                title: {
                    text: 'EnvData环境监测数据管理系统'
                },

                subtitle: {
                    text: '图表生成'
                },

                yAxis: {
                    title: {
                        text: '元素'
                    }
                },

                xAxis: {
                    title: {
                        text: xName
                    },
                    categories: categorie//[1, 2, 3, 4, 5, 6, 7, 8]
                },

                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

                // plotOptions: {
                //     series: {
                //         label: {
                //             connectorAllowed: false
                //         },
                //         pointStart: 2010
                //     }
                // },

                series: res,
                //  [{
                //     name: 'Installation',
                //     data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                // }, {
                //     name: 'Manufacturing',
                //     data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
                // }, {
                //     name: 'Sales & Distribution',
                //     data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
                // }, {
                //     name: 'Project Development',
                //     data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
                // }, {
                //     name: 'Other',
                //     data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
                // }],

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }

            });


        }
        //…
    });

});
