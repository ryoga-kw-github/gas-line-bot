var CHANNEL_ACCESS_TOKEN = "Mv5JWhiE/LkQLcyCJiju+WdwGBH8LLkAGsyHWd8PLZDUafkbg3w92Mg99qNwyI+bsc+Y/xManBaVwlTeKS2g0L4E97BwSvW2Yd9Tg6cU327bopYNepG3BoBDwsIG97CbCNuxLyrHG3b7k/QCPEvQuQdB04t89/1O/w1cDnyilFU=";

function doPost(e) {
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  //メッセージを取得
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  var mes = search(user_message);
  if (mes == "null") {//検索結果がなけれな、終了
    return;
  }
  var line_json = [];
  for (i = 0; i < mes[0].length; i++){
    //メニュー作成処理
    var fuck = (
      {
        "thumbnailImageUrl": mes[2][i],
        "title": mes[0][i],
        "text": mes[3][i],
        "actions": [
          {
            "type": "uri",
            "label": "詳細はここだよ（*'ω'*）",
            "uri": mes[1][i]
          }
        ]
      }
    );
    line_json.push(fuck);
  }
  var url = 'https://api.line.me/v2/bot/message/reply';//リプライのurl
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [{       
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
          "type": "carousel",
          "columns": line_json
        }
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
// 材料検索処理
function search(mes){
  //エラー処理
  try{
    var response = UrlFetchApp.fetch("https://cookpad.com/search/" + mes);
  }
  catch(e){
    return "null";
  }
  var title_list = [];
  var url_list = [];
  var img_url_list = [];
  var description_list = [];

  //urlとタイトルが入ってるDOMを取得
  var myRegexp = /<a class=\"recipe-title font13([\s\S]*?)<\/a>/gi;
  var url_and_title = response.getContentText().match(myRegexp);
  if (url_and_title != null) { //検索結果があれば
    number = url_and_title.length; //検索結果数を取得
    if (number >=5) number = 5; //検索結果は上から5個までに   
  }
  else{//なかったら
    return "null";
  }
  for (i = 0; i < number; i++){ //最大5個までurl,title,img_urlを取得
  //url取得
    myRegexp = /href=\"([\s\S]*?)\"/g;
    var url = url_and_title[i].match(myRegexp);
    url = url[0].substr(5);
    url = url.replace(/\"/g,"");
    url = 'https://cookpad.com' + url;
    //Logger.log(url);
    url_list.push(url);
    //タイトル取得
    myRegexp = /\">([\s\S]*?)<\/a>/g;
    var title = url_and_title[i].match(myRegexp);
    title = title[0];
    title = title.substr(2);
    title = title.substr( 0, title.length-4 );
    //Logger.log(title);
    title_list.push(title);
    //imgのurlを取得する正規表現
    //アクセス制限処理
    //var myRegexp2 = /https:\/\/img.cpcdn.com\/recipes\/(\d+)\/100x141c\/([\s\S]*?).jpg/gi;
    //var img_url = response.getContentText().match(myRegexp2);
    //Logger.log(img_url[i]);
    //アクセス制限不要処理
    var response2 = UrlFetchApp.fetch(url);
    var myRegexp2 = /https:\/\/img.cpcdn.com\/recipes\/(\d+)\/m\/([\s\S]*?).jpg/gi;
    var img_url = response2.getContentText().match(myRegexp2);
    img_url_list.push(img_url[0]);
    //投稿者名
    var myRegexp3 = /recipe_author_name([\s\S]*?)<\/a>/gi;
    var description = response2.getContentText().match(myRegexp3);
    var myRegexp4 = />([\s\S]*?)</gi;
    description = description[0].match(myRegexp4);
    description = description[0];
    description = description.substr( 1, description.length - 2 );
    description_list.push("by " + description);
  }
  //情報を返す
  var mes = [];
  mes[0] = title_list;
  mes[1] = url_list;
  mes[2] = img_url_list;
  mes[3] = description_list;
  return mes;  
}