const tg = window.Telegram?.WebApp;
if (tg){
  tg.expand();
  tg.setHeaderColor('#0e0f12');
  tg.setBackgroundColor('#0e0f12');
}

const ACTIONS = {
  soft: [
    "нежно поцеловать", "погладить", "ласково обнять",
    "шепнуть комплимент", "лёгкий массаж", "встретиться взглядом и улыбнуться"
  ],
  spicy: [
    "страстно поцеловать", "несмело покусать", "провести кончиками пальцев",
    "шёпот на ушко и поцелуй", "медленно погладить", "обнять крепче и поцеловать"
  ],
  extra: [
    "поцеловать, не отводя взгляда", "ласково прикусить", "очертить линию губами",
    "задать дерзкий комплимент и поцеловать", "медленно помассировать", "поиграть дыханием"
  ]
};
const PARTS = {
  soft: ["шею","губы","ушко","спину","живот","ладонь"],
  spicy: ["ключицу","нижнюю губу","внутреннюю сторону предплечья","поясницу","линию челюсти","коленку"],
  extra: ["линию шеи до ключицы","уголок губ","за ушком","нижнюю часть спины","солнечное сплетение","впадинку ключицы"]
};

const die1 = document.getElementById('die1');
const die2 = document.getElementById('die2');
const label1 = document.getElementById('label1');
const label2 = document.getElementById('label2');
const rollBtn = document.getElementById('rollBtn');
const spice = document.getElementById('spice');

let rolling = false;

function rnd1to6(){ return 1 + Math.floor(Math.random()*6); }
function setFace(el, v){
  el.classList.remove('face-1','face-2','face-3','face-4','face-5','face-6');
  el.classList.add(`face-${v}`);
}

async function haptic(type="impact"){
  try{
    if (!tg || !tg.HapticFeedback) return;
    if (type==="impact") tg.HapticFeedback.impactOccurred("medium");
    if (type==="success") tg.HapticFeedback.notificationOccurred("success");
  }catch(e){}
}

async function roll(){
  if (rolling) return;
  rolling = true;
  await haptic("impact");

  // скрываем прошлые подписи и запускаем «кручение»
  die1.classList.remove('show'); die2.classList.remove('show');
  die1.classList.add('rolling'); die2.classList.add('rolling');

  const v1 = rnd1to6();
  const v2 = rnd1to6();

  await new Promise(r => setTimeout(r, 850));

  setFace(die1, v1);
  setFace(die2, v2);
  die1.classList.remove('rolling'); 
  die2.classList.remove('rolling');

  const mode = spice.value;
  label1.textContent = ACTIONS[mode][v1-1];
  label2.textContent = PARTS[mode][v2-1];

  die1.classList.add('show'); 
  die2.classList.add('show');

  await haptic("success");
  rolling = false;
}

rollBtn.addEventListener('click', roll);

// первичная отрисовка
setFace(die1, 1); setFace(die2, 1);
label1.textContent = "";
label2.textContent = "";
