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
var elements = [
	{
		"Id": "195",
		"elementName": "Sample ID",
		"elementUnit": "",
		"dataType": "VARCHAR(100)",
		"elementMemo": "样本Id"
	},
	{
		"Id": "197",
		"elementName": "时间",
		"elementUnit": "",
		"dataType": "VARCHAR(100)",
		"elementMemo": "时间"
	},
	{
		"Id": "198",
		"elementName": "SO₄²ˉ",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "硫酸根离子"
	},
	{
		"Id": "199",
		"elementName": "NO₃ˉ",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "硝酸根离子"
	},
	{
		"Id": "200",
		"elementName": "NH₄ˉ",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "氨离子"
	},
	{
		"Id": "201",
		"elementName": "Clˉ",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "氯离子"
	},
	{
		"Id": "202",
		"elementName": "BC",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "BC"
	},
	{
		"Id": "203",
		"elementName": "Metal",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "金属"
	},
	{
		"Id": "204",
		"elementName": "PM₂.₅",
		"elementUnit": "μg/m3",
		"dataType": "DOUBLE",
		"elementMemo": "PM₂.₅微粒"
	},
	{
		"Id": "206",
		"elementName": "WIN_D",
		"elementUnit": "",
		"dataType": "DOUBLE",
		"elementMemo": "风向"
	},
	{
		"Id": "207",
		"elementName": "WIN_S",
		"elementUnit": "",
		"dataType": "DOUBLE",
		"elementMemo": "风速"
	},
	{
		"Id": "208",
		"elementName": "RHU",
		"elementUnit": "%",
		"dataType": "DOUBLE",
		"elementMemo": "相对湿度"
	},
	{
		"Id": "209",
		"elementName": "TEM",
		"elementUnit": "℃",
		"dataType": "DOUBLE",
		"elementMemo": "温度"
	},
	{
		"Id": "210",
		"elementName": "PRS",
		"elementUnit": "Pa",
		"dataType": "DOUBLE",
		"elementMemo": "气压"
	},
	{
		"Id": "211",
		"elementName": "PM10",
		"elementUnit": "μg/m3",
		"dataType": "DOUBLE",
		"elementMemo": "PM10微粒"
	},
	{
		"Id": "212",
		"elementName": "SO2",
		"elementUnit": "μg/m3",
		"dataType": "DOUBLE",
		"elementMemo": "二氧化硫"
	},
	{
		"Id": "213",
		"elementName": "NO2",
		"elementUnit": "μg/m3",
		"dataType": "DOUBLE",
		"elementMemo": "二氧化氮"
	},
	{
		"Id": "214",
		"elementName": "CO",
		"elementUnit": "μg/m3",
		"dataType": "DOUBLE",
		"elementMemo": "一氧化碳"
	},
	{
		"Id": "215",
		"elementName": "O3",
		"elementUnit": "μg/m3",
		"dataType": "DOUBLE",
		"elementMemo": "臭氧"
	},
	{
		"Id": "216",
		"elementName": "AQI",
		"elementUnit": "",
		"dataType": "DOUBLE",
		"elementMemo": "空气质量指数，比值无单位"
	},
	{
		"Id": "217",
		"elementName": "Na+",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "钠离子"
	},
	{
		"Id": "218",
		"elementName": "K+",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "钾离子"
	},
	{
		"Id": "219",
		"elementName": "Mg2+",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "镁离子"
	},
	{
		"Id": "220",
		"elementName": "Ca2+",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "钙离子"
	},
	{
		"Id": "221",
		"elementName": "NO2-",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "亚硝酸根离子"
	},
	{
		"Id": "222",
		"elementName": "F-",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "氟离子"
	},
	{
		"Id": "238",
		"elementName": "TC",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "TC"
	},
	{
		"Id": "239",
		"elementName": "OC",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "OC"
	},
	{
		"Id": "240",
		"elementName": "EC",
		"elementUnit": "ug/cm2",
		"dataType": "DOUBLE",
		"elementMemo": "EC"
	},
	{
		"Id": "241",
		"elementName": "11",
		"elementUnit": "11",
		"dataType": "11",
		"elementMemo": "11"
	}
];
/////////////////////////////////////

var curTableName = "site", ele = [];
layui.use(['element', 'table', 'jquery'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	form.on('submit(formDemo)', function (data) {
		layer.msg("全字段模糊查询：" + JSON.stringify(data.field));
		return false;
	});
	//updataForm("")
	function updataForm(condition) {
		if (curTableName == 'site') condition += "&&" + getQueryVariable("area");


		var res;
		if (curTableName == "site") res = site;
		else res = elements;
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
		layer.msg("后端根据页面中填写和选择的信息拼接SQL建表语句并提交数据库执行！")
		return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	});
	//…
});
