document.write("<script language=javascript src='./js/xlsx.core.min.js'></script>");
var excelData;
function change(obj, callback) {
    if (!obj.files) {
        return;
    }
    var file = obj.files[0];
    var reader = new FileReader();
    var json;
    reader.onload = function (e) {
        var data = e.target.result;
        excelData = XLSX.read(data, {
            type: 'binary'
        });
        json = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
        callback(json);
    };
    reader.readAsBinaryString(file);
}
