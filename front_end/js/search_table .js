layui.use(['element', 'jquery', 'laytpl', 'form', 'laypage'], function () {
	var element = layui.element;
	var laypage = layui.laypage;
	const $ = layui.jquery;
	var laytpl = layui.laytpl;
	var form = layui.form;
	var item = {};
	var lim = 3;
	form.on('submit(formDemo)', function (data) {
		updateCurrentPage(data.field.condition, "1")
		return false;
	});
	updateCurrentPage("", "1");
	function updateCurrentPage(con, page) {
		var condition = { "condition": con };
		$.ajax({
			url: 'http://' + hostName + '/test/getTableInfo',
			type: 'post',
			data: condition,
			success: function (res) {
				console.log(res)
				var _count = 0;
				item = {};
				for (var i = 0; i < res.length; i++) {

					if (!item.hasOwnProperty(res[i].表名)) {
						_count++;
						item[res[i].表名] = []
						item[res[i].表名].push(getParameter(res[i].注释, 'tableName'))
						item[res[i].表名].push(dateFormat("YYYY-mm-dd HH:MM:SS", new Date(res[i].创建时间)))
						item[res[i].表名].push(getParameter(res[i].注释, 'comment'))
						item[res[i].表名].push(_count)
					}
					item[res[i].表名].push(getParameter(res[i].字段注释, 'colName'));
				}
				console.log(item)

				laypage.render({
					elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
					, count: _count //数据总数，从服务端得到
					, limit: lim
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
							changePage(obj.curr, obj.limit, item);
						}
					}
				});
				changePage(1, lim, item);
				//$('p').text(JSON.stringify(res))
			}
			//…
		});
	}
	function changePage(_page, _limit, item) {
		item["page"] = _page;
		item["limit"] = _limit;
		var getTpl = demo.innerHTML;
		laytpl(getTpl).render(item, function (html) {
			$("#card").html(html);
		});
	}


});
function deleteTable(Id, _name) {
	layui.use(['jquery'], function () {
		const $ = layui.jquery;
		layer.confirm('亲亲，确定要删除表“' + _name + '”么?', { icon: 3, title: '提示' }, function (index) {
			//do something

			$.ajax({
				url: 'http://' + hostName + '/test/deleteTable',
				type: 'post',
				data: { "tableId": Id },
				success: function (res) {
					console.log(res);
					if (res == true) { layer.msg("删除成功！", { icon: 1 }); location.reload(); }
					else layer.msg("删除失败！", { icon: 5 });
				}
			});
			layer.close(index);
		});
	});
}