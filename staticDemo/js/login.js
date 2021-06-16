RandomBg();
layui.use("element", function () {
  document.getElementById("timeNow").innerHTML = "&nbsp;" + new Date();
  var element = layui.element;
});

$(".card.alt .toggle ").on("click", function () {
  // $("#formContent").html($("#form1").html());
  $(".container").stop().addClass("active");
});
$(".close").on("click", function () {
  $(".container").stop().removeClass("active");
});

$("#login").click(function () {

  window.location = "./index.html";

});


function chooseAdress() {
  layui.use(['form', 'jquery', 'layer'], function () {
    var form = layui.form;
    var layer = layui.layer;
    //  const $ = layui.jquery;
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

        var tmp = [chooseAddr.province.value, chooseAddr.city.value, chooseAddr.area.value], tmp2 = [];
        for (var i in tmp) {
          if (tmp[i] != "全部")
            tmp2.push(tmp[i]);
        }

        registry.district.value = tmp2.join("-");
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

function addUser() {
  //alert('sss');
  var data = [{ "userName": registry.userName.value, "pwd": registry.pwd.value, "area": registry.district.value }];
  alert(JSON.stringify(data));
}


function personInfo() {
  layui.use("layer", function () {
    //document.getElementById("")
    layer.open({
      title: '开发者信息',
      type: 1,
      content: document.getElementById("personInfo").innerHTML
    });
  })
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