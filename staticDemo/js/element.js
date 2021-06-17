//////////测试数据
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



var colNameJson = { "Id": "Id", "elementName": "元素名", "elementUnit": "元素单位", "dataType": "元素类型", "elementMemo": "备注" }
layui.use(['element', 'table', 'jquery', 'laytpl'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	var laytpl = layui.laytpl;
	var tableCols = {};
	var data1;
	function renderThisPage(json) {


		data1 = elements;


		var col = [[{ type: 'checkbox', fixed: 'left' }]], edi = { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 };
		for (var key in colNameJson) {
			var item = { field: key, title: key, sort: true }
			col[0].push(item)
			tableCols[key] = "";
		}
		col[0].push(edi)
		//console.log(col);

		table.render({
			elem: '#test'
			, data: data1
			, height: 'full'
			, even: 'true'
			, size: 'sm'
			, cellMinWidth: 100 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
			, toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
			, defaultToolbar: ['filter', 'print']
			, cols: col
			, page: { limit: 15, limits: [15, 30, 50, 100, 200, 300] }
		});

	}

	renderThisPage({ "tableName": "element", "condition": "", "order": "Id" });

	form.on('submit(saveElementInfo)', function (data) {
		layer.msg(JSON.stringify(data.field));
		return false;
	});




	table.on('toolbar(test)', function (obj) {
		var checkStatus = table.checkStatus(obj.config.id);
		switch (obj.event) {
			case 'add':
				tableCols.Id = -1;
				addLay(tableCols);
				break;
			case 'import':
				document.getElementById('upload').click();
				break;
			case 'export':
				exportToExcel(data1);
				break;
			case 'multiDelete':
				var data = checkStatus.data;
				var addLayer = layer.open({
					type: 1,
					offset: 'auto',
					area: '500px',
					btn: ['确认'],
					yes: function (index, layero) {
						deleteElement(data);
					},
					content: '  亲亲，真的删除这些行么？', //这里content是一个普通的String
					cancel: function (index, layero) {
						window.location.reload();
					}
				});
				layer.style(addLayer, {
					opacity: 0.9,
				});
				break;
			case 'query':
				var L = layer.prompt({
					formType: 0,
					title: '查询'
				}, function (value, index, elem) {
					var tmp = { "tableName": "element", "condition": value };
					layer.msg("全字段查询，条件：" + JSON.stringify(tmp))
					layer.close(index);
				});
				layer.style(L, {
					opacity: 0.9,
				});
				break;
			case 'reload':
				window.location.reload();
				break;
		};
	});
	table.on('tool(test)', function (obj) {
		var data = obj.data;
		//console.log(obj)
		if (obj.event === 'del') {
			var L = layer.confirm('亲亲，真的删除行么？', function (index) {
				obj.del();
				var tmp = [];
				tmp.push(data);
				deleteElement(tmp);
				layer.close(index);
			});
			layer.style(L, {
				opacity: 0.9,
			});
		} else if (obj.event === 'edit') {
			addLay(data);
		}
	});

	function deleteElement(tmp) {
		layer.msg(JSON.stringify(tmp));
	}
	function addLay(data) {
		var html = demo.innerHTML;
		laytpl(html).render(data, function (res) {
			html = res;
		});
		var addLayer = layer.open({
			type: 1,
			title: '站点信息',
			offset: 'auto',
			area: '500px',
			content: html, //这里content是一个普通的String
			cancel: function (index, layero) {
				window.location.reload();
			}
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	}
	//…
});

function getXlsxJson(data) {
	for (var item in data) {
		data[item]['tableName'] = 'element';
	}
	layui.use(['jquery'], function () {
		layer.msg(JSON.stringify(data));
	});
}