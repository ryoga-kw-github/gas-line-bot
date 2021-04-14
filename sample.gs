function doPost(event) {

  //ApiTokenと返信用のURLを設定
  const TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";
  
  const reply = "https://api.line.me/v2/bot/message/reply";

  //投稿を取得
  var json = JSON.parse(event.postData.contents);
  var replyToken = json.events[0].replyToken;
  var userMessage = json.events[0].message.text;
  var type = json.events[0].message.type;

  //投稿タイプを判定
  if(type==='location'){

    //緯度経度を取得
    var lat = json.events[0].message.latitude;
    var lng = json.events[0].message.longitude;

    //緯度経度からカルーセルテンプレートのメッセージを作成
    var payload = carousel(lat, lng, replyToken);

    if(payload==='該当なし'){

      //該当なしなら以下のメッセージを送信  
      var botMessage = '指定の条件に該当するお店は見つかりませんでした。';
      var payload = JSON.stringify({
          "replyToken": replyToken,
          "messages": [{
            "type": "text",
            "text": botMessage
          }]
      });
      UrlFetchApp.fetch(reply, {
            "headers": {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + TOKEN,
          },
          "method": "post",
          "payload": payload
      });

    }else{

      //作成されたテンプレートメッセージ送信
      UrlFetchApp.fetch(reply, {
            "headers": {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + TOKEN,
          },
          "method": "post",
          "payload": payload
      });
    }

  }else{

    //投稿タイプが位置情報でなければ位置情報を求めるボタンテンプレートを送信
    var botMessage = '位置情報を送ってね。\n近くの始発までやってるレストランを調べるよ^^)b';
    var payload = JSON.stringify({
        "replyToken": replyToken,
        "messages": [{
          "type": "template",
          "altText": "This is a buttons template",
          "template": {
              "type": "buttons",
              "text": botMessage,
              "actions": [
                  {
                    "type": "uri",
                    "label": "位置情報を送る",
                    "uri": "https://line.me/R/nv/location/"
                  }
              ]
          }
        }]
    });
    UrlFetchApp.fetch(reply, {
          "headers": {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + TOKEN,
        },
        "method": "post",
        "payload": payload
    });
  }
}


function carousel(lat, lng, replyToken) {

  //食べログ「500m圏内＆始発まで営業（画像あり）」の絞り込み検索URLを生成 ソースを取得 ※１
  var searchURL = 'http://m.tabelog.com/mobile_gps/RC////A/0/6/l/rstlstgps/?narrow=1&RdoCosTp=2&LstCos=0&LstCosT=0&lat=' + lat + '&lon=' + lng + '&SrtT=trend&LstSitu=&sw=&img_on=1';
  var data = UrlFetchApp.fetch(searchURL).getContentText();

  //ライブラリ「TextPicker」にソースを渡す ※２
  TextPicker.open(data);

  //該当するお店がない場合
  if(TextPicker.pickUp('指定の条件に','見つかりませんでした')==='該当するお店は'){
    return '該当なし';
  }

  //ヒット件数取得
  var num = TextPicker.pickUp('</span>/全','件');
  num = Number(num);
  if(num>10){num=10;} //※３

  //カルーセルテンプレートのカラムを格納する配列を宣言
  var columns = [];

  TextPicker.skipTo('</span>/全');

  //件数分の繰り返し
  for(var i=0; i<num; i++){

    var URL = TextPicker.pickUp('http://m.tabelog.com/','">');
    TextPicker.skipTo(URL);

    //クーポンページと中間リンクをコンティニュー
    if(URL.slice(-5)==='="red'){i--; continue;}
    if(URL==='billing_mobile/register_mymenu?msgid=6'){i--; continue;}

    //必要情報の取得
    var title = TextPicker.pickUp('">','</a>');                  //店舗名
    var thumbnailHead = TextPicker.pickUp('<img src="','50x50'); //サムネイルURL前半
    var thumbnailFoot = TextPicker.pickUp('50x50','" ');         //サムネイルURL後半
    TextPicker.skipTo('style="color:#666666;">(');
    var cuisine = TextPicker.pickUp('/',')</span>');             //ジャンル
    TextPicker.skipTo(';"');
    var blStar = TextPicker.pickUp('>','</span>');               //★★★ ※４
    var whStar = TextPicker.pickUp(';">','</span>');             //☆☆☆
    var rating = TextPicker.pickUp('color:#ff0000;">','</span>');//点数
    var price = TextPicker.pickUp('夜:','<br />');                //夜の価格帯
    var distance = TextPicker.pickUp('現在地から','</span>');      //位置情報からの距離

    //トップページ 基本情報 地図ページのURLを作成
    var shopURL = 'http://m.tabelog.com/' + URL;
    var dataURL = shopURL + '#rstdtl_data_info';
    var mapURL = shopURL + 'dtlmap/';

    //サムネイルのURLを作成
    var thumbnailURL = thumbnailHead + '150x150' + thumbnailFoot; //※５

    //タイトル カラム用のテキストを作成
    title = title.substr(0, 33) + '(' + distance + ')'; //※６
    var price = '\n夜価格帯:' + price;
    var replaceWord = /\\/g;
    price = price.replace(replaceWord, "￥"); //※７
    var text = cuisine.substr(0, 28) + '\n' + blStar + whStar + rating + price; //※８

    //カラム作成
    var column = {
                    "thumbnailImageUrl": thumbnailURL,
                    "imageBackgroundColor": "#FFFFFF",
                    "title": title,
                    "text": text,
                    "defaultAction": {
                        "type": "uri",
                        "label": "View detail",
                        "uri": shopURL
                    },
                    "actions": [
                        {
                            "type": "uri",
                            "label": "基本情報を見る",
                            "uri": dataURL
                        },
                        {
                            "type": "uri",
                            "label": "地図を見る",
                            "uri": mapURL
                        }
                    ]
                  }

    //カラムを配列に格納
    columns[i] = column;
  }

  //作成したカラムを元にメッセージを作成
  var payload = JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
            "type": "carousel",
            "columns": columns,
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
      }]
  });

  return payload;
}

//※１：{/RC////A/0/6/l/}部分 Aなら500ｍ範囲 Bなら1km範囲になる
//※２：プロジェクトID「Ms1_ywyxDUyXZlf1HE1E2_ydpxDUCDjPE」
//※３：カルーセルテンプレートのカラムは最大10個まで 検索結果が10より多い場合は10に丸める
//※４：☆はレートによって色が変わるためカラーコード部分は目印にならない
//※５：ソースページの画像は 50×50 なので 150x150 に書き換える
//※６：titleは最大40文字 (0000m) の7文字分を残して店名を33文字までに制限
//※７：半角￥が \ になるので全角￥に置き換え
//※８：textは最大60文字 他の部分を残してジャンル名を28文字までに制限
