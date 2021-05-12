var user = {};
RandomBg();
layui.use(['element', 'jquery'], function () {
  var element = layui.element;
  const $ = layui.jquery;
  $.ajax({
    url: hostName + '/test/getUser',
    type: 'get',
    async: false,
    success: function (res) {
      //      console.log(res)
      // configForm.hostName.value = res.hostName;
      // configForm.userName.value = res.userName;
      // configForm.pwd.value = res.pwd;
      // configForm.dbName.value = res.dbName;
      user=res;
      $("#userName").html('<img src="./res/profile.jpeg" class="layui-nav-img">' + res.userName);
    }
    //…
  });



});

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
    console.log(html);
    var addLayer = layer.open({
      type: 1,
      title: '用户信息',
      offset: 'auto',
      area: '500px',
      content: html, //这里content是一个普通的String
      success:function (index, layero) {
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
      var load = layer.load(2, { time: 10 * 1000 });
      data.field.tableName = 'user';
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
        //…
      });

      return false;
    });

  });
}

function logout() {
	layui.use(['element', 'jquery'], function () {
		  var element = layui.element;
		  const $ = layui.jquery;
	 $.ajax({
		    url: hostName + '/logout',
		    type: 'get',
		    async: false,
		    success: function (res) {
		     window.location='/login.html'
		    }
		    //…
		  });
	});
}
function changeWindow(website) {
  layui.use(['element', 'jquery'], function () {
    var element = layui.element;
    const $ = layui.jquery;
    $("#frame").attr("src", website);
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
				selectOption('湖北省', getFirstAttr(adress['湖北省']));
			}
		});
		layer.style(addLayer, {
			opacity: 0.9,
		});
	});
}