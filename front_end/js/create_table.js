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
			content: './checkBox.html' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
		});
		return false;
	});
	/////////////////////////////////////////////////////////数据操作函数
	var dd = 1000;
	function _addParameter() {
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
		// 	form.val("formTest",{
		// "tableName":'sssss',
		// "tableComment" : 'sssss'
		// 	});
	}
	function deleteParameter(id) {
		layui.use(['jquery', 'form'], function () {
			const $ = layui.jquery;
			var form = layui.form;
			var formData = form.val("formTest");
			$('#param_' + id.toString()).remove();
			form.val("formTest", formData)
		})
	};
	////////////////////////////////////////////////////////////页面初始化渲染
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
				switch (res[item]["参数名"]) {
					case '时间': $("#时间").attr("checked", "true"); break;
					case '站点': $("#站点").attr("checked", "true"); break;
					case '地区': $("#地区").attr("checked", "true"); break;
					default:
						{
							data["parameterName" + dd] = res[item]["参数名"];
							data["parameterUnit" + dd] = getParameter(res[item]["字段注释"], 'unit');
							data["parameterMemo" + dd] = getParameter(res[item]["字段注释"], 'comment');
							data["parameterType" + dd] = res[item]["数据类型"];
							_addParameter();
							break;
						}
				}

			}
			$("#param_0").html("");

			form.val("formTest", data);

			//data1 = res;
		}
	});
	////////////////////////////////////////////////////////////////////////////////////





});
