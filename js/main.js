"use strit"
{
  //Web Font Loader
  window.WebFontConfig = {
    google: { families: ['Ibarra+Real+Nova','Monofett','Xanh+Mono'] },
    active: function() {
      sessionStorage.fonts = true;
    }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

  //DOMの取得
  const typed = document.getElementById("typed");
  const untype = document.getElementById("untype");
  const score = document.getElementById("score");
  const bad = document.getElementById("bad");
  const miss = document.getElementById("miss");
  const more = document.getElementById("more");
  const accuracy = document.getElementById("accuracy"); 
  const ar = document.getElementById("ar");
  const main = document.getElementById("main");
  const hambarger = document.getElementById("hambarger");
  const overlay = document.getElementById("overlay");
  const close = document.getElementById("close");
  const restart = document.getElementById("restart");
  const timer = document.getElementById("timer");

  //サウンドエフェクト
  const typeSound = new Audio("sound/カタッ(Enterキーを押した音).mp3");
  typeSound.volume = 0.5;
  const resetSound = new Audio("sound/受話器置く03.mp3");
  const badSound = new Audio("sound/パッ.mp3");
  badSound.volume = .9;
  const finishSound = new Audio("sound/クイズ正解3.mp3");

  //ミスタイプのキーリスト
  const missType = [];

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

  //出題数(文字数)
  const questionLength = 350;

  //正誤カウント
  let scoreCount = 0;
  let badCount = 0;
  let accuracyRate;

  //問題のセット
  function q(){
    untype.textContent = questions.splice(Math.floor(Math.random() * questions.length),1)[0];
    typed.textContent = "";
    more.textContent = `another ${questions.length}`;
    timerSet(untype.textContent.length);
  };

  //時間制限
  function timerSet(time){
    const timerChild = document.createElement("div");
    timerChild.classList.add("timer");
    timerChild.style.width = `${time * 20}px`;
    timer.appendChild(timerChild);
    timerChild.style.animation = `timerBifore .27s linear 0s alternate forwards,timerAfter ${time * 0.45 + 1}s linear .4s`;
    setTimeout(()=>{
      timerChild.addEventListener("animationend",()=>{
        timer.removeChild(timer.firstChild);
        if(untype.textContent.length === 0){
          return;
        }
        //出題数に達していて、現在の問題を打ち終わったら終了
        if((scoreCount >= questionLength) && (untype.textContent.length === 0)){
          finish();
          return;
        };
        //問題が底をついたら終了
        if(questions.length === 0){
          finish();
          return;
        };
        q();
        badSound.currentTime = 0;
        badSound.play();
      });
    },500);
  };

  //パーセンテージの表示
  function rate(){
    let accuracyRate = (scoreCount / (scoreCount + badCount) * 100).toFixed(2);
    accuracy.textContent = accuracyRate;
    ar.classList.remove("safe","caution","dead");
    if(accuracyRate >= 95){
      ar.classList.add("safe");
    } else if(accuracyRate >= 80){
      ar.classList.add("caution");
    } else {
      ar.classList.add("dead");
    };
  };
  
  //終了
  function finish(){
    typed.textContent = "";
    untype.textContent = "finished!";
    untype.classList.add("flash");
    isTyping = false;
    more.textContent = "";
    finishSound.currentTime = 0;
    finishSound.play();
    restart.classList.add("show");
    let finishTime = Date.now() - startTime;
    more.textContent = `${(finishTime / 1000).toFixed(2)}seconds`;
  };

  //ミスしたキーのバルーンを作成
  function missBaloon(key){
    let balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.id = `${key}`;
    balloon.style.top = `${Math.random() * 100}%`;
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.textContent = `${key}`;
    main.appendChild(balloon);
  };

  //ハンバーガーメニュー
  hambarger.addEventListener("click",()=>{
    overlay.classList.add("show");
    hambarger.classList.add("hidden");
  });
  close.addEventListener("click",()=>{
    overlay.classList.remove("show");
    hambarger.classList.remove("hidden");
  });
  
  //キーボードを叩いたら
  window.addEventListener("keydown",(e)=>{
    if(!isTyping){
      return;
    };
    //ハンバーガーメニューを開いていたらリターン
    if(overlay.className === "show"){
      return;
    };
    //untypeの1文字目と一致していたら
    if(e.key === untype.textContent.charAt(0)){
      //untypeから削ってtypedに足す
      typed.textContent += "_";
      untype.textContent = untype.textContent.slice(1);

      //スコアを加点
      scoreCount++;
      score.textContent = scoreCount;
      rate();
      //文字を跳ねさせる
      score.classList.add("pyon");
      score.addEventListener("animationend",()=>{
        score.classList.remove("pyon");
      });

      //タイプ音を鳴らす
      typeSound.currentTime = 0;
      typeSound.play();

      //もしuntypeが無くなったら次の問題へ
      if(untype.textContent.length === 0){
        timer.removeChild(timer.firstChild);
        //出題数に達したら終了
        if(scoreCount > questionLength){
          finish();
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
      rate();
      //文字を跳ねさせる
      bad.classList.add("pyon");
      bad.addEventListener("animationend",()=>{
        bad.classList.remove("pyon");
      });

      //ブザーを鳴らす
      badSound.currentTime = 0;
      badSound.play();

      //ミスタイプのキーをカウント
      if(miss.textContent.match(e.key)){ //すでにあるなら加点
        let mt = missType.find((v) => v.key === e.key).num;

        miss.textContent = miss.textContent.replace(`${e.key}:${mt}`,`${e.key}:${mt + 1}`);
        missType.find((v) => v.key === e.key).num++;

        document.getElementById(`${e.key}`).style.transform = `scale(${(missType.find((v) => v.key === e.key).num)})`;

      } else { //初めてのミスキーカウント
        missBaloon(e.key);
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
    //Enter/Space to restart
    if(!(e.key === " " || e.key === "Enter")){
      return;
    };
    //終了していたらリロード
    if((scoreCount > questionLength) || (questions.length === 0)){
      location.reload();
      return;
    };
    untype.classList.remove("flash");
    q();
    startTime = Date.now();
    isTyping = true;
    resetSound.currentTime = 0;
    resetSound.play();
  });
  
}