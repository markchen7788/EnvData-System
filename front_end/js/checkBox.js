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
					if (preSetCheckBox.indexOf(getParameter(res[item]["字段注释"], 'colName'))!=-1) continue;
					var i = {};
					i["Id"] =res[item]["参数名"];
					i["表名"] = getParameter(res[item]["注释"],'tableName');
					i["参数名"] =getParameter(res[item]["字段注释"], 'colName');
					i["单位"] = getParameter(res[item]["字段注释"], 'unit');
					i["数据类型"] = res[item]["数据类型"];
					i["备注"] = getParameter(res[item]["字段注释"], 'comment');
					data1.push(i);
				}


				var col = [[{ type: 'checkbox', fixed: 'left' }]];
				for (var key in data1[0]) {
					if(key=='Id') var item = { field: key, title: key, sort: true, hide:true};
					else var item = { field: key, title: key, sort: true }
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
	function commitAdd(addData) {
		var tableId=getQueryVariable("Id");
		var columnName=[];
		var columnType=[];
		var columnComment=[];
		for(var item in addData)
		{
			columnName.push(addData[item]["参数名"]);
			columnType.push(addData[item]["数据类型"]);
			columnComment.push("unit="+addData[item]["单位"]+"&comment="+addData[item]["备注"]);
		}
		var res={};
		res.tableId=tableId;
		res.columnName=columnName;
		res.columnType=columnType;
		res.columnComment=columnComment;
		return res;
	}
	function _commitAdd(addData) {
		var tableId=getQueryVariable("Id");
		var res=[]
		for(var item in addData)
		{
			var temp={};
			temp.tableId=tableId;
			temp.columnName=addData[item]["Id"];
			temp.columnType=addData[item]["数据类型"];
			temp.columnComment="colName="+addData[item]["参数名"]+"&unit="+addData[item]["单位"]+"&comment="+addData[item]["备注"];
			res.push(temp);
		}
		
		return res;
	}
	table.on('toolbar(test)', function (obj) {
		var checkStatus = table.checkStatus(obj.config.id);
		switch (obj.event) {
			case 'add':
				var data =_commitAdd(checkStatus.data);
				console.log(data);

				$.ajax({
					url: 'http://' + hostName + '/test/AddColumnByTableId',
					type: 'post',
					data: JSON.stringify(data),
					dataType: "json",
					contentType:"application/json",
					success: function (res) {
						console.log(res);
						if(res==true)
						layer.msg("添加成功！");
						else
						layer.msg("添加失败！");
					}});
				break;
		};
	});


	//…
});
