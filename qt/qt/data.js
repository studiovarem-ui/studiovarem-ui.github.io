// qt/data.js
const LIST = [];
function ADD(items){ LIST.push(...items); }

// (선택) 특정 날짜 고정 슬롯: "MM-DD" → LIST 인덱스 대신 이걸 보여줌
// 예: 12-25(성탄절), 01-01(신년) 등
const FIXED = {
  // "12-25": { ref_ko:"눅 2:11", ref_en:"Luke 2:11", ko:"...", en:"..." },
};

function getKST(){
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 3600000);
}
function dayOfYear(d){
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.floor((d - start) / 86400000); // 0-based
}
function mmdd(d){
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${mm}-${dd}`;
}
function getTodayItem(){
  const d = getKST();
  const key = mmdd(d);
  if(FIXED[key]) return { item: FIXED[key], dayNum: dayOfYear(d)+1, isFixed:true };

  const idx = dayOfYear(d) % LIST.length;
  return { item: LIST[idx], dayNum: dayOfYear(d)+1, isFixed:false };
}