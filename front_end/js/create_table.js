var deleteId = [], addCol = [], AllCol = [];
function deleteParameter(id) {
	layui.use(['jquery', 'form'], function () {
		const $ = layui.jquery;
		var form = layui.form;
		var formData = form.val("formTest");
		console.log("点击保存后删除" + formData["parameterId" + id.toString()]);
		if (formData["parameterId" + id.toString()] != "") {
			deleteId.push(formData["parameterId" + id.toString()]);
		}
		$('#param_' + id.toString()).remove();
		form.val("formTest", formData)
	})
};
layui.use(['jquery', 'form', 'laytpl'], function () {
	const $ = layui.jquery;
	var laytpl = layui.laytpl;
	var form = layui.form;
	/////////////////////////////////////////按钮响应
	$("#_addParameter").click(function () {
		_addParameter();
		return false;
	});
	$("#confirm").click(function () {
		var form = layui.form;
		alert("sss");
		var data1 = form.val("formTest");
		console.log(data1);
	});

	$("#addParameter").click(function () {
		// addParameter();
		layer.open({
			type: 2,
			area: ['1000px', '620px'],
			content: './checkBox.html?Id=' + getQueryVariable('Id'), //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
			end: function () {

				location.reload();//弹出层结束后，刷新主页面

			}
		});
		return false;
	});

	form.on('submit(formDemo)', function (data) {
		///////////////保存表的基本信息
		if (tableInfoChanged) {
			var tableInfo = {};
			tableInfo.tableId = getQueryVariable("Id");
			tableInfo.comment = "tableName=" + data.field.tableName + "&comment=" + data.field.tableComment;
			$.ajax({
				url: 'http://' + hostName + '/test/AlterTableInfo',
				type: 'post',
				data: tableInfo,
				success: function (res) {
					if (res == true) {
						layer.msg("表格基本信息修改成功！")
						//location.reload();
					}
					else
						layer.msg("表格基本信息修改失败！");

				}
			});
		}

		//////////////////////////////删除需要删除的字段
		if (deleteId.length > 0) {
			console.log(deleteId);
			$.ajax({
				url: 'http://' + hostName + '/test/deleteColById',
				type: 'post',
				data: { tableId: getQueryVariable("Id"), ids: deleteId },
				success: function (res) {
					if (res == true) {
						layer.msg("表格基本信息修改成功！")
					}
					else
						layer.msg("表格基本信息修改失败！");

				}
			});
		}
		////////////////////////////////////////////处理新添加的字段数据
		tmp = packData(data, addCol);
		if (tmp.length) {
			$.ajax({
				url: 'http://' + hostName + '/test/AddColumnByTableId',
				type: 'post',
				data: JSON.stringify(tmp),
				dataType: "json",
				contentType: "application/json",
				success: function (res) {
					console.log(res);
					if (res == true)
						layer.msg("添加成功！");
					else
						layer.msg("添加失败！");
				}
			});
		}

		///////////////////////////////////处理字段修改

		console.log(changedCols);
		addTmp = packData(data, changedCols);
		if (addTmp.length) {
			$.ajax({
				url: 'http://' + hostName + '/test/AlterColumnByTableId',
				type: 'post',
				data: JSON.stringify(addTmp),
				dataType: "json",
				contentType: "application/json",
				success: function (res) {
					console.log(res);
					if (res == true)
						layer.msg("修改成功！");
					else
						layer.msg("修改失败！");
				}
			});
		}

		/////////////////////////////////////////////
		window.location = "./create_table.html?Id=" + getQueryVariable("Id");
		return false;
	});

	form.on('select(select)', function (data) {
		onChange(parseInt(data.elem.title), 2);
	});
	/////////////////////////////新建表格
	form.on('submit(_formDemo)', function (data) {
		layer.confirm('亲亲，确定要新建一张表么?', { icon: 3, title: '提示' }, function (index) {
			//do something
			var newForm = {}, formData = form.val("formTest");
			newForm.tableComment = "tableName=" + formData.tableName + "&comment=" + formData.tableComment;
			newForm.tableCols = packData({ "field": formData }, AllCol.concat(addCol));
			console.log(newForm);
			$.ajax({
				url: 'http://' + hostName + '/test/CreateTable',
				type: 'post',
				data: JSON.stringify(newForm),
				dataType: "json",
				contentType: "application/json",
				success: function (res) {
					console.log(res);
					if (res == true) layer.msg("建表成功！", { icon: 1 });
					else layer.msg("建表失败！", { icon: 5 });
				}
			});
			layer.close(index);
		});
		return false;
	});

	/////////////////////////////////////////////////////////数据操作函数
	function packData(data, addCol) {
		var addColList = [], tabId = getQueryVariable("Id");
		for (var item in addCol) {
			if (!data.field.hasOwnProperty("parameterId" + addCol[item])) continue;
			var temp = {};
			temp.tableId = tabId;
			temp.columnName = data.field["parameterId" + addCol[item]];
			temp.columnType = data.field["parameterType" + addCol[item]];
			temp.columnComment = "colName=" + data.field["parameterName" + addCol[item]] + "&unit=" + data.field["parameterUnit" + addCol[item]] + "&comment=" + data.field["parameterMemo" + addCol[item]];
			addColList.push(temp);
		}
		console.log(addColList);
		return addColList;
	}
	var dd = 1000;
	function _addParameter() {//处理手动添加的字段数据
		addCol.push(dd);
		var form = layui.form;
		var formData = form.val("formTest");
		//layer.alert(JSON.stringify(formData));
		const $ = layui.jquery;
		var data = { //数据
			count: [dd]
		}
		dd = dd + 1;
		var getTpl = demo.innerHTML
			, view = document.getElementById('view');
		laytpl(getTpl).render(data, function (html) {
			$("#parameterForm").html(
				$("#parameterForm").html() + html
			);
		});

		form.val("formTest", formData)

	}
	function addParameter() {//处理从数据库中读取的字段数据
		var form = layui.form;
		var formData = form.val("formTest");
		//layer.alert(JSON.stringify(formData));
		const $ = layui.jquery;
		var data = { //数据
			count: [dd]
		}
		dd = dd + 1;
		var getTpl = demo.innerHTML
			, view = document.getElementById('view');
		laytpl(getTpl).render(data, function (html) {
			$("#parameterForm").html(
				$("#parameterForm").html() + html
			);
		});

		form.val("formTest", formData)

	}
	////////////////////////////////////////////////////////////页面初始化渲染
	if (getQueryVariable("Id") != "") {
		$.ajax({
			url: 'http://' + hostName + '/test/getCreatTableInfo',
			type: 'post',
			data: { 'Id': getQueryVariable('Id') },
			success: function (res) {
				console.log(res)
				var data = {
					"tableName": getParameter(res[0]["注释"], "tableName"),
					"tableComment": getParameter(res[0]["注释"], "comment")
				};
				for (var item in res) {
					switch (getParameter(res[item]["字段注释"], 'colName')) {
						case '时间': $("#时间").attr("checked", "true"); break;
						case '站点': $("#站点").attr("checked", "true"); break;
						case '地区': $("#地区").attr("checked", "true"); break;
						default:
							{
								AllCol.push(dd);
								data["parameterId" + dd] = res[item]["参数名"];
								data["parameterName" + dd] = getParameter(res[item]["字段注释"], 'colName');
								data["parameterUnit" + dd] = getParameter(res[item]["字段注释"], 'unit');
								data["parameterMemo" + dd] = getParameter(res[item]["字段注释"], 'comment');
								data["parameterType" + dd] = res[item]["数据类型"];
								addParameter();
								break;
							}
					}

				}
				$("#param_0").html("");
				console.log(data);
				form.val("formTest", data);

				//data1 = res;
			}
		});
	}
	else {
		$("#param_0").html("");
		$("#save").attr("class","layui-hide")
		_addParameter();
	}
	////////////////////////////////////////////////////////////////////////////////////





});
