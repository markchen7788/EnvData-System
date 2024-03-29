var curArea = [];
layui.use(['element', 'jquery', 'laytpl', 'form', 'laypage'], function () {
	var element = layui.element;
	var laypage = layui.laypage;
	const $ = layui.jquery;
	var laytpl = layui.laytpl;
	var form = layui.form;
	var item = {};
	var lim = 2;
	form.on('submit(formDemo)', function (data) {
		updateCurrentPage(data.field.condition + '&&' + data.field.area, "1")
		return false;
	});
	$.ajax({
		url: hostName + '/test/getUser',
		type: 'get',
		success: function (res) {
			res.area;
			var data = form.val('queryForm');
			data.area = res.area;
			curArea = res.area.split('-');
			form.val('queryForm', data);
			updateCurrentPage(data.area, "1");
		}
		//…
	});
	function updateCurrentPage(con, page) {
		var condition = { "tableName": "col", "condition": con };
		var load = layer.load({ time: 10 * 1000 });
		$.ajax({
			url: hostName + '/test/select',
			type: 'post',
			data: JSON.stringify(condition),
			dataType: "json",
			contentType: "application/json",
			success: function (res) {
				// console.log(res)
				var _count = 0;
				item = {};
				var treeItem = {};
				for (var i = 0; i < res.length; i++) {

					if (!item.hasOwnProperty(res[i].表名)) {
						_count++;
						item[res[i].表名] = []
						item[res[i].表名].push(res[i].表名)
						item[res[i].表名].push(dateFormat("YYYY-mm-dd HH:MM:SS", new Date(res[i].创建时间)))
						item[res[i].表名].push(res[i].area)
						item[res[i].表名].push(res[i].siteName)
						item[res[i].表名].push(res[i].comment)
						item[res[i].表名].push(res[i].tableComment)
						item[res[i].表名].push(_count)
					}
					item[res[i].表名].push(res[i].参数名);
					///////////////////////////////////treeItem[res[0]][res[1]][res[2]]=
					var _res = res[i].area.split("-");
					if (treeItem.hasOwnProperty(_res[0])) {
						if (treeItem[_res[0]].hasOwnProperty(_res[1])) {
							if (!treeItem[_res[0]][_res[1]].hasOwnProperty(_res[2])) {
								treeItem[_res[0]][_res[1]][_res[2]] = {};
							}
						}
						else {
							treeItem[_res[0]][_res[1]] = {};
						}
					}
					else {
						treeItem[_res[0]] = {};
					}
					//////////////////////
				}

				////////////////////////////////////

				for(var key in item)
				{
					var area=item[key][2].split("-");
					treeItem[area[0]][area[1]][area[2]][key]=item[key];
				} 
				console.log(treeItem);


				////////////////////////////////////

				// console.log(item)
				layer.close(load);
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
						// console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
						// console.log(obj.limit); //得到每页显示的条数

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


function chooseAdress(tableName) {
	layui.use(['form', 'jquery', 'layer'], function () {
		var form = layui.form;
		var layer = layui.layer;
		const $ = layui.jquery;
		function getFirstAttr(obj) {
			for (var k in obj) return k;
		}
		function selectOption(selectedProvince, selectedCity) {
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
				form.val(tableName, data);
				if (tableName == 'queryForm') {
					document.getElementById("submitQuery").click()
				}

				layer.close(index);
			},
			success: function (layero, index) {
				form.render('select');
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
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	});
}
