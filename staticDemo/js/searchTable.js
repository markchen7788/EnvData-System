var curArea = [];
layui.use(['element', 'jquery', 'laytpl', 'form', 'laypage'], function () {
	var element = layui.element;
	var laypage = layui.laypage;
	const $ = layui.jquery;
	var laytpl = layui.laytpl;
	var form = layui.form;
	var item = {};
	var count = 0;
	var lim = 10;
	form.on('submit(formDemo)', function (data) {
		// alert(data.field.condition + '&&' + getQueryVariable("area"));
		var con=data.field.condition + '&&' + getQueryVariable("area");
		layer.msg("数据库全字段模糊查询,where条件:"+con);
		return false;
	});
	updateCurrentPage(getQueryVariable("area"), "1");
	function updateCurrentPage(con, page) {
		count = 0;
		form.val("queryForm", { "area": getQueryVariable("area") });
		var condition = { "tableName": "col", "condition": con, "order": "创建时间&&DESC" };
		var load = layer.load({ time: 10 * 1000 });
		$.ajax({
			url:'testJsonData/col.json',
			type: 'post',
			data: JSON.stringify(condition),
			dataType: "json",
			contentType: "application/json",
			success: function (res) {
				//console.log(res)
				item = {};
				for (var i = 0; i < res.length; i++) {
					if(res[i].area.indexOf(con)==-1) continue;
					if (!item.hasOwnProperty(res[i].表名)) {
						item[res[i].表名] = {}
						item[res[i].表名]['表名'] = res[i].表名
						item[res[i].表名]['创建时间'] = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(res[i].创建时间))
						item[res[i].表名]['所在区域'] = res[i].area
						item[res[i].表名]['所属站点'] = res[i].siteName
						item[res[i].表名]['表格备注'] = res[i].tableComment
						item[res[i].表名]['监测元素'] = [];
						count++;
					}
					item[res[i].表名]['监测元素'].push(res[i].参数名);
				}



				////////////////////////////////////分页
				laypage.render({
					elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
					, count: count //数据总数，从服务端得到
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
							changePage(obj.curr, obj.limit, item);
						}
					}
				});
				//////////////////////////////////////渲染
				changePage(1, lim, item);
				////////////////////////////////
				layer.close(load);

			}
			//…
		});
	}
	function changePage(curr, limit, item) {
		var temp = {}, i = 0, start = (curr - 1) * limit + 1, end = curr * limit;
		for (var key in item) {
			i++;
			//console.log(i)
			if (i >= start && i <= end && i <= count) {
				temp[key] = item[key];
			}

		}
		////////////////////////////////////渲染
		var getTpl = demo.innerHTML;
		laytpl(getTpl).render(temp, function (html) {
			// document.getElementById('allTable').innerHTML= html;
			$("#allTable").html(html);
			element.render('collapse');

		});
	}




});

