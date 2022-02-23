"use strit"
{
  //DOMの取得
  const typed = document.getElementById("typed");
  const untype = document.getElementById("untype");
  const score = document.getElementById("score");
  const bad = document.getElementById("bad");
  const miss = document.getElementById("miss");
  const time = document.getElementById("time");
  const more = document.getElementById("more");

  //サウンドエフェクト
  const typeSound = new Audio("sound/カタッ(Enterキーを押した音).mp3");
  typeSound.volume = 0.5;
  const resetSound = new Audio("sound/受話器置く03.mp3");
  const badSound = new Audio("sound/クイズ不正解1.mp3");
  badSound.volume = .7;
  const finishSound = new Audio("sound/クイズ正解3.mp3");

  //ミスタイプのキーリスト
  const missType = [];

  let mt;

  //時間関係
  let startTime;
  let isTyping = false;

  //問題集
  const questions = [
    "helloworld",
    "apple",
    "googlechrome",
    "google",
    "facebook",
    "amazon",
    "microsoft",
    "javascript",
    "cascadingstylesheets",
    "hypertextmarkuplanguage",
    "usestrict",
    "document",
    "listener",
    "getelementbyid",
    "textcontent",
    "addeventlistener",
    "current",
    "function",
    "font-family",
    "font-size",
    "justify-content",
    "padding",
    "margin",
    "display",
    "stylesheet",
    "text-align",
    "index.html",
    "main.js",
    "style.css",
    "referenceerror",
    "console",
    "window",
    "github",
    "viewport",
    "charset",
    "header",
    "body",
    "footer",
    "aside",
    "typography",
    "return",
    "true",
    "false",
    "documentobjectmodel",
    "classlist",
    "foreach",
    "new",
    "constructor",
    "this",
    "transition",
    "transform",
    "div",
    "title",
    "math",
    "random",
    "length",

  ];

  //正誤カウント
  let scoreCount =0;
  let badCount = 0;

  //問題のセット
  function q(){
    untype.textContent = questions.splice(Math.floor(Math.random() * questions.length),1)[0];
    typed.textContent = "";
    more.textContent = `Another ${questions.length}`;
  };
  
  //キーボードを叩いたら
  window.addEventListener("keydown",(e)=>{
    if(!isTyping){
      return;
    }
    //untypeの1文字目と一致していたら
    if(e.key === untype.textContent.charAt(0)){
      //untypeから削ってtypedに足す
      typed.textContent += "_";
      untype.textContent = untype.textContent.slice(1);

      //スコアを加点
      scoreCount++;
      score.textContent = scoreCount;

      //タイプ音を鳴らす
      typeSound.currentTime = 0;
      typeSound.play();

      //もしuntypeが無くなったら次の問題へ
      if(untype.textContent.length === 0){
        //問題が無くなったら終了
        if(questions.length === 0){
          typed.textContent = "";
          untype.textContent = "finished!";
          isTyping = false;
          let finishTime = Date.now() - startTime;
          time.textContent = `${(finishTime / 1000).toFixed(2)}seconds!`;
          more.textContent = "";
          finishSound.play();
          return;
        };
        q();
        resetSound.currentTime = 0;
        resetSound.play();
      };

    } else { //ミスタイプした場合
      //ミスタイプに加点
      badCount++;
      bad.textContent = badCount;

      //ブザーを鳴らす
      badSound.currentTime = 0;
      badSound.play();

      //ミスタイプのキーをカウント
      if(miss.textContent.match(e.key)){ //すでにあるなら加点
        mt = missType.find((v) => v.key === e.key).num;
        miss.textContent = miss.textContent.replace(`${e.key}:${mt}`,`${e.key}:${mt + 1}`);
        missType.find((v) => v.key === e.key).num++;
      } else { //初めてのカウント
        missType.push({
          key:e.key,
          num:1,
        });
        miss.textContent += `${missType[missType.length - 1].key}:${missType[missType.length - 1].num}  `;
      };
    };
  });

  //始めの問題をセット
  window.addEventListener("keydown",(e)=>{
    if(isTyping){
      return;
    };
    if(!(e.key === " " || e.key === "Enter")){
      return;
    };
    q();
    startTime = Date.now();
    isTyping = true;
  });

}