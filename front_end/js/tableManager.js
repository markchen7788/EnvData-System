RandomBg();
layui.use(['element', 'jquery'], function () {
  var element = layui.element;
  const $ = layui.jquery;

});

function changeWindow(website) {
  layui.use(['element', 'jquery'], function () {
    var element = layui.element;
    const $ = layui.jquery;
    $("#frame").attr("src", website);
  });

}