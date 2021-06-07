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

  //送られたテキストデータ(e)を取得してJSONオブジェクト変換して、変数eventsに代入
  const events = JSON.parse(e.postData.contents).events;
  
  //eventsをforEach(配列のFor文)に回して下記のif文を実行する
  events.forEach(function (event) {      
    //イベントタイプによって振り分け
    if (event.type == "message") {
        reply(event);
    }
  });

}

//イベントタイプがメッセージだった時
function reply(e) {
  ////送られたメッセージを取り出して代入
  const user_message = e.message.text;

  //メッセージがクイックリプライテストだった場合
  if (user_message == "ごはんメモ") {
    //送られたメッセージが"ごはんメモ"だった場合
    const message = {
      //ここにjson書く
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
    }
  }else if (user_message == "説明") {
    //送られたメッセージが"説明"だった場合
    const message = {
      //ここにjson書く
      "replyToken": e.replyToken,
      "messages": [{
        "type": "text",
        "text": "「ごはんメモ」と送信するとBotがQuickReplyで機能で選択肢を表示、ぽちぽちしたら品名リストと合計金額を自動算出"
      }]
    }
  }else if (user_message == "なか卯") {
    //送られたメッセージが"なか卯"だった場合

    //Googleスプレッドシートのなか卯シートを参照する
    const nakauSheet = spreadsheet.getSheetByName('nakau');

    ////シートのデータを入力している最終行までの数を取得する
    const lastRow = nakauSheet.getLastRow();

    //Googleスプレッドシートのなか卯シートを参照し、データを入力している最終行まで繰り返しセルのデータを取得する。
    //カルーセルメッセージを入れるための、空の配列
    const columns = [];

    for(var i=1;  i<=lastRow;  i++){
      const name = nakauSheet.getRange(i,1).getValues();
      const size = nakauSheet.getRange(i,2).getValues();
      const price = nakauSheet.getRange(i,3).getValues();

      const column = {
        "title": name,
        "text": size,
        "action": []
      };

      columns[i] = column;
    }


    const message = {
      //ここにjson書く
    }
  }else if (user_message == "はま寿司") {
    //送られたメッセージが"はま寿司"だった場合

    //Googleスプレッドシートのはま寿司シートを参照する
    const hamazushiSheet = spreadsheet.getSheetByName('hamazushi');
    
    ////シートのデータを入力している最終行までの数を取得する
    const lastRow = hamazushiSheet.getLastRow();

    //Googleスプレッドシートのはま寿司シートを参照し、データを入力している最終行まで繰り返しセルのデータを取得する。

    //カルーセルメッセージを入れるための、空の配列
    const columns = [];


    const message = {
      //ここにjson書く
    }
  }else if (user_message == "ほっかほっか亭") {
    //送られたメッセージが"ほっかほっか亭"だった場合

    //Googleスプレッドシートのほっかほっか亭シートを参照する
    const hokkateiSheet = spreadsheet.getSheetByName('hokkatei');
    
    ////シートのデータを入力している最終行までの数を取得する
    const lastRow = hokkateiSheet.getLastRow();

    //Googleスプレッドシートのほっかほっか亭シートを参照し、データを入力している最終行まで繰り返しセルのデータを取得する。

    //カルーセルメッセージを入れるための、空の配列
    const columns = [];



    const message = {
      //ここにjson書く
    }
  }

  //上で作った変数messageと、Botを動かす時に必要な情報を合わせた変数replyDataを作る
  const replyData = {
      "method": "post",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + TOKEN
      },
      "payload": JSON.stringify(message)
  };

  //●実際の送信部分●
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", replyData);

}
