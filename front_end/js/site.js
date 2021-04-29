var currentSize = 2, size = [2, 3, 4, 6, 12], now = [];
var result = [];
layui.use(['element', 'table', 'jquery', 'laytpl', 'laypage'], function () {
	var element = layui.element;
	var table = layui.table;
	const $ = layui.jquery;
	var form = layui.form;
	var laytpl = layui.laytpl;
	var laypage = layui.laypage;
	form.on('submit(formDemo)', function (data) {
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: 'http://' + hostName + '/test/getSiteInfo',
			type: 'post',
			data: data.field,
			success: function (res) {
				changePage(1, 6, res);
				layer.close(load);
			}
		});
		return false;
	});
	form.on('submit(saveSiteInfo)', function (data) {
		var load = layer.load(2, { time: 10 * 1000 });
		$.ajax({
			url: 'http://' + hostName + '/test/addSite',
			type: 'post',
			data: JSON.stringify(data.field),
			dataType: "json",
			contentType: "application/json",
			success: function (res) {
				if (res == true) { layer.msg("添加成功！", { icon: 1 }); location.reload(); }
				else layer.msg("添加失败！", { icon: 5 });
				layer.close(load);
			}
		});
		return false;
	});
	$("#export").click(function()
	{
		//var tpl=[],exp=[];
		delete result[0].md;
		exportToExcel(result);
		// for(var item in result)
		// {
		// 	if(item==0)
		// 	{
		// 		for(var key in result[item])
		// 		{
		// 			tpl.push(key);
		// 		}
		// 	}
		// 	var tmp=[];
		// 		for(var key in result[item])
		// 		{
		// 			tmp.push(result[item][key]);
		// 		}
		// 		exp.push(tmp);
		// }
		// table.exportFile(tpl,exp,'xls');
	});
	var condition = { "condition": "" }
	$.ajax({
		url: 'http://' + hostName + '/test/getSiteInfo',
		type: 'post',
		data: condition,
		async: false,
		success: function (res) {
			console.log(res);
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
					console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
					console.log(obj.limit); //得到每页显示的条数

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

	function changePage(_page, _limit, item) {
		item = item.slice((_page - 1) * _limit, (_page - 1) * _limit + _limit);
		now = item;
		if (item.length > 0) item[0].md = size[currentSize];
		var getTpl = demo.innerHTML;
		laytpl(getTpl).render(item, function (html) {
			$("#card").html(html);
		});
	}

	//…
});
function changeSize() {
	layui.use('jquery', function () {
		const $ = layui.jquery;
		$("#card").children('.layui-col-md' + size[currentSize]).each(function () {

			var text = $(this).attr('class');
			currentSize = size.indexOf(parseInt(text.charAt(12) + text.charAt(13))) + 1;
			currentSize = (currentSize) % size.length;
			console.log(currentSize);
			$(this).attr('class', 'layui-col-md' + size[currentSize]);
		})
		$(".td-height").css("height", 240 / size[currentSize] + "px");
	});
}
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
			content: html //这里content是一个普通的String
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
		layer.confirm('亲亲，删除站点后，站点绑定的表格会产生基本信息丢失，确定要删除这个站点么?', function (index) {
			//do something
			var load = layer.load(2, { time: 10 * 1000 });
			$.ajax({
				url: 'http://' + hostName + '/test/deleteSite',
				type: 'post',
				data: { "siteId": Id },
				success: function (res) {
					console.log(res);

					if (res == true) { layer.msg("删除成功！", { icon: 1 }); location.reload(); }
					else layer.msg("删除失败！", { icon: 5 });
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
			url: 'http://' + hostName + '/test/insert',
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