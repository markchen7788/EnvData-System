var currentSize = 2, size = [2, 3, 4, 6, 12], now = [];
var result = [];
var condition = { "tableName": "site", "condition": "" };
layui.use(['element', 'table', 'jquery', 'laytpl', 'laypage'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	var laytpl = layui.laytpl;
	var laypage = layui.laypage;
	form.on('submit(formDemo)', function (data) {
		updateCurrentPage({ "tableName": "site", "condition": data.field.area + '&&' + data.field.condition });
		return false;
	});
	form.on('submit(saveSiteInfo)', function (data) {

		var load = layer.load(2, { time: 10 * 1000 });
		data.field['tableName'] = 'site';
		if (data.field.Id == -1)//增加
		{
			delete data.field.Id;
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
			});
		}
		return false;
	});
	$("#export").click(function () {
		delete result[0].md;
		exportToExcel(result);
	});
	$.ajax({
		url: hostName + '/test/getUser',
		type: 'get',
		async: false,
		success: function (res) {
			res.area;
			var data = form.val('queryForm');
			data.area = res.area;
			form.val('queryForm', data);
			condition = { "tableName": "site", "condition": data.area + '&&' + data.condition };
		}
		//…
	});
	updateCurrentPage(condition);
	function updateCurrentPage(condition) {
		$.ajax({
			url: hostName + '/test/select',
			type: 'post',
			data: JSON.stringify(condition),
			dataType: "json",
			contentType: "application/json",
			async: false,
			success: function (res) {
				//console.log(res);
				result = res;
				laypage.render({
					elem: 'test2' //注意，这里的 test1 是 ID，不用加 # 号
					, count: result.length //数据总数，从服务端得到
					, limit: 6
					, limits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
					, first: '首页'
					, last: '尾页'
					, prev: '上一页'
					, next: '下一页'
					, theme: 'mark'
					, layout: ['count', 'page', 'prev', 'next', 'limit', 'limits']
					, jump: function (obj, first) {
						//obj包含了当前分页的所有参数，比如：
						// console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
						// console.log(obj.limit); //得到每页显示的条数

						//首次不执行
						if (!first) {
							//do something
							changePage(obj.curr, obj.limit, result);
						}
					}
				});
				//$('p').text(JSON.stringify(res))
				changePage(1, 6, res);

			}
		});
	}
	function changePage(_page, _limit, item) {
		item = item.slice((_page - 1) * _limit, (_page - 1) * _limit + _limit);
		now = item;
		if (item.length > 0) item[0].md = size[currentSize];
		var getTpl = demo.innerHTML;
		laytpl(getTpl).render(item, function (html) {
			$("#card").html(html);
		});
	}

});

function addTable(item) {
	layui.use(['jquery', 'form'], function () {
		const $ = layui.jquery;
		var form = layui.form;

		var html = $("#addTable").html();
		var addLayer = layer.open({
			type: 1,
			title: '站点信息',
			offset: 'auto',
			area: '500px',
			content: html, //这里content是一个普通的String
			cancel: function (index, layero) {
				location.reload();
				return false;
			}
		});
		form.val("stationInfo", now[item]);
		layer.style(addLayer, {
			opacity: 0.9,
		});
	});
}

function deleteTable(Id) {
	layui.use(['jquery', 'form'], function () {
		const $ = layui.jquery;
		layer.confirm('亲亲,确定要删除这个站点么?', function (index) {
			//do something
			var load = layer.load(2, { time: 10 * 1000 });
			$.ajax({
				url: hostName + '/test/select',
				type: 'post',
				data: JSON.stringify({ "tableName": "col", "condition": Id }),
				dataType: "json",
				contentType: "application/json",
				success: function (res) {
					if (res.length > 0) layer.msg("该站点下存在数据表格，不可删除！")
					else {
						$.ajax({
							url: hostName + '/test/delete',
							type: 'post',
							data: JSON.stringify([{ "tableName": "site", "condition": "Id=" + Id }]),
							dataType: "json",
							contentType: "application/json",
							success: function (res) {
								console.log(res);

								if (res == true) { layer.msg("删除成功！", { icon: 1 }); location.reload(); }
								else layer.msg("删除失败！", { icon: 5 });

							}
						});
					}

					layer.close(load);
				}
			});

			layer.close(index);
		});
	});
}

function getXlsxJson(data) {
	for (var item in data) {
		data[item]['tableName'] = 'site';
	}
	//alert(JSON.stringify(data));
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

function chooseAdress(tableName) {
	layui.use(['form', 'jquery', 'layer'], function () {
		var form = layui.form;
		var layer = layui.layer;
		const $ = layui.jquery;
		function getFirstAttr(obj) {
			for (var k in obj) return k;
		}
		function selectOption(selectedProvince, selectedCity) {
			// var proStr = '<option value="" selected></option>', cityStr ='<option value="" selected></option>', areaStr = '<option value="" selected></option>';
			var proStr = '', cityStr = '', areaStr = '';
			var pro = adress[selectedProvince], ci = adress[selectedProvince][selectedCity];
			for (var province in adress) {
				if (province == selectedProvince) proStr += '<option value="' + province + '" selected>' + province + '</option>';
				else proStr += '<option value="' + province + '">' + province + '</option>';
			}
			$("#province").html(proStr);

			for (var city in pro) {
				if (city == selectedCity) cityStr += '<option value="' + city + '" selected>' + city + '</option>';
				else cityStr += '<option value="' + city + '">' + city + '</option>';
			}
			$("#city").html(cityStr);

			for (var area in ci) {
				areaStr += '<option value="' + ci[area] + '">' + ci[area] + '</option>';
			}
			$("#area").html(areaStr);

			form.render();
		}
		form.on('select(province)', function (data) {
			selectOption(data.value, getFirstAttr(adress[data.value]));
		});

		form.on('select(city)', function (data) {
			selectOption($("#province").val(), data.value);
		});

		var addLayer = layer.open({
			title: '请选择地区',
			type: 1,
			offset: 'auto',
			area: ['250px', '400px'],
			content: $("#adress").html(),
			btn: ['确定'],
			yes: function (index, layero) {
				//按钮【按钮一】的回调
				var data = form.val(tableName);
				var tmp = [chooseAddr.province.value, chooseAddr.city.value, chooseAddr.area.value], tmp2 = [];
				for (var i in tmp) {
					if (tmp[i] != "全部")
						tmp2.push(tmp[i]);
				}
				data.area = tmp2.join("-");
				form.val(tableName, data);
				if (tableName == 'queryForm') {
					document.getElementById("submitQuery").click()
				}

				layer.close(index);
			},
			success: function (layero, index) {
				form.render('select');
				selectOption('湖北省', getFirstAttr(adress['湖北省']));
			}
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	});
}
