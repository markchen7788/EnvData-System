//////////////////测试数据
var getUnit = {
	"宝鸡渭滨区水质监测表": {
		"Sample ID": "",
		"SO₄²ˉ": "ug/cm2",
		"NO₃ˉ": "ug/cm2",
		"Clˉ": "ug/cm2",
		"Na+": "ug/cm2",
		"TABLE_PRI": "Sample ID"
	},
	"铜川耀州气象监测表": {
		"WIN_D": "",
		"WIN_S": "",
		"RHU": "%",
		"TEM": "℃",
		"PRS": "Pa",
		"时间": "",
		"TABLE_PRI": "时间"
	},
	"西安未央气象监测表": {
		"时间": "",
		"PM₂.₅": "μg/m3",
		"PM10": "μg/m3",
		"SO2": "μg/m3",
		"NO2": "μg/m3",
		"CO": "μg/m3",
		"O3": "μg/m3",
		"AQI": "",
		"TABLE_PRI": "时间"
	}
}
///////////////////////////////////////////////////////////
var update_duplicate = false;
var lim = 15;
layui.use(['element', 'table', 'jquery', 'laytpl', 'form', 'laypage'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	var laypage = layui.laypage;
	form.render();
	var laytpl = layui.laytpl;
	var tableCols = {};
	var data1;
	var colList = [];
	var pri = '';
	var tableName = getQueryVariable("tableName");
	var condition = { "tableName": tableName, "condition": "", "page": "0," + lim, "order": "Id&&ASC" }


	var unit = {};
	var count = 20, getCount = true;
	var res = getUnit;
	res = res[tableName];
	unit = res;
	pri = res.TABLE_PRI;
	delete res.TABLE_PRI;
	renderThisPage(condition);


	function renderThisPage(json) {
		if (getCount) json['count'] = true;
		var res = tableData[json.tableName];
		if (getCount) {
			count = res[0];
			res.splice(0, 1);
			getCount = !getCount;
			delete condition.count;
		}
		data1 = res;

		var col = [[{ type: 'checkbox', fixed: 'left' }, { field: 'Id', title: 'Id', sort: true }]], edi = { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 };
		//col:存放数据表格的表头
		colList = [];//存放所有元素名
		for (var key in unit) {//unit：json，存放”元素-元素单位“键值对。该for循环将利用unit生成数据表格的表头
			if (key == 'Id' || key == 'TABLE_PRI') continue;
			if (unit[key] == "") var item = { field: key, title: key, sort: true }
			else var item = { field: key, title: key + "(" + unit[key] + ")", sort: true }
			colList.push(key);
			col[0].push(item)
			tableCols[key] = "";
		}
		col[0].push(edi)
		table.render({//渲染HTMl文件中的数据表格
			elem: '#test'//表格Id
			, data: data1//后端获取的数据
			, height: 'full'
			, even: 'true'
			, size: 'sm'
			, cellMinWidth: 120 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
			, toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
			, defaultToolbar: ['filter', 'print']
			, cols: col//数据表格表头
			, limit: data1.length
			, page: { limit: 15, limits: [15, 30, 50, 100, 200, 300] }
		});
		$('#tableHead').html('表名:' + tableName);
		$('#priHead').html('主键:' + pri);
	}


	form.on('submit(saveElementInfo)', function (data) {
		layer.msg(JSON.stringify(data.field))
		return false;
	});
	form.on('submit(saveAixs)', function (data) {
		var tmp = data.field;
		var yAxis = [];
		yAxis.push(tmp.xAxis);
		delete tmp.xAxis;
		for (var i in tmp)
			yAxis.push(i);
		//console.log(yAxis.toString());
		layer.open({
			type: 2,
			title: '折线图',
			offset: 'auto',
			resize: true,
			area: ['1000px', '600px'],
			shadeClose: true,
			shade: 0, //遮罩透明度
			content: "./figure.html?tableName=" + getQueryVariable("tableName") + "&axis=" + yAxis.toString(), //这里content是一个普通的String
		});
		return false;
	});
	form.on('submit(saveOrder)', function (data) {
		condition.order = data.field.orderBy + "&&" + data.field.orderOption;
		layer.msg("后端排序SQL:select * from " + getQueryVariable("tableName") + " order by " + data.field.orderBy + " " + data.field.orderOption);
		return false;
	});

	table.on('toolbar(test)', function (obj) {
		var checkStatus = table.checkStatus(obj.config.id);
		switch (obj.event) {
			case 'add':
				tableCols.Id = -1;
				addLay(tableCols);
				break;
			case 'return':
				window.history.back();
				break;
			case 'import':
				document.getElementById('upload').click();
				break;
			case 'export':
				exportToExcel(tableData[getQueryVariable("tableName")]);
				break;
			case 'deleteTable':
				layer.open({
					title: '设置'
					, btn: ['删除表格', update_duplicate ? ('忽略主键重复数据') : ('更新主键重复数据')]
					, btn1: function (index, layero) {
						layer.close(index);
						const $ = layui.jquery;
						layer.confirm('亲亲，确定要删除表“' + tableName + '”么?', { icon: 3, title: '提示' }, function (index) {
							layer.msg("删除表格！");
							layer.close(index);
						});

					}
					, btn2: function (index, layero) {
						update_duplicate = !update_duplicate;
						layer.close(index);
					}
				});

				break;
			case 'chart':
				var html = document.getElementById("Axis").innerHTML
				// console.log(html);
				// console.log(colList);
				laytpl(html).render(['Id'].concat(colList), function (res) {
					html = res;
				});
				var addLayer = layer.open({
					type: 1,
					title: '生成折线图',
					offset: 'auto',
					area: ['500px', '600px'],
					shadeClose: true,
					shade: 0, //遮罩透明度
					content: html, //这里content是一个普通的String
					success: function () { form.render('select'); form.render('checkbox'); },
					cancel: function (index, layero) {
						//window.location.reload();
					}
				});
				layer.style(addLayer, {
					opacity: 0.9,
				});

				// layer.open({
				// 	type: 2,
				// 	area: ['1000px', '600px'],
				// 	content: './figure.html' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
				// });
				break;
			case 'statistic':
				var l = layer.open({
					title: '统计分析',
					type: 2,
					shade: 0,
					area: ['1000px', '320px'],
					content: './statistic.html?tableName=' + tableName //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
				});
				layer.style(l, {
					opacity: 0.9,
				});
				break;
			case 'multiDelete':
				var data = checkStatus.data;
				var addLayer = layer.open({
					type: 1,
					offset: 'auto',
					area: '500px',
					btn: ['确认'],
					yes: function (index, layero) {
						deleteElement(data);
					},
					content: '  亲亲，真的删除这些行么？', //这里content是一个普通的String
					cancel: function (index, layero) {
						window.location.reload();
					}
				});
				layer.style(addLayer, {
					opacity: 0.9,
				});
				break;
			case 'query':
				var L = layer.prompt({
					formType: 0,
					title: '查询'
				}, function (value, index, elem) {
					condition.page = "0," + lim;
					condition.condition = value;
					getCount = true;
					layer.msg(JSON.stringify(condition));
					layer.close(index);
				});
				layer.style(L, {
					opacity: 0.9,
				});
				break;
			case 'reload':
				window.location.reload();
				break;
			case 'order':
				var html = document.getElementById("chooseOrder").innerHTML
				// console.log(html);
				// console.log(colList);
				laytpl(html).render(['Id'].concat(colList), function (res) {
					html = res;
				});
				var addLayer = layer.open({
					type: 1,
					title: '排序',
					offset: 'auto',
					area: ['500px', '600px'],
					shadeClose: true,
					shade: 0, //遮罩透明度
					content: html, //这里content是一个普通的String
					success: function () {
						form.render('select');
						var tmp = condition.order.split("&&");
						form.val("chooseOrder", { "orderBy": tmp[0], "orderOption": tmp[1] });
						layer.msg("前端排序只针对从后端获取的部分数据，因此要对数据库中所有数据进行排序必须通过后端实现。此处为静态演示，故只显示SQL排序语句来示意本过程！")

					},
					cancel: function (index, layero) {
						//window.location.reload();
					}
				});
				layer.style(addLayer, {
					opacity: 0.9,
				});
				break;
		};
	});
	table.on('tool(test)', function (obj) {
		var data = obj.data;
		//console.log(obj)
		if (obj.event === 'del') {
			var L = layer.confirm('亲亲，真的删除行么？', function (index) {
				obj.del();
				var tmp = [];
				tmp.push(data);
				deleteElement(tmp);
				layer.close(index);
			});
			layer.style(L, {
				opacity: 0.9,
			});
		} else if (obj.event === 'edit') {
			addLay(data);
		}
	});

	function deleteElement(tmp) {

		var data = [];
		for (var item in tmp) {
			var temp = {};
			temp.tableName = tableName;
			temp.condition = "Id=" + tmp[item].Id;
			data.push(temp);
		}
		layer.msg("删除：" + JSON.stringify(data));
	}

	function addLay(data) {
		var html = demo.innerHTML;
		laytpl(html).render(data, function (res) {
			html = res;
		});
		var addLayer = layer.open({
			type: 1,
			title: '站点信息',
			offset: 'auto',
			area: '500px',
			content: html, //这里content是一个普通的String
			cancel: function (index, layero) {
				window.location.reload();
			}
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	}
	//…
});

function getXlsxJson(data) {
	var tableName = getQueryVariable("tableName");
	for (var item in data) {
		data[item]['tableName'] = tableName;
		if (update_duplicate) data[item]['update_duplicate'] = 'true';
	}
	layui.use(['jquery'], function () {
		layer.msg(JSON.stringify(data));
	});
}