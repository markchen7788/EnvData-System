layui.use(['element', 'table', 'jquery', 'laytpl', 'form'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	form.render();
	var laytpl = layui.laytpl;
	var tableCols = {};
	var data1;
	var colList = [];
	form.on('submit(formDemo)', function (data) {
		layer.alert(JSON.stringify(data.field), {
			title: '最终的提交信息'
		})
		return false;
	});
	var tableName = getQueryVariable("tableName");
	var condition = { "tableName": tableName, "condition": "" }
	renderThisPage(condition);

	function renderThisPage(json) {
		var load = layer.load(2, { time: 10 * 1000 });
		var unit={};
		$.ajax({
			url: 'http://' + hostName + '/test/select',
			type: 'post',
			data: json,
			async: false,
			success: function (res) {
				//console.log(res)
				data1 = res;
				//layer.close(load);
			}
			//…
		});
		$.ajax({
			url: 'http://' + hostName + '/test/getUnit',
			type: 'post',
			data: {"tableName":json.tableName},
			async: false,
			success: function (res) {
				console.log(res)
				unit=res;
				layer.close(load);
			}
			//…
		});

		var col = [[{ type: 'checkbox', fixed: 'left' }, { field: 'Id', title: 'Id', sort: true }]], edi = { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 };
		for (var key in data1[0]) {
			if (key == 'Id') continue;
			var item = { field: key, title: key+"("+unit[key]+")", sort: true }
			colList.push(key);
			col[0].push(item)
			tableCols[key] = "";
		}
		col[0].push(edi)
		table.render({
			elem: '#test'
			, data: data1
			, height: 'full'
			, even: 'true'
			, size: 'sm'
			, cellMinWidth: 120 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
			, toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
			, defaultToolbar: ['filter', 'print']
			, cols: col
			, page: { limit: 18, limits: [10, 20, 50, 100, 200, 300] }
			, initSort: {
				field: 'id' //排序字段，对应 cols 设定的各字段名
				, type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
			}
		});
	}


	form.on('submit(saveElementInfo)', function (data) {
		var load = layer.load(2, { time: 10 * 1000 });
		data.field.tableName = tableName;
		if (data.field.Id == -1)//增加
		{
			delete data.field.Id;
			$.ajax({
				url: 'http://' + hostName + '/test/insert',
				type: 'post',
				data: JSON.stringify([data.field]),
				dataType: "json",
				contentType: "application/json",
				success: function (res) {

					if (res == true) layer.msg("添加成功！")
					else layer.msg("添加失败！")
					layer.close(load);
				}
				//…
			});
		}
		else//修改
		{
			data.field.condition = 'Id=' + data.field.Id;
			delete data.field.Id;
			$.ajax({
				url: 'http://' + hostName + '/test/modify',
				type: 'post',
				data: JSON.stringify(data.field),
				dataType: "json",
				contentType: "application/json",
				success: function (res) {

					if (res == true) layer.msg("修改成功！")
					else layer.msg("修改失败！")
					layer.close(load);
				}
				//…
			});
		}
		return false;
	});
	form.on('submit(saveAixs)', function (data) {
		var tmp = data.field;
		var yAxis = [];
		yAxis.push(tmp.xAxis);
		delete tmp.xAxis;
		for (var i in tmp)
			yAxis.push(i);
		console.log(yAxis.toString());
		layer.open({
			type: 2,
			title: '折线图',
			offset: 'auto',
			resize: true,
			area: ['1000px', '600px'],
			shadeClose: true,
			shade: 0, //遮罩透明度
			content: "./figure.html?tableName=" + tableName + "&axis=" + yAxis.toString(), //这里content是一个普通的String
		});
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
				exportToExcel(data1);
				break;
			case 'full':
				$("body").attr('class', '');
				$("#restore").attr('class', 'layui-inline');
				$("#full").attr('class', 'layui-hide');
				break;
			case 'restore':
				$("body").attr('class', 'layui-main');
				$("#full").attr('class', 'layui-inline');
				$("#restore").attr('class', 'layui-hide');
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
				var l=layer.open({
					title: '统计分析',
					type: 2,
					shade: 0,
					area: ['1000px', '320px'],
					content: './statistic.html?tableName='+tableName //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
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
					renderThisPage({ "tableName": tableName, "condition": value });
					layer.close(index);
				});
				layer.style(L, {
					opacity: 0.9,
				});
				break;
			case 'reload':
				window.location.reload();
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

		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: 'http://' + hostName + '/test/delete',
			type: 'post',
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json",
			success: function (res) {

				if (res == true) layer.msg("删除成功！")
				else layer.msg("删除失败！")
				layer.close(load);
			}
			//…
		});

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
	}
	layui.use(['jquery'], function () {
		const $ = layui.jquery;
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: 'http://' + hostName + '/test/insert',
			type: 'post',
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json",
			success: function (res) {

				if (res == true) layer.msg("导入成功！")
				else layer.msg("导入失败！")
				layer.close(load);
			}
			//…
		});
	});
}