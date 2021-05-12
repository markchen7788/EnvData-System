layui.use(['element', 'jquery', 'laytpl', 'form'], function () {
	var element = layui.element;
	const $ = layui.jquery;
	var laytpl = layui.laytpl;
	var form = layui.form;

	form.on('submit(formDemo)', function (data) {
		updateCurrentPage(data.field.condition)
		return false;
	});
	updateCurrentPage("");
	function updateCurrentPage(con) {
		var condition = { "condition": con };
		$.ajax({
			url: 'http://' + hostName + '/test/getTableInfo',
			type: 'post',
			data: condition,
			success: function (res) {
				console.log(res)
				var item = {}
				for (var i in res) {
					if (item.hasOwnProperty(res[i].表名)) {
						item[res[i].表名].push(res[i].参数名);
					}
					else {
						item[res[i].表名] = []
						item[res[i].表名].push(getParameter(res[i].注释, 'tableName'))
						item[res[i].表名].push(dateFormat("YYYY-mm-dd HH:MM:SS", new Date(res[i].创建时间)))
						item[res[i].表名].push(getParameter(res[i].注释, 'comment'))
					}
				}
				console.log(item)
				var getTpl = demo.innerHTML;
				laytpl(getTpl).render(item, function (html) {
					$("#card").html(html);
				});
				//$('p').text(JSON.stringify(res))
			}
			//…
		});
	}
});
