function doPost(event) {

  //１．ApiTokenとメッセージ送信用のHTTPリクエストを設定
  const TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";

  const reply = "https://api.line.me/v2/bot/message/reply";

  //２．受け取ったメッセージから返信用のTokenを取得
  var json = JSON.parse(event.postData.contents);
  var replyToken = json.events[0].replyToken;

  //３．メッセージタイプと内容を記述
  var payload = JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
          "type": "text",
          "text": "選択してください",
          "quickReply": {
              "items": [
                  {
                      "type": "action",
                      "action": {
                          "type": "camera",
                          "label": "カメラ"
                      }
                  },
                  {
                      "type": "action",
                      "action": {
                          "type": "cameraRoll",
                          "label": "カメラロール"
                      }
                  },
                  {
                      "type": "action",
                      "action": {
                          "type": "location",
                          "label": "位置情報"
                      }
                  },
                  {
                      "type": "action",
                      "action": {
                          "type": "postback",
                          "label": "ポストバック",
                          "data": "test"
                      }
                  },
                  {
                      "type": "action",
                      "action": {
                          "type": "message",
                          "label": "メッセージ",
                          "text": "test"
                      }
                  },
                  {
                      "type": "action",
                      "action": {
                          "type": "datetimepicker",
                          "label": "日時選択",
                          "data": "datetime",
                          "mode": "datetime"
                      }
                  }
              ]
          }
      }]
  });

  //４．送信
  UrlFetchApp.fetch(reply, {
      "headers": {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + TOKEN,
      },
      "method": "post",
      "payload": payload
  });
}