layui.use(['element', 'table', 'jquery'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	form.on('submit(formDemo)', function (data) {
		updataForm(data.field.condition)
		return false;
	});
	updataForm("")
	function updataForm(condition) {
		$.ajax({
			url: 'http://' + hostName + '/test/getAllCol',
			type: 'post',
			data: { 'condition': condition },
			success: function (res) {

				console.log(res);
				var data1 = [];
				for (var item in res) {
					if (res[item]["参数名"] == '时间' || res[item]["参数名"] == '地区' || res[item]["参数名"] == '站点') continue;
					var i = {};
					i["表名"] = res[item]["表名"];
					i["参数名"] = res[item]["参数名"];
					i["单位"] = getParameter(res[item]["字段注释"], 'unit');
					i["数据类型"] = res[item]["数据类型"];
					i["备注"] = getParameter(res[item]["字段注释"], 'comment');
					data1.push(i);
				}


				var col = [[{ type: 'checkbox', fixed: 'left' }]];
				for (var key in data1[0]) {
					var item = { field: key, title: key, sort: true }
					col[0].push(item)
				}

				table.render({
					elem: '#test'
					, data: data1
					, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
					, toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
					, defaultToolbar: ['filter', 'print', 'exports']
					, cols: col
					, page: true
				});

			}
		});
	}

	table.on('toolbar(test)', function (obj) {
		var checkStatus = table.checkStatus(obj.config.id);
		switch (obj.event) {
			case 'add':
				var data = checkStatus.data;
				layer.alert(JSON.stringify(data));
				break;
		};
	});

	//…
});
