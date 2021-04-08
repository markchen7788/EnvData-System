layui.use(['element', 'table', 'jquery'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	form.on('submit(formDemo)', function (data) {
		layer.alert(JSON.stringify(data.field), {
			title: '最终的提交信息'
		})
		return false;
	});
	var tableName = getQueryVariable("tableName");
	var condition = { "tableName": tableName }
	console.log(tableName);
	var data1;
	$.ajax({
		url: 'http://' + hostName + '/test/getTableData',
		type: 'post',
		data: condition,
		success: function (res) {
			console.log(res)
			data1 = res;



			var col = [[{ type: 'checkbox', fixed: 'left' }]], edi = { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 };
			for (var key in data1[0]) {
				var item = { field: key, title: key, sort: true }
				col[0].push(item)
			}
			col[0].push(edi)

			table.render({
				elem: '#test'
				, data: data1
				, height: 'full'
				, even: 'true'
				, size: 'sm'
				, cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
				, toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
				, defaultToolbar: ['filter', 'print', 'exports']
				, cols: col
				, page: {theme: 'mark'}
			});
		}
		//…
	});

	table.on('toolbar(test)', function (obj) {
		var checkStatus = table.checkStatus(obj.config.id);
		switch (obj.event) {
			case 'add':
				layer.msg('手动添加');
				break;
			case 'import':
				layer.msg('导入xls文件');
				break;
			case 'chart':
				layer.open({
					type: 2,
					area: ['1000px', '600px'],
					content: './figure.html' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
				});
				break;
			case 'multiDelete':
				var data = checkStatus.data;
				layer.alert(JSON.stringify(data));
				break;
		};
	});
	table.on('tool(test)', function (obj) {
		var data = obj.data;
		//console.log(obj)
		if (obj.event === 'del') {
			layer.confirm('真的删除行么', function (index) {
				obj.del();
				layer.close(index);
			});
		} else if (obj.event === 'edit') {
			layer.prompt({
				formType: 2
				, value: data.email
			}, function (value, index) {
				obj.update({
					email: value
				});
				layer.close(index);
			});
		}
	});

	//…
});