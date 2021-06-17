//////////////测试数据
var getConfig = { "netDisk": "https://markchen7788.github.io/a-simple-php-network-disk-/staticDemo/", "hostName": "localhost:3308", "dbName": "envdata", "userName": "root", "pwd": "123456" };
var getUser = { "userName": "admin", "pwd": "admin", "area": "陕西省" };
var getArea = [{ "area": "陕西省-宝鸡市-渭滨区" }, { "area": "陕西省-西安市-未央区" }, { "area": "陕西省-铜川市-耀州区" }];

////////////////////////////
var user = {};
var tableOrStation = "./searchTable.html";

RandomBg();
//document.getElementById("layuiBody").style.height=document.body.style.height-44;
layui.use(['element', 'jquery', 'form'], function () {
	var element = layui.element;
	var form = layui.form;
	const $ = layui.jquery;
	var laytpl = layui.laytpl;
	$("#timeNow").html(new Date() + "&nbsp;&nbsp;&nbsp;");

	var res = getUser;
	user = res;
	$("#userName").html('<img src="../code/Mark/src/main/resources/static/res/profile.jpeg" class="layui-nav-img">' + res.userName);
	changeWindow(res.area, 0);//一进入首页就显示所有能够查看到的表格
	renderSideNav(res.area, "col");
	if (res.userName == 'admin') $("#settings").html('<dd><a href="javascript:settings()"><i class="layui-icon layui-icon-set"></i>&nbsp;系统设置</a></dd>');


	res = getConfig;
	$("#netDisk").attr("href", res.netDisk);



	form.on('submit(formDemo)', function (data) {
		layer.msg(JSON.stringify(data.field));
		$("#netDisk").attr("href",data.field.netDisk);
		return false;
	});


});

//////////////////////////////////////根据用户所在区域和表名刷新左侧导航栏
function renderSideNav(area, tableName) {
	layui.use(['element', 'jquery', 'form'], function () {
		var element = layui.element;
		var form = layui.form;
		const $ = layui.jquery;
		var laytpl = layui.laytpl;

		var res = getArea;
		var treeItem = {};
		for (var i in res) {
			var _res = res[i].area.split("-");
			if (!treeItem.hasOwnProperty(_res[0]))
				treeItem[_res[0]] = {};
			if (!treeItem[_res[0]].hasOwnProperty(_res[1]))
				treeItem[_res[0]][_res[1]] = {};
			if (!treeItem[_res[0]][_res[1]].hasOwnProperty(_res[2]))
				treeItem[_res[0]][_res[1]][_res[2]] = res[i].area;

		}
		// layer.msg(JSON.stringify(treeItem));
		var getTpl = $("#navDemo").html();
		laytpl(getTpl).render(treeItem, function (html) {
			// document.getElementById('allTable').innerHTML= html;
			$("#myNav").html(html);
			element.render('nav');

		});

		//if (res.length > 0) changeWindow("searchTable.html?area=" + res[0].area,0);//一进入首页就显示第一个行政区能够查看到的表格


	});
}




function addLay() {
	layui.use(['element', 'jquery', 'laytpl', 'form', 'table'], function () {
		var element = layui.element;
		var table = layui.table;
		const $ = layui.jquery;
		var form = layui.form;
		var laytpl = layui.laytpl;
		var html = demo.innerHTML;
		laytpl(html).render(user, function (res) {
			html = res;
		});
		var addLayer = layer.open({
			type: 1,
			title: '用户信息',
			offset: 'auto',
			area: '500px',
			content: html, //这里content是一个普通的String
			success: function (index, layero) {
				form.render();
			},
			cancel: function (index, layero) {
				window.location.reload();
			}
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});

		form.on('submit(saveElementInfo)', function (data) {
			layer.msg(JSON.stringify(data.field));
			return false;
		});

	});
}

function logout() {
	layui.use(['element', 'jquery'], function () {
		var element = layui.element;
		const $ = layui.jquery;
		window.location = './login.html'
	});
}
function changeToStation() {
	tableOrStation = "./site.html";
	renderSideNav(user.area, "site");
	changeWindow(user.area, 0);
}

function changeWindow(website, choice) {
	layui.use(['element', 'jquery'], function () {
		var element = layui.element;
		const $ = layui.jquery;
		switch (choice) {
			case 0:
				$("#frame").attr("src", tableOrStation + '?area=' + website);
				break;
			case 1:
				$("#myNav").html($("#navDemo2").html());
				$("#frame").attr("src", website);
				break;
			case 2:
				$("#myNav").html($("#navDemo2").html());
				$("#frame").attr("src", website + "?area=" + user.area);
				break;
			default:
				$("#frame").attr("src", website);
				break;
		}
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
				layer.close(index);
			},
			success: function (layero, index) {
				form.render('select');
				var curArea = form.val(tableName).area.split("-");
				//console.log(curArea)
				if (curArea == "") selectOption('全部', '全部');
				else {
					switch (curArea.length) {
						case 0:
							selectOption('全部', '全部');
							break;
						case 1:
							selectOption(curArea[0], '全部');
							break;
						case 2:
							selectOption(curArea[0], curArea[1]);
							var data = form.val('chooseAddr');
							data['area'] = '全部'
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

function settings() {
	layui.use(['form', 'jquery', 'layer'], function () {
		var form = layui.form;
		const $ = layui.jquery;
		var res = getConfig;
		layer.open({
			type: 1,
			title: '请配置系统数据库和云盘地址',
			offset: 'auto',
			area: ['500px', '600px'],
			shadeClose: true,
			shade: 0, //遮罩透明度
			content: $('#configForm').html(), //这里content是一个普通的String
			success: function () { form.val("configForm", res); form.render('select'); form.render('checkbox'); },
			cancel: function (index, layero) {
				//window.location.reload();
			}
		});
	});

}

function Introduction() {
	layui.use("layer", function () {
		//document.getElementById("")
		layer.open({
			title: "产品说明",
			type: 2,
			area: ["550px", "630px"],
			content: './Introduction.html' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
		});
	})
}