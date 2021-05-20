var update_duplicate = false;
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
	form.on('submit(formDemo)', function (data) {
		layer.alert(JSON.stringify(data.field), {
			title: '最终的提交信息'
		})
		return false;
	});
	var tableName = getQueryVariable("tableName");
	var lim = 20;
	var condition = { "tableName": tableName, "condition": "", "page": "0," + 20 }


	var unit = {};
	var count = 20, getCount = true;
	$.ajax({
		url: hostName + '/test/getUnit',
		type: 'post',
		data: { "tableName": tableName },
		async: false,
		success: function (res) {
			//console.log(res)
			unit = res;
		}
		//…
	});

	renderThisPage(condition);
	function renderThisPage(json) {
		if (getCount) json['count'] = true;
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: hostName + '/test/select',
			type: 'post',
			data: JSON.stringify(json),
			dataType: "json",
			contentType: "application/json",
			async: false,
			success: function (res) {
				//console.log(res)
				if (getCount) {
					count = res[0];
					res.splice(0, 1);
					getCount = !getCount;
					delete condition.count;
				}
				data1 = res;
				layer.close(load);
			}
			//…
		});

		var cur = (json.page.split(','))[0] / (json.page.split(','))[1] + 1;
		laypage.render({
			elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
			, count: count //数据总数，从服务端得到
			, limit: lim
			, limits: [10, 20, 50, 100, 200, 300]
			, curr: cur
			, first: '首页'
			, last: '尾页'
			, prev: '上一页'
			, next: '下一页'
			, theme: 'mark'
			, layout: ['count', 'page', 'prev', 'next', 'skip', 'limit']
			, jump: function (obj, first) {
				//obj包含了当前分页的所有参数，比如：
				// console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
				// console.log(obj.limit); //得到每页显示的条数

				//首次不执行
				if (!first) {
					lim = obj.limit;
					//do something
					condition.page = (obj.curr - 1) * obj.limit + ',' + obj.limit
					renderThisPage(condition)

				}
			}
		});
		var col = [[{ type: 'checkbox', fixed: 'left' }, { field: 'Id', title: 'Id', sort: true }]], edi = { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 };
		//col:存放数据表格的表头
		colList = [];//存放所有元素名
		for (var key in unit) {//unit：json，存放”元素-元素单位“键值对。该for循环将利用unit生成数据表格的表头
			if (key == 'Id') continue;
			var item = { field: key, title: key + "(" + unit[key] + ")", sort: true }
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
			if (update_duplicate) data.field['update_duplicate'] = 'true';
			$.ajax({
				url: hostName + '/test/insert',
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
				url: hostName + '/test/modify',
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
				$.ajax({
					url: hostName + '/test/select',
					type: 'post',
					data: JSON.stringify({"tableName":condition.tableName,"condition":condition.condition}),
					dataType: "json",
					contentType: "application/json",
					async: false,
					success: function (res) {
						exportToExcel(res);
					}
					//…
				});

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
			case 'deleteTable':
				layer.open({
					title: '设置'
					, btn: ['删除表格', update_duplicate ? ('忽略主键重复数据') : ('更新主键重复数据')]
					, btn1: function (index, layero) {
						layer.close(index);
						const $ = layui.jquery;
						layer.confirm('亲亲，确定要删除表“' + tableName + '”么?', { icon: 3, title: '提示' }, function (index) {
							//do something
							var load = layer.load(2, { time: 10 * 1000 });
							$.ajax({
								url: hostName + '/test/deleteTable',
								type: 'post',
								data: { "tableName": tableName },
								success: function (res) {
									// console.log(res);
									if (res == true) { window.location = './searchTable.html'; }
									else layer.msg("删除失败！", { icon: 5 });
									layer.close(load);
								}
							});
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
					condition.condition = value;
					renderThisPage(condition);
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
			url: hostName + '/test/delete',
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
		if (update_duplicate) data[item]['update_duplicate'] = 'true';
	}
	layui.use(['jquery'], function () {
		const $ = layui.jquery;
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: hostName + '/test/insert',
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