var CHANNEL_ACCESS_TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";

function doPost(e) {
  var contents = e.postData.contents;
  var obj = JSON.parse(contents);
  var events = obj["events"];
  for (var i = 0; i < events.length; i++) {

    //if (events[i].type == "message") {
    //  reply_message(events[i]);
    //}

    switch (events[i].type) {
      case "message":
        reply_message(events[i]);
        break;
    }

  }
}

function reply_message(e) {
  //＠＠ここから↓＠＠
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents":
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "md",
          "contents": [

            {
              "type": "text",
              "text": "hello"
            },

            {
              "type": "button",
              "style": "primary",
              "action": {
                "type": "uri",
                "label": "Primary style button",
                "uri": "https://example.com"
              }
            }

          ]
        }
      }
    }]
  };
  //＠＠ここがメッセージの設定↑＠＠
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload": JSON.stringify(postData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}