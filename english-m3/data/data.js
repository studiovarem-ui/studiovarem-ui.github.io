// data/data.js
(function(){
  window.VAREM_LIST = window.VAREM_LIST || [];

  // 001.js~에서 호출하는 함수
  window.add = function(arr){
    if(Array.isArray(arr)) window.VAREM_LIST.push(...arr);
  };

  // ready 콜백
  const readyCbs = [];
  window.VAREM_onReady = function(cb){
    if(window.__VAREM_READY__) cb();
    else readyCbs.push(cb);
  };

  // 로더: 001~013 (마지막 013은 361~365만 넣으면 됨)
  const files = [];
  for(let i=1;i<=13;i++){
    files.push(String(i).padStart(3,"0") + ".js");
  }

  function loadScript(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "data/" + src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed: " + src));
      document.head.appendChild(s);
    });
  }

  (async function(){
    for(const f of files){
      try{
        await loadScript(f);
      }catch(e){
        // 파일이 아직 없으면(예: 003.js 이후 미생성) 여기서 멈춰도 사이트는 동작
        break;
      }
    }
    window.__VAREM_READY__ = true;
    readyCbs.splice(0).forEach(fn => fn());
  })();
})();