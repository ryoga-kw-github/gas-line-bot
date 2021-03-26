//LINE Messaging APIのチャネルアクセストークン
var LINE_ACCESS_TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";

//スプレッドシートID
var ss = SpreadsheetApp.openById("1IUtaffAixePvJ_h5iESsln7ANCXSfDs9asDmTzAL_hQ");

//シート名
var sh = ss.getSheetByName("reply1");


//LINE Messaging APIからPOST送信を受けたときに起動する
// e はJSON文字列
function doPost(e){
  if (typeof e === "undefined"){
    //動作を終了する
    return;
  } else {
    //JSON文字列をパース(解析)し、変数jsonに格納する
    var json = JSON.parse(e.postData.contents);

    //変数jsonを関数replyFromSheetに渡し、replyFromSheetを実行する
    replyFromSheet(json)
  }
}
 
//返信用の関数replyFromSheet
// data には変数jsonが代入される
function replyFromSheet(data) {
  //返信先URL
  var replyUrl = "https://api.line.me/v2/bot/message/reply";
   
  //シートの最終行を取得する
  var lastRow = sh.getLastRow();
   
  //シートの全受信語句と返信語句を二次元配列で取得する
  var wordList = sh.getRange(1,1,lastRow,2).getValues();
   
  //受信したメッセージ情報を変数に格納する
  var reply_token　= data.events[0].replyToken; //reply token
  var text = data.events[0].message.text; //ユーザーが送信した語句
 
  //返信語句を格納するための空配列を宣言する
  var replyTextList = [];
  
  //LINEで受信した語句がシートの受信語句と同じ場合、返信語句をreplyTextにpushする
  for(var i = 1; i < wordList.length; i++) {
    if(wordList[i][0] == text) {
    　replyTextList.push(wordList[i][1]);
    }
  }
  

  //LINEで受信した語句がシートの受信語句と一致しない場合、関数を終了する
  if(replyTextList.length < 1) {
    return;
    
  //replyTextListのLengthが5より大きい場合、messageLengthを5にする
  //※※一度に最大5つの吹き出ししか返信できないためです※※
  } else if(replyTextList.length > 5) {
    var messageLength = 5;
  } else {
    var messageLength = replyTextList.length;
  }
  
  //"messages"に渡す配列を格納するための空配列を宣言する
  //[{"type": "text", "text": "返信語句その1"},{"type": "text", "text": "返信語句その2"}....]
  var messageArray = [];
  
  //replyTextListに格納されている返信語句を最大5つ、messageArrayにpushする
  for(var j = 0; j < messageLength; j++) {
    messageArray.push({"type": "text", "text": replyTextList[j]});
  }
  
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + LINE_ACCESS_TOKEN,
  };
  
  var postData = {
    "replyToken": reply_token,
    "messages": messageArray
  };

  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };
    
  //LINE Messaging APIにデータを送信する
  UrlFetchApp.fetch(replyUrl, options);
}