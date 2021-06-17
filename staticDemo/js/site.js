//////////测试数据
var site = [
	{
		"Id": "202104220001",
		"siteName": "宝鸡小陈监测站",
		"area": "陕西省-宝鸡市-渭滨区",
		"comment": "宝鸡小陈监测站最棒了！！！是不是？"
	},
	{
		"Id": "202104220002",
		"siteName": "西安小秦监测站",
		"area": "陕西省-西安市-未央区",
		"comment": "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
	},
	{
		"Id": "202104220004",
		"siteName": "铜川耀州区小秦监测站",
		"area": "陕西省-铜川市-耀州区",
		"comment": "哈哈哈哈"
	},
	{
		"Id": "202104220100",
		"siteName": "未央第二监测站",
		"area": "陕西省-西安市-未央区",
		"comment": "陕西省-西安市-未央区2站"
	}
];
////////////////////////////////
var currentSize = 2, size = [2, 3, 4, 6, 12], now = [];
var result = [];
var curArea = [];
var lim = 10;
var condition = { "tableName": "site", "condition": "" };
layui.use(['element', 'table', 'jquery', 'laytpl', 'laypage'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	var laytpl = layui.laytpl;
	var laypage = layui.laypage;
	form.on('submit(formDemo)', function (data) {
		var con = { "tableName": "site", "condition": data.field.area + '&&' + data.field.condition }
		layer.msg("数据库全字段模糊查询,条件:" + JSON.stringify(con));
		return false;
	});
	form.on('submit(saveSiteInfo)', function (data) {
		layer.msg(JSON.stringify(data.field));
		return false;
	});
	$("#export").click(function () {
		delete result[0].md;
		exportToExcel(result);
	});

	////////////////////////预处理
	var index = layer.load({ time: 10 * 1000 });
	form.val("queryForm", { "area": getQueryVariable("area") });
	curArea = getQueryVariable("area").split('-');
	condition = { "tableName": "site", "condition": getQueryVariable("area"), "order": "Id&&ASC" };
	updateCurrentPage(condition);

	//////////////////////////
	function updateCurrentPage(condition) {
		var res = site;
		//console.log(res);
		result = [];
		for (var i in res) if (res[i].area.indexOf(condition.condition) != -1) result.push(res[i]);
		console.log(result);
		layer.close(index);
		laypage.render({
			elem: 'test2' //注意，这里的 test1 是 ID，不用加 # 号
			, count: result.length //数据总数，从服务端得到
			, limit: lim
			, limits: [1, 2, 5, 10, 15, 25, 50]
			, first: '首页'
			, last: '尾页'
			, prev: '上一页'
			, next: '下一页'
			, theme: 'mark'
			, layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
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
		changePage(1, lim, result);


	}
	function changePage(_page, _limit, item) {
		item = item.slice((_page - 1) * _limit, (_page - 1) * _limit + _limit);
		now = item;
		if (item.length > 0) item[0].md = size[currentSize];
		var getTpl = demo.innerHTML;
		laytpl(getTpl).render(item, function (html) {
			$("#card").html(html);
		});
		element.render('collapse');
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
		});
		if (item != -1) form.val("stationInfo", now[item]);
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
			layer.msg("删除站点")
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
		layer.msg(JSON.stringify(data));
	});

}

function chooseAdress(tableName) {

	layui.use(['form', 'jquery', 'layer'], function () {
		var form = layui.form;
		var layer = layui.layer;
		const $ = layui.jquery;
		var adress = adressAll;
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
				curArea = tmp2;
				data.area = tmp2.join("-");
				console.log(data);
				form.val(tableName, data);
				if (tableName == 'queryForm') {
					document.getElementById("submitQuery").click()
				}

				layer.close(index);
			},
			success: function (layero, index) {
				form.render('select');
				if (curArea == "") selectOption('湖北省', '武汉市');
				else {
					switch (curArea.length) {
						case 0:
							selectOption('湖北省', '武汉市');
							break;
						case 1:
							selectOption(curArea[0], getFirstAttr(adress[curArea[0]]));
							break;
						case 2:
							selectOption(curArea[0], curArea[1]);
							var data = form.val('chooseAddr');
							data['area'] = getFirstAttr(adress[curArea[0]][curArea[1]])
							form.val('chooseAddr', data);
							break;
						case 3:
							selectOption(curArea[0], curArea[1]);
							var data = form.val('chooseAddr');
							data['area'] = curArea[2];
							form.val('chooseAddr', data);
							break;
					}
				}
			}
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	});
}

