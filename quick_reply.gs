/*




//LINEアクセストークン  
const TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";

//スプレッドシートID
const spreadsheet = SpreadsheetApp.openById("1IUtaffAixePvJ_h5iESsln7ANCXSfDs9asDmTzAL_hQ");

//なか卯シート(あとでif文の中に突っ込む)
const nakauSheet = spreadsheet.getSheetByName('nakau');

var lastRow = nakauSheet.getLastRow();
for(var i=1;  i<=lastRow;  i++){
      var name = nakauSheet.getRange(i,1).getValues();
      var size = nakauSheet.getRange(i,2).getValues();
      var price = nakauSheet.getRange(i,3).getValues();
      Logger.log(name+":"+size+":"+price);
}


//Logger.log(nku + nku2 + nku3);

//はま寿司シート(あとでif文の中に突っ込む)
const hamazushiSheet = spreadsheet.getSheetByName('hamazushi');

//ほっかほっか亭シート(あとでif文の中に突っ込む)
const hokkateiSheet = spreadsheet.getSheetByName('hokkatei');


function doPost(e) {
    //jsonをパース
    var events = JSON.parse(e.postData.contents).events;
    events.forEach(function (event) {
        //イベントタイプによって振り分け
        if (event.type == "message") {
            reply(event);
        }
    });
}

//イベントタイプがメッセージだった場合
function reply(e) {
  //送られたメッセージを取り出す
  var user_message = e.message.text;
  //メッセージがクイックリプライテストだった場合
  if (user_message == "ごはんメモ") {
    var message = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "text",
        "text": "選択してください。",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "なか卯",
                "text": "Bot>なか卯"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "はま寿司",
                "text": "Bot>はま寿司"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "ほっかほっか亭",
                "text": "Bot>ほっかほっか亭"
              }
            }
          ]
        }
      }]
    };
  }else if (user_message == "Bot>なか卯"){
    const nakauSheet = spreadsheet.getSheetByName('nakau');
    var lastRow = nakauSheet.getLastRow();

    //カルーセルメッセージを入れるための、空の配列
    var columns = [];

    for(var i=1;  i<=lastRow;  i++){
      var name = nakauSheet.getRange(i,1).getValues();
      var size = nakauSheet.getRange(i,2).getValues();
      var price = nakauSheet.getRange(i,3).getValues();

      var column = {
        "title": name,
        "text": size,
        "action": [
          {
            "type": "message",
            "label": "addcount",
            "text": "Bot>add"
          },
          {
            "type": "message",
            "label": "cancel",
            "text": "Bot>Cancel"
          }
        ]
      };

      columns[i] = column;
    }

    var message = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "template",
        "template": {
          "type": "carousel",
          "columns": columns
        }
      }]
    };

  }else if (user_message == "Bot>はま寿司"){



    var message = {
    
      "replyToken": e.replyToken,
      "messages": [{
        "type": "template",
        "altText": "確認テンプレートメッセージ",
        "template": {
          "type": "buttons",
          "text": "ボタンをクリック",
          "actions": [
            {
              "type": "message",
              "label": "Click me",
              "text": "ボタンをクリックしました。"
            }
          ]
        }
      }]
    };




  }else if (user_message == "Bot>ほっかほっか亭"){
    const nakauSheet = spreadsheet.getSheetByName('nakau');
    var lastRow = nakauSheet.getLastRow();

    //カルーセルメッセージを入れるための、空の配列
    var columns = [];

    for(var i=1;  i<=lastRow;  i++){
      var name = nakauSheet.getRange(i,1).getValues();
      var size = nakauSheet.getRange(i,2).getValues();
      var price = nakauSheet.getRange(i,3).getValues();

      var column = {
        "title": name,
        "text": size,
        "actions": [
          {
            "type": "message",
            "label": "基本情報を見る",
            "text": "dataURL"
          },
          {
            "type": "message",
            "label": "地図を見る",
            "text": "mapURL"
          }
        ]
      }

      columns[i] = column;
    }

    var message = {
      "replyToken": e.replyToken,
      "messages": [{
        "type": "template",
        "template": {
          "type": "carousel",
          "columns": columns
        }
      }]
    };

  }
  var replyData = {
      "method": "post",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + TOKEN
      },
      "payload": JSON.stringify(message)
  };
  //★★★送信部分★★★
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", replyData);
}



*/