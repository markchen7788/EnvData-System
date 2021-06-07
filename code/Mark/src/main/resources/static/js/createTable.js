var curTableName = "site", ele = [];
layui.use(['element', 'table', 'jquery'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	form.on('submit(formDemo)', function (data) {
		updataForm(data.field.condition)
		return false;
	});
	//updataForm("")
	function updataForm(condition) {
		if (curTableName == 'site') condition += "&&" + getQueryVariable("area");
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: hostName + '/test/select',
			type: 'post',
			data: JSON.stringify({ "tableName": curTableName, 'condition': condition }),
			dataType: "json",
			contentType: "application/json",
			success: function (res) {

				// console.log(res);
				var data1 = res;
				var col = [[{ type: 'checkbox', fixed: 'left' }]];
				for (var key in data1[0]) {
					if (key == 'Id') var item = { field: key, title: key, sort: true, hide: true };
					else var item = { field: key, title: key, sort: true }
					col[0].push(item)
				}

				table.render({
					elem: '#test'
					, data: data1
					, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
					, toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
					, cols: col
					, page: true
				});
				layer.close(load);
			}
		});
	}

	table.on('toolbar(test)', function (obj) {
		var checkStatus = table.checkStatus(obj.config.id);
		switch (obj.event) {
			case 'add':
				var data = checkStatus.data;
				if (curTableName == 'site') {
					if (data.length > 1) layer.msg("亲亲,只能选择一个站点哦！");
					else {
						$("#siteInfo").html("<tr><td>" + "站点Id" + "</td><td>" + data[0].Id + "</td></tr>" + "<tr><td>" + "站点名" + "</td><td>" + data[0].siteName + "</td></tr>" + "<tr><td>" + "地区" + "</td><td>" + data[0].area + "</td></tr>" + "<tr><td>" + "备注" + "</td><td>" + data[0].comment + "</td></tr>");
						form.val("formTest", { "siteId": data[0].Id })
					}
				} else {
					ele = removeRepeat(ele, data)
					renderPri(ele);
				}
				break;
		};
	});

	function renderPri(data) {
		var col = [[{ field: "Id", title: "Id", sort: true }, { field: "elementName", title: "参数名", sort: true }, { field: "dataType", title: "数据类型", sort: true }, { field: "elementUnit", title: "单位", sort: true }, { field: "elementMemo", title: "备注", sort: true }, { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 75 }]];
		table.render({
			elem: '#pri'
			, data: data
			, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
			, cols: col
			, size: 'sm'
			, page: true
		});

		var s = "";
		for (var i in data) {
			s = s + '<div class="layui-col-md3"><input  type="checkbox" name="' + data[i].elementName + '" title="' + data[i].elementName + '"  lay-skin="primary"></div>';
		}
		// console.log(s);
		$("#priCheckBox").html(s);
		form.render();
	}

	function removeRepeat(old, _new) {
		var temp = [];
		for (var i in old) {
			temp.push(old[i].Id);
		}
		for (var i in _new) {
			if (temp.indexOf(_new[i].Id) == -1) {
				old.push(_new[i]);
				temp.push(_new[i].Id);
			}
		}
		return old;
	}

	function removeById(data, Id) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].Id == Id) {
				data.splice(i, 1);
				break;
			}
		} return data;
	}

	table.on('tool(pri)', function (obj) {
		var data = obj.data;
		//console.log(obj)
		if (obj.event === 'del') {
			var L = layer.confirm('亲亲，真的删除行么？', function (index) {
				//console.log(data);
				renderPri(removeById(table.getData('pri'), data.Id));
				layer.close(index);
			});
			layer.style(L, {
				opacity: 0.9,
			});
		}
	});

	$("#chooseSite").click(function () {
		curTableName = 'site';
		updataForm("");
		var addLayer = layer.open({
			title: '请选择站点',
			type: 1,
			offset: 't',
			area: ['1200px', '670px'],
			content: $('#checkBox'),
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	});
	$("#chooseElement").click(function () {
		curTableName = 'element';
		updataForm("");
		var addLayer = layer.open({
			type: 1,
			title: '请选择元素',
			offset: 't',
			area: ['1200px', '670px'],
			content: $('#checkBox')
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	});
	form.on('submit(save)', function (data) {
		//console.log(ele);
		var json = { "tableName": data.field.tableName, "tableComment": data.field.tableComment, "siteId": data.field.siteId, "param": ele };
		delete data.field.siteId;
		delete data.field.tableName;
		delete data.field.tableComment;
		var tmp = [];
		for (var key in data.field) {
			tmp.push(key);
		}
		if (tmp.length > 0)
			json["pri"] = "`" + tmp.join('`,`') + "`";
		//console.log(json);
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: hostName + '/test/CreateTable',
			type: 'post',
			data: JSON.stringify(json),
			dataType: "json",
			contentType: "application/json",
			success: function (res) {

				if (res == true) {
					layer.msg("添加成功！")
					window.top.location = "/";
				}
				else layer.msg("添加失败！")
				layer.close(load);
			}
			//…
		});

		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	//…
});
