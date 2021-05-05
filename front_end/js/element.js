var colNameJson = { "Id": "Id", "elementName": "元素名", "elementUnit": "元素单位", "dataType": "元素类型", "elementMemo": "备注" }
layui.use(['element', 'table', 'jquery', 'laytpl'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	var laytpl = layui.laytpl;
	var tableCols = {};
	var data1;
	function renderThisPage(json) {
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: 'http://' + hostName + '/test/select',
			type: 'post',
			data: json,
			async: false,
			success: function (res) {

				data1 = res;
				//console.log(JSON.stringify(data1));
				layer.close(load);
			}
			//…
		});
		var col = [[{ type: 'checkbox', fixed: 'left' }]], edi = { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 };
		for (var key in colNameJson) {
			var item = { field: key, title: key, sort: true }
			col[0].push(item)
			tableCols[key] = "";
		}
		col[0].push(edi)
		//console.log(col);

		table.render({
			elem: '#test'
			, data: data1
			, height: 'full'
			, even: 'true'
			, size: 'sm'
			, cellMinWidth: 100 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
			, toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
			, defaultToolbar: ['filter', 'print']
			, cols: col
			, page: { limit: 18 }
			,initSort: {
				field: 'id' //排序字段，对应 cols 设定的各字段名
				,type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
			  }
		});

	}

	renderThisPage({ "tableName": "element", "condition": "" });

	form.on('submit(saveElementInfo)', function (data) {
		var load = layer.load(2, { time: 10 * 1000 });
		data.field.tableName = 'element';
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




	table.on('toolbar(test)', function (obj) {
		var checkStatus = table.checkStatus(obj.config.id);
		switch (obj.event) {
			case 'add':
				tableCols.Id = -1;
				addLay(tableCols);
				break;
			case 'import':
				document.getElementById('upload').click();
				break;
			case 'export':
				exportToExcel(data1);
				break;
			case 'return':
				window.history.back();
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
					renderThisPage({ "tableName": "element", "condition": value });
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
			temp.tableName = "element";
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
	for (var item in data) {
		data[item]['tableName'] = 'element';
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