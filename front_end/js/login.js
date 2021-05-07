RandomBg();
$(".card.alt .toggle ").on("click", function () {
  // $("#formContent").html($("#form1").html());
  $(".container").stop().addClass("active");
});
$(".close").on("click", function () {
  $(".container").stop().removeClass("active");
});
$("#login").click(function () {

  $.ajax({
    url: 'http://' + hostName + '/doLogin',
    type: 'post',
    data: { "userName": loginForm.userName.value, "pwd": loginForm.pwd.value },
    async: false,
    success: function (res) {
      if (res == true) {
        alert("登陆成功！");
        window.location="/"
      }
      else alert("登陆失败！")
    }
    //…
  });

});

$("#registry").click(function () {
  $("#formContent").html($("#form1").html());
});

$("#config").click(function () {
  $("#formContent").html($("#form2").html());
  $.ajax({
    url: 'http://' + hostName + '/test/getConfig',
    type: 'get',
    async: false,
    success: function (res) {
      console.log(res)
      configForm.hostName.value = res.hostName;
      configForm.userName.value = res.userName;
      configForm.pwd.value = res.pwd;
      configForm.dbName.value = res.dbName;
    }
    //…
  });
});

function saveConfig() {
  var data = {};
  data['hostName'] = configForm.hostName.value;
  data['userName'] = configForm.userName.value;
  data['pwd'] = configForm.pwd.value;
  data['dbName'] = configForm.dbName.value;
  $.ajax({
    url: 'http://' + hostName + '/test/config',
    type: 'post',
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    async: false,
    success: function (res) {
      if (res == true) alert("成功配置数据库！")
      else alert("配置失败！")
      location.reload();
    }
    //…
  });
  location.reload();
};

