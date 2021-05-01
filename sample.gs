const TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";

//スプレッドシートID
const spreadsheet = SpreadsheetApp.openById("1IUtaffAixePvJ_h5iESsln7ANCXSfDs9asDmTzAL_hQ");

//なか卯のシート
const nakauSheet = spreadsheet.getSheetByName('nakau');
//はま寿司のシート
const hamazushiSheet = spreadsheet.getSheetByName('hamazushi');
//ほっかほっか亭のシート
const hokkateiSheet = spreadsheet.getSheetByName('hokkatei');

//ここが本体部分
function doPost(e) {
  //メッセージが来たか判定して、来てたらテキストに変換して変数に代入する。
  

}
