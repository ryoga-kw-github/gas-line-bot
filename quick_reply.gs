  const TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";

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
  //メッセージとuserIdを取り出す
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
  }
  var replyData = {
      "method": "post",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + TOKEN
      },
      "payload": JSON.stringify(message)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", replyData);
}