import { sGet, sSet, getDeviceProfile, setDeviceProfile } from './storage.js';

/* ============================================================
   DATA
============================================================ */
const DAY_NAMES = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const TIERS = [1200,1500,1800];
const SLOTS = [
  {id:'breakfast', name:'ארוחת בוקר', icon:'☀️'},
  {id:'snack1', name:'ביניים - בוקר', icon:'🍎'},
  {id:'lunch', name:'ארוחת צהריים', icon:'🍽️'},
  {id:'snack2', name:'ביניים - אחה"צ', icon:'🥜'},
  {id:'dinner', name:'ארוחת ערב', icon:'🌙'},
  {id:'snack3', name:'לפני השינה', icon:'⭐'}
];

const MEAL_DATA = {
1200:{
 breakfast:[
  {id:'b1',name:'חביתת ירקות קטנה',calories:220,ingredients:['ביצה אחת','ירקות','חצי פרוסת לחם מלא','כפית שמן זית'],recipe:'לטגן ביצה עם ירקות קצוצים בשמן זית, להגיש עם חצי פרוסת לחם.'},
  {id:'b2',name:'יוגורט עם מעט גרנולה',calories:230,ingredients:['150 גרם יוגורט 5%','כף גרנולה','פרי קטן'],recipe:'לערבב יוגורט עם גרנולה ולהוסיף פרי חתוך.'},
  {id:'b3',name:'טוסט גבינה קטן',calories:210,ingredients:['פרוסת לחם מלא','פרוסת גבינה צהובה 5%','ירקות חתוכים'],recipe:'לצלות טוסט עם גבינה, להגיש עם ירקות טריים.'}
 ],
 snack1:[
  {id:'s1a',name:'פרי קטן',calories:80,ingredients:['פרי עונה קטן'],recipe:'לאכול כמו שהוא.'},
  {id:'s1b',name:'יוגורט טבעי קטן',calories:90,ingredients:['יוגורט טבעי 120 גרם'],recipe:'להגיש קר.'},
  {id:'s1c',name:'חמישה שקדים',calories:90,ingredients:['5 שקדים'],recipe:'לאכול כמו שהם.'}
 ],
 lunch:[
  {id:'l1',name:'חצי חזה עוף, קצת אורז וסלט',calories:320,ingredients:['70 גרם חזה עוף','רבע כוס אורז מלא','סלט ירקות'],recipe:'לצלות חזה עוף בתיבול, להגיש עם מעט אורז מלא וסלט.'},
  {id:'l2',name:'קציצת דג עם ירקות אפויים',calories:310,ingredients:['קציצת דג אחת','ירקות אפויים'],recipe:'לאפות דג וירקות בתנור 20 דקות ב-200 מעלות.'},
  {id:'l3',name:'טופו קטן מוקפץ עם ירקות',calories:330,ingredients:['80 גרם טופו','ירקות מוקפצים','רבע כוס אורז'],recipe:'להקפיץ טופו וירקות ברוטב סויה קל, להגיש עם מעט אורז.'}
 ],
 snack2:[
  {id:'s2a',name:'גבינה 5% קטנה',calories:100,ingredients:['גביע גבינה 5% קטן'],recipe:'להגיש קר.'},
  {id:'s2b',name:'חופן אגוזים קטן',calories:100,ingredients:['10 גרם אגוזים מעורבים'],recipe:'לאכול כמו שהוא.'},
  {id:'s2c',name:'שני קרקרים מלאים',calories:90,ingredients:['2 קרקרים מלאים'],recipe:'לאכול כמו שהם.'}
 ],
 dinner:[
  {id:'d1',name:'סלט עוף קטן',calories:310,ingredients:['70 גרם חזה עוף צלוי','ירקות מגוונים','כפית שמן זית'],recipe:'לחתוך ירקות, להוסיף עוף חתוך, לתבל בשמן זית ולימון.'},
  {id:'d2',name:'שקשוקה קלה',calories:300,ingredients:['ביצה אחת','רסק עגבניות','פלפל'],recipe:'לבשל רסק עגבניות ופלפל, לשבור ביצה ולבשל עד להתגבשות.'},
  {id:'d3',name:'מרק ירקות',calories:290,ingredients:['קערת מרק ירקות'],recipe:'לבשל ירקות במרק עד לריכוך.'}
 ],
 snack3:[
  {id:'s3a',name:'יוגורט קטן',calories:100,ingredients:['יוגורט 120 גרם'],recipe:'להגיש קר.'},
  {id:'s3b',name:'פרי קטן',calories:80,ingredients:['פרי קטן'],recipe:'לאכול כמו שהוא.'},
  {id:'s3c',name:'חצי כוס חלב',calories:90,ingredients:['חצי כוס חלב או משקה שקדים'],recipe:'לחמם מעט ולהגיש.'}
 ]
},
1500:{
 breakfast:[
  {id:'b1',name:'חביתת ירקות ולחם',calories:280,ingredients:['2 ביצים','ירקות','חצי פרוסת לחם מלא'],recipe:'לטגן ביצים עם ירקות קצוצים, להגיש עם לחם.'},
  {id:'b2',name:'יוגורט עם גרנולה',calories:290,ingredients:['180 גרם יוגורט 5%','2 כפות גרנולה','פרי עונה'],recipe:'לערבב יוגורט עם גרנולה ולהוסיף פרי חתוך.'},
  {id:'b3',name:'טוסט גבינה וירקות',calories:260,ingredients:['פרוסת לחם מלא','פרוסת גבינה צהובה 5%','ירקות'],recipe:'לצלות טוסט עם גבינה, להגיש עם ירקות טריים.'}
 ],
 snack1:[
  {id:'s1a',name:'פרי + 3 שקדים',calories:130,ingredients:['פרי עונה','3 שקדים'],recipe:'לאכול כמו שהוא.'},
  {id:'s1b',name:'יוגורט טבעי',calories:130,ingredients:['יוגורט טבעי 150 גרם'],recipe:'להגיש קר.'},
  {id:'s1c',name:'טוסט אבוקדו דק',calories:140,ingredients:['פרוסת לחם מלא','שמינית אבוקדו'],recipe:'למעוך אבוקדו ולמרוח על הלחם.'}
 ],
 lunch:[
  {id:'l1',name:'חזה עוף, אורז וסלט',calories:400,ingredients:['100 גרם חזה עוף','שליש כוס אורז מלא','סלט ירקות'],recipe:'לצלות חזה עוף בתיבול, להגיש עם אורז מלא וסלט.'},
  {id:'l2',name:'קציצות דג, בטטה קטנה וירקות אפויים',calories:390,ingredients:['2 קציצות דג','בטטה קטנה','ירקות אפויים'],recipe:'לאפות דג וירקות בתנור 20 דקות ב-200 מעלות.'},
  {id:'l3',name:'טופו מוקפץ עם ירקות ואורז',calories:410,ingredients:['120 גרם טופו','ירקות מוקפצים','שליש כוס אורז'],recipe:'להקפיץ טופו וירקות ברוטב סויה קל, להגיש עם אורז.'}
 ],
 snack2:[
  {id:'s2a',name:'גבינה 5% ופרי',calories:130,ingredients:['גביע גבינה 5%','פרי עונה'],recipe:'להגיש יחד.'},
  {id:'s2b',name:'חופן אגוזים',calories:140,ingredients:['15 גרם אגוזים מעורבים'],recipe:'לאכול כמו שהוא.'},
  {id:'s2c',name:'קרקר מלא + טונה',calories:130,ingredients:['2 קרקרים מלאים','20 גרם טונה'],recipe:'למרוח טונה על הקרקרים.'}
 ],
 dinner:[
  {id:'d1',name:'סלט עוף',calories:380,ingredients:['90 גרם חזה עוף צלוי','ירקות מגוונים','שמינית אבוקדו'],recipe:'לחתוך ירקות, להוסיף עוף חתוך ואבוקדו, לתבל בשמן זית ולימון.'},
  {id:'d2',name:'שקשוקה עם לחם',calories:380,ingredients:['2 ביצים','רסק עגבניות','פלפל','חצי פרוסת לחם מלא'],recipe:'לבשל רסק עגבניות ופלפל, לשבור ביצים ולבשל עד להתגבשות.'},
  {id:'d3',name:'מרק ירקות עם קינואה',calories:390,ingredients:['קערת מרק ירקות','רבע כוס קינואה מבושלת'],recipe:'לבשל ירקות במרק, להגיש עם קינואה מבושלת בצד.'}
 ],
 snack3:[
  {id:'s3a',name:'יוגורט',calories:110,ingredients:['יוגורט 150 גרם'],recipe:'להגיש קר.'},
  {id:'s3b',name:'תפוח + 5 שקדים',calories:150,ingredients:['תפוח עץ','5 שקדים'],recipe:'לאכול יחד.'},
  {id:'s3c',name:'כוס חלב חם',calories:110,ingredients:['כוס חלב או משקה שקדים'],recipe:'לחמם מעט ולהגיש.'}
 ]
},
1800:{
 breakfast:[
  {id:'b1',name:'חביתת ירקות ולחם מלא',calories:320,ingredients:['2 ביצים','חצי בצל','עגבנייה','פרוסת לחם מלא','כפית שמן זית'],recipe:'לטגן ביצים עם ירקות קצוצים בשמן זית, להגיש עם פרוסת לחם מלא.'},
  {id:'b2',name:'יוגורט עם גרנולה ופרי',calories:310,ingredients:['200 גרם יוגורט 5%','3 כפות גרנולה','פרי עונה'],recipe:'לערבב יוגורט עם גרנולה ולהוסיף פרי חתוך.'},
  {id:'b3',name:'טוסט גבינה וירקות',calories:330,ingredients:['2 פרוסות לחם מלא','2 פרוסות גבינה צהובה 5%','ירקות חתוכים'],recipe:'לצלות טוסט עם גבינה, להגיש עם ירקות טריים.'}
 ],
 snack1:[
  {id:'s1a',name:'פרי + 5 שקדים',calories:150,ingredients:['פרי עונה','5 שקדים'],recipe:'לאכול כמו שהוא.'},
  {id:'s1b',name:'יוגורט טבעי קטן',calories:140,ingredients:['יוגורט טבעי 150 גרם'],recipe:'להגיש קר.'},
  {id:'s1c',name:'פרוסת לחם עם ממרח אבוקדו',calories:150,ingredients:['פרוסת לחם מלא','רבע אבוקדו'],recipe:'למעוך אבוקדו ולמרוח על הלחם.'}
 ],
 lunch:[
  {id:'l1',name:'חזה עוף, אורז מלא וסלט',calories:450,ingredients:['120 גרם חזה עוף','חצי כוס אורז מלא','סלט ירקות','כפית שמן זית'],recipe:'לצלות חזה עוף בתיבול, להגיש עם אורז מלא וסלט.'},
  {id:'l2',name:'קציצות דגים, בטטה וירקות אפויים',calories:440,ingredients:['2 קציצות דג','בטטה בינונית','ירקות אפויים'],recipe:'לאפות דג וירקות בתנור 20 דקות ב-200 מעלות.'},
  {id:'l3',name:'טופו מוקפץ עם ירקות ואורז',calories:460,ingredients:['150 גרם טופו','ירקות מוקפצים','חצי כוס אורז'],recipe:'להקפיץ טופו וירקות ברוטב סויה קל, להגיש עם אורז.'}
 ],
 snack2:[
  {id:'s2a',name:'גבינה 5% ופרי',calories:150,ingredients:['גביע גבינה 5%','פרי עונה'],recipe:'להגיש יחד.'},
  {id:'s2b',name:'חופן אגוזים מעורבים',calories:160,ingredients:['20 גרם אגוזים מעורבים'],recipe:'לאכול כמו שהוא.'},
  {id:'s2c',name:'קרקר מלא + טונה',calories:150,ingredients:['3 קרקרים מלאים','30 גרם טונה במים'],recipe:'למרוח טונה על הקרקרים.'}
 ],
 dinner:[
  {id:'d1',name:'סלט עוף גדול',calories:420,ingredients:['100 גרם חזה עוף צלוי','ירקות מגוונים','חצי אבוקדו','כפית שמן זית'],recipe:'לחתוך ירקות, להוסיף עוף חתוך ואבוקדו, לתבל בשמן זית ולימון.'},
  {id:'d2',name:'שקשוקה עם לחם מלא',calories:400,ingredients:['2 ביצים','רסק עגבניות','פלפל','פרוסת לחם מלא'],recipe:'לבשל רסק עגבניות ופלפל, לשבור ביצים ולבשל עד להתגבשות.'},
  {id:'d3',name:'מרק ירקות עם קינואה',calories:410,ingredients:['קערת מרק ירקות','חצי כוס קינואה מבושלת'],recipe:'לבשל ירקות במרק, להגיש עם קינואה מבושלת בצד.'}
 ],
 snack3:[
  {id:'s3a',name:'יוגורט קטן',calories:100,ingredients:['יוגורט 150 גרם'],recipe:'להגיש קר.'},
  {id:'s3b',name:'תפוח קטן',calories:80,ingredients:['תפוח עץ'],recipe:'לאכול כמו שהוא.'},
  {id:'s3c',name:'כוס חלב/שקדים חם',calories:110,ingredients:['כוס חלב או משקה שקדים'],recipe:'לחמם מעט ולהגיש.'}
 ]
}
};

const BADGE_DEFS = [
 {id:'water_10', ic:'💧', label:'טיפה ראשונה', desc:'10 ליטר מים במצטבר', type:'water', threshold:10000},
 {id:'water_50', ic:'🌊', label:'שוחים בכיף', desc:'50 ליטר מים במצטבר', type:'water', threshold:50000},
 {id:'water_100', ic:'🐋', label:'לווייתן', desc:'100 ליטר מים במצטבר', type:'water', threshold:100000},
 {id:'water_streak_7', ic:'🔥', label:'שבוע רטוב', desc:'7 ימים רצוף ביעד המים', type:'waterstreak', threshold:7},
 {id:'weight_2', ic:'🥉', label:'צעד ראשון', desc:'ירידה של 2 ק"ג', type:'weight', threshold:2},
 {id:'weight_5', ic:'🥈', label:'חצי הדרך', desc:'ירידה של 5 ק"ג', type:'weight', threshold:5},
 {id:'weight_10', ic:'🥇', label:'שינוי גדול', desc:'ירידה של 10 ק"ג', type:'weight', threshold:10},
 {id:'weigh_streak_4', ic:'📈', label:'עקביים', desc:'4 שקילות רצופות (שבועיות)', type:'weightlog', threshold:4},
];

/* ============================================================
   STATE
============================================================ */
let CURRENT_PROFILE = null;
let CURRENT_TAB = 'dashboard';
let MENU_DAY_OFFSET = 0; // 0..6 within current week
let PROFILES = [];

/* ============================================================
   STORAGE HELPERS
============================================================ */
// sGet/sSet now come from js/storage.js (Supabase-backed)

/* ============================================================
   UTIL
============================================================ */
function todayStr(d){
  const dt = d || new Date();
  return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');
}
function getWeekStart(d){
  const dt = new Date(d || new Date());
  dt.setHours(0,0,0,0);
  dt.setDate(dt.getDate() - dt.getDay());
  return dt;
}
function addDays(d, n){ const r = new Date(d); r.setDate(r.getDate()+n); return r; }
function fmtDate(d){ return d.toLocaleDateString('he-IL',{day:'numeric',month:'numeric'}); }
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
function openSheet(html){
  document.getElementById('sheet').innerHTML = html;
  document.getElementById('overlay').classList.remove('hidden');
}
function closeSheet(){ document.getElementById('overlay').classList.add('hidden'); }
document.getElementById('overlay').addEventListener('click',(e)=>{ if(e.target.id==='overlay') closeSheet(); });

/* ============================================================
   PROFILE / GATE
============================================================ */
async function initGate(auto=true){
  PROFILES = (await sGet('profiles-list')) || [];
  const listEl = document.getElementById('profile-list');
  listEl.innerHTML = '';
  PROFILES.forEach(name=>{
    const b = document.createElement('button');
    b.className = 'profile-btn';
    b.innerHTML = `<span class="profile-avatar">${name.charAt(0)}</span>${name}`;
    b.onclick = ()=> selectProfile(name);
    listEl.appendChild(b);
  });
  // "auto" מחובר רק בטעינה הראשונה של האתר - כדי לדלג ישר לפרופיל שכבר
  // נבחר במכשיר הזה. כשחוזרים דרך "החלפת פרופיל" (auto=false) לא מדלגים,
  // כדי שאפשר יהיה גם לבחור פרופיל אחר וגם להוסיף פרופיל חדש.
  if(auto){
    const remembered = getDeviceProfile();
    if(remembered && PROFILES.includes(remembered)){
      selectProfile(remembered);
    }
  }
}
async function createProfile(){
  const input = document.getElementById('new-profile-name');
  const name = input.value.trim();
  if(!name){ showToast('נא להזין שם'); return; }
  if(!PROFILES.includes(name)) PROFILES.push(name);
  await sSet('profiles-list', PROFILES);
  input.value='';
  selectProfile(name);
}
async function selectProfile(name){
  CURRENT_PROFILE = name;
  setDeviceProfile(name);
  document.getElementById('gate').style.display='none';
  document.getElementById('mainapp').hidden = false;
  document.getElementById('mainapp').style.display='flex';
  document.getElementById('header-name').textContent = name;
  document.getElementById('header-date').textContent = new Date().toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long'});
  await ensureSettings();
  goTab('dashboard');
  checkWaterReminder();
  setInterval(checkWaterReminder, 5*60*1000);
}
function switchProfile(){
  document.getElementById('mainapp').style.display='none';
  document.getElementById('gate').style.display='flex';
  initGate(false);
}

async function ensureSettings(){
  let s = await sGet(`settings:${CURRENT_PROFILE}`);
  if(!s){
    s = {tier:1500, height:165};
    await sSet(`settings:${CURRENT_PROFILE}`, s);
  }
  return s;
}

/* ============================================================
   NAV
============================================================ */
document.getElementById('bottomnav').addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-tab]');
  if(btn) goTab(btn.dataset.tab);
});
function goTab(tab){
  CURRENT_TAB = tab;
  document.querySelectorAll('#bottomnav button').forEach(b=> b.classList.toggle('active', b.dataset.tab===tab));
  const renderers = {dashboard:renderDashboard, menu:renderMenu, water:renderWater, weight:renderWeight, badges:renderBadges, shopping:renderShopping};
  renderers[tab]();
}

/* ============================================================
   DASHBOARD
============================================================ */
async function renderDashboard(){
  const el = document.getElementById('tab-content');
  el.innerHTML = '<div class="card muted">טוען...</div>';
  const settings = await ensureSettings();
  const today = todayStr();
  const water = (await sGet(`water:${CURRENT_PROFILE}:${today}`)) || {total:0, entries:[], lastDrink:null};
  const goal = 2500;
  const pct = Math.min(100, Math.round((water.total/goal)*100));
  const weightLog = (await sGet(`weight-log:${CURRENT_PROFILE}`)) || [];
  const latest = weightLog.length ? weightLog[weightLog.length-1] : null;
  const first = weightLog.length ? weightLog[0] : null;
  const delta = (latest && first) ? (latest.weight - first.weight) : 0;
  const bmi = latest ? (latest.weight / Math.pow(settings.height/100,2)) : null;
  const badges = (await sGet(`badges:${CURRENT_PROFILE}`)) || [];
  const streak = (await sGet(`water-streak:${CURRENT_PROFILE}`)) || {count:0};
  const challenge = await getWeeklyChallengeStatus();

  const ringR = 52, circumference = 2*Math.PI*ringR;
  const dash = circumference * pct/100;

  el.innerHTML = `
    <div class="card">
      <h3>💧 מים היום</h3>
      <div class="rings-wrap">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="${ringR}" fill="none" stroke="var(--border)" stroke-width="12"/>
          <circle cx="60" cy="60" r="${ringR}" fill="none" stroke="var(--primary)" stroke-width="12"
            stroke-dasharray="${dash} ${circumference}" stroke-linecap="round" transform="rotate(-90 60 60)"/>
          <text x="60" y="65" text-anchor="middle" font-size="20" font-weight="800" fill="var(--primary-dark)" font-family="Rubik">${pct}%</text>
        </svg>
        <div class="rings-stats">
          <div class="big">${(water.total/1000).toFixed(2)} ל'</div>
          <div class="lbl">מתוך 2.5 ליטר ליום</div>
          <div class="pill" style="margin-top:8px;">🔥 רצף ${streak.count} ימים</div>
        </div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-box"><div class="v">${latest ? latest.weight+' ק"ג' : '—'}</div><div class="l">משקל אחרון</div></div>
      <div class="stat-box"><div class="v">${latest ? (delta<=0?'':'+')+delta.toFixed(1) : '—'}</div><div class="l">שינוי כולל</div></div>
      <div class="stat-box"><div class="v">${bmi ? bmi.toFixed(1) : '—'}</div><div class="l">BMI</div></div>
      <div class="stat-box"><div class="v">${settings.tier}</div><div class="l">תפריט קלורי</div></div>
    </div>

    <div class="card">
      <h3>🏅 תגים אחרונים</h3>
      ${badges.length ? `<div class="btn-row">${badges.slice(-3).reverse().map(b=>{const d=BADGE_DEFS.find(x=>x.id===b.id);return `<span class="pill">${d?d.ic:'🏅'} ${d?d.label:b.id}</span>`;}).join('')}</div>` : '<div class="muted">עדיין אין תגים - קדימה!</div>'}
    </div>

    <div class="card">
      <h3>🤝 אתגר משותף השבוע</h3>
      <div class="muted" style="margin-bottom:8px;">2.5 ליטר מים ביום, כל השבוע - שתיכן יחד</div>
      <div class="btn-row">
        ${challenge.names.map(n=>`<span class="pill ${challenge.status[n]?'':'accent-pill'}">${n}: ${challenge.status[n]}/7 ימים</span>`).join('')}
      </div>
    </div>
  `;
}

async function getWeeklyChallengeStatus(){
  const weekStart = getWeekStart();
  const names = PROFILES.length ? PROFILES : [CURRENT_PROFILE];
  const status = {};
  for(const name of names){
    let count = 0;
    for(let i=0;i<7;i++){
      const d = addDays(weekStart, i);
      if(d > new Date()) continue;
      const w = await sGet(`water:${name}:${todayStr(d)}`);
      if(w && w.total >= 2500) count++;
    }
    status[name] = count;
  }
  return {names, status};
}

/* ============================================================
   MENU
============================================================ */
async function getCustomOptions(tier, slot){
  return (await sGet(`custom-options:${tier}:${slot}`)) || [];
}
async function allOptionsFor(tier, slot){
  const custom = await getCustomOptions(tier, slot);
  return [...MEAL_DATA[tier][slot], ...custom];
}

async function renderMenu(){
  const el = document.getElementById('tab-content');
  const settings = await ensureSettings();
  el.innerHTML = `
    <div class="card">
      <h3>בחירת תפריט קלורי</h3>
      <div class="btn-row">
        ${TIERS.map(t=>`<button class="btn ${settings.tier===t?'':'secondary'}" onclick="setTier(${t})">${t} קלוריות</button>`).join('')}
      </div>
    </div>
    <div class="daytabs" id="daytabs"></div>
    <div id="meal-list"></div>
  `;
  const weekStart = getWeekStart();
  const daytabs = document.getElementById('daytabs');
  daytabs.innerHTML = '';
  for(let i=0;i<7;i++){
    const d = addDays(weekStart,i);
    const b = document.createElement('button');
    b.textContent = DAY_NAMES[i] + ' ' + fmtDate(d);
    if(i===MENU_DAY_OFFSET) b.classList.add('active');
    b.onclick = ()=>{ MENU_DAY_OFFSET=i; renderMenu(); };
    daytabs.appendChild(b);
  }
  await renderMealList();
}

async function setTier(tier){
  const s = await ensureSettings();
  s.tier = tier;
  await sSet(`settings:${CURRENT_PROFILE}`, s);
  renderMenu();
}

async function renderMealList(){
  const settings = await ensureSettings();
  const tier = settings.tier;
  const weekStart = getWeekStart();
  const date = addDays(weekStart, MENU_DAY_OFFSET);
  const dateStr = todayStr(date);
  let menu = (await sGet(`menu:${CURRENT_PROFILE}:${dateStr}`)) || {};
  const listEl = document.getElementById('meal-list');
  listEl.innerHTML = '';
  for(const slot of SLOTS){
    const options = await allOptionsFor(tier, slot.id);
    const selectedId = menu[slot.id] || options[0].id;
    const selected = options.find(o=>o.id===selectedId) || options[0];
    const row = document.createElement('div');
    row.className='meal-row';
    row.innerHTML = `
      <div class="top"><span class="slot-name">${slot.icon} ${slot.name}</span><span class="cal">${selected.calories} קק"ל</span></div>
      <div class="meal-name">${selected.name}</div>
      <div class="ingredients">${selected.ingredients.join(' · ')}</div>
      <select data-slot="${slot.id}">
        ${options.map(o=>`<option value="${o.id}" ${o.id===selected.id?'selected':''}>${o.name}${o.custom?' (מותאם אישית)':''}</option>`).join('')}
      </select>
      <div style="margin-top:8px;display:flex;justify-content:space-between;">
        <button class="link-btn" onclick="showRecipe('${tier}','${slot.id}','${selected.id}')">מתכון</button>
        <button class="link-btn" onclick="addCustomOption('${tier}','${slot.id}')">+ הוספת תחליף משלי</button>
      </div>
    `;
    row.querySelector('select').addEventListener('change', async (e)=>{
      menu[slot.id] = e.target.value;
      await sSet(`menu:${CURRENT_PROFILE}:${dateStr}`, menu);
      renderMealList();
    });
    listEl.appendChild(row);
  }
}

async function showRecipe(tier, slotId, optionId){
  const options = await allOptionsFor(Number(tier), slotId);
  const opt = options.find(o=>o.id===optionId);
  if(!opt) return;
  openSheet(`
    <button class="sheet-close" onclick="closeSheet()">✕</button>
    <h3>${opt.name}</h3>
    <p class="pill">${opt.calories} קק"ל</p>
    <p><b>מרכיבים:</b> ${opt.ingredients.join(', ')}</p>
    <p><b>הכנה:</b> ${opt.recipe}</p>
  `);
}

async function addCustomOption(tier, slotId){
  openSheet(`
    <button class="sheet-close" onclick="closeSheet()">✕</button>
    <h3>הוספת תחליף משלכם</h3>
    <div class="field"><label>שם המנה</label><input id="co-name" placeholder="למשל: סלט קינואה עם פטה"></div>
    <div class="field"><label>קלוריות</label><input id="co-cal" type="number" placeholder="450"></div>
    <div class="field"><label>מרכיבים (מופרדים בפסיק)</label><input id="co-ing" placeholder="קינואה, פטה, מלפפון"></div>
    <div class="field"><label>אופן הכנה</label><textarea id="co-recipe" rows="2" placeholder="לבשל קינואה, לערבב עם..."></textarea></div>
    <button class="btn block" onclick="saveCustomOption('${tier}','${slotId}')">שמירה</button>
  `);
}
async function saveCustomOption(tier, slotId){
  const name = document.getElementById('co-name').value.trim();
  const cal = Number(document.getElementById('co-cal').value) || 0;
  const ing = document.getElementById('co-ing').value.split(',').map(s=>s.trim()).filter(Boolean);
  const recipe = document.getElementById('co-recipe').value.trim();
  if(!name){ showToast('נא להזין שם למנה'); return; }
  const list = await getCustomOptions(tier, slotId);
  list.push({id:'custom_'+Date.now(), name, calories:cal, ingredients: ing.length?ing:['—'], recipe: recipe||'—', custom:true});
  await sSet(`custom-options:${tier}:${slotId}`, list);
  closeSheet();
  showToast('התחליף נוסף בהצלחה');
  renderMealList();
}

/* ============================================================
   WATER
============================================================ */
async function renderWater(){
  const el = document.getElementById('tab-content');
  const today = todayStr();
  const water = (await sGet(`water:${CURRENT_PROFILE}:${today}`)) || {total:0, entries:[], lastDrink:null};
  const goal = 2500;
  const pct = Math.min(100, Math.round((water.total/goal)*100));
  let reminderHtml = '';
  if(water.lastDrink){
    const mins = Math.floor((Date.now()-water.lastDrink)/60000);
    if(mins>=60){
      reminderHtml = `<div class="reminder-banner"><span>⏰ עברה שעה מאז השתייה האחרונה - כדאי לשתות מים!</span></div>`;
    }
  }
  el.innerHTML = `
    ${reminderHtml}
    <div class="card">
      <h3>💧 מעקב מים - היום</h3>
      <div class="water-visual">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border)" stroke-width="14"/>
          <circle cx="70" cy="70" r="60" fill="none" stroke="var(--primary)" stroke-width="14"
            stroke-dasharray="${2*Math.PI*60*pct/100} ${2*Math.PI*60}" stroke-linecap="round" transform="rotate(-90 70 70)"/>
          <text x="70" y="65" text-anchor="middle" font-size="22" font-weight="800" fill="var(--primary-dark)" font-family="Rubik">${(water.total/1000).toFixed(2)} ל'</text>
          <text x="70" y="85" text-anchor="middle" font-size="12" fill="var(--ink-soft)">מתוך 2.5 ל'</text>
        </svg>
      </div>
      <div class="quick-water">
        <button onclick="addWater(150)">+150 מ"ל</button>
        <button onclick="addWater(250)">+250 מ"ל</button>
        <button onclick="addWater(350)">+350 מ"ל</button>
        <button onclick="addWater(500)">+500 מ"ל</button>
      </div>
      <div class="btn-row">
        <input id="custom-water-amt" type="number" placeholder="כמות מותאמת (מ״ל)" style="flex:1;">
        <button class="btn secondary" onclick="addCustomWater()">הוספה</button>
      </div>
    </div>
    <div class="card">
      <h3>יומן שתייה להיום</h3>
      ${water.entries.length ? water.entries.slice().reverse().map(e=>`<div class="muted">${new Date(e.time).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})} — ${e.amount} מ"ל</div>`).join('') : '<div class="muted">עדיין לא נרשמה שתייה היום</div>'}
    </div>
  `;
}
async function addWater(amount){
  const today = todayStr();
  const water = (await sGet(`water:${CURRENT_PROFILE}:${today}`)) || {total:0, entries:[], lastDrink:null};
  water.total += amount;
  water.entries.push({time:Date.now(), amount});
  water.lastDrink = Date.now();
  await sSet(`water:${CURRENT_PROFILE}:${today}`, water);

  const cum = (await sGet(`water-cumulative:${CURRENT_PROFILE}`)) || {total:0};
  cum.total += amount;
  await sSet(`water-cumulative:${CURRENT_PROFILE}`, cum);

  showToast(`נוספו ${amount} מ"ל 💧`);
  await checkBadges();
  renderWater();
}
async function addCustomWater(){
  const v = Number(document.getElementById('custom-water-amt').value);
  if(!v || v<=0){ showToast('נא להזין כמות תקינה'); return; }
  await addWater(v);
}
async function checkWaterReminder(){
  if(!CURRENT_PROFILE) return;
  const today = todayStr();
  const water = await sGet(`water:${CURRENT_PROFILE}:${today}`);
  if(water && water.lastDrink){
    const mins = Math.floor((Date.now()-water.lastDrink)/60000);
    if(mins>=60 && mins<65 && CURRENT_TAB!=='water'){
      showToast('⏰ עברה שעה מאז השתייה האחרונה - כדאי לשתות מים!');
    }
  }
  if(CURRENT_TAB==='water') renderWater();
  if(CURRENT_TAB==='dashboard') renderDashboard();
}

/* ============================================================
   WEIGHT
============================================================ */
async function renderWeight(){
  const el = document.getElementById('tab-content');
  const settings = await ensureSettings();
  const log = (await sGet(`weight-log:${CURRENT_PROFILE}`)) || [];
  const latest = log.length ? log[log.length-1] : null;
  const bmi = latest ? latest.weight / Math.pow(settings.height/100,2) : null;
  let bmiCat = '';
  if(bmi){
    if(bmi<18.5) bmiCat='תת-משקל';
    else if(bmi<25) bmiCat='תקין';
    else if(bmi<30) bmiCat='עודף משקל';
    else bmiCat='השמנה';
  }
  el.innerHTML = `
    <div class="card">
      <h3>⚖️ הוספת שקילה</h3>
      <div class="btn-row">
        <input id="new-weight" type="number" step="0.1" placeholder="משקל בק״ג" style="flex:1;">
        <button class="btn" onclick="logWeight()">שמירה</button>
      </div>
      <div class="muted" style="margin-top:6px;">מומלץ לשקול פעם בשבוע, באותו יום ושעה</div>
      <div class="field" style="margin-top:12px;">
        <label>גובה (ס״מ) — לחישוב BMI</label>
        <input id="height-input" type="number" value="${settings.height}" onchange="updateHeight(this.value)">
      </div>
    </div>
    <div class="card">
      <h3>מגמת משקל</h3>
      ${log.length>=2 ? drawWeightChart(log) : '<div class="muted">נדרשות לפחות 2 שקילות כדי להציג גרף</div>'}
    </div>
    <div class="stat-grid">
      <div class="stat-box"><div class="v">${latest?latest.weight+' ק"ג':'—'}</div><div class="l">משקל אחרון</div></div>
      <div class="stat-box"><div class="v">${bmi?bmi.toFixed(1):'—'}</div><div class="l">BMI (${bmiCat})</div></div>
    </div>
    <div class="card">
      <h3>היסטוריה</h3>
      ${log.length? log.slice().reverse().map(e=>`<div class="muted">${e.date} — ${e.weight} ק"ג</div>`).join('') : '<div class="muted">אין נתונים עדיין</div>'}
    </div>
  `;
}
function drawWeightChart(log){
  const w=280,h=130,pad=24;
  const weights = log.map(e=>e.weight);
  const min = Math.min(...weights), max = Math.max(...weights);
  const range = (max-min)||1;
  const stepX = (w-2*pad)/(log.length-1);
  const pts = log.map((e,i)=>{
    const x = pad + i*stepX;
    const y = h-pad - ((e.weight-min)/range)*(h-2*pad);
    return {x,y,val:e.weight,date:e.date};
  });
  const path = pts.map((p,i)=> (i===0?'M':'L')+p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ');
  const dots = pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--primary)"><title>${p.date}: ${p.val} ק"ג</title></circle>`).join('');
  return `<svg class="weight-chart" viewBox="0 0 ${w} ${h}">
    <path d="${path}" fill="none" stroke="var(--primary)" stroke-width="2.5"/>
    ${dots}
  </svg>`;
}
async function logWeight(){
  const v = Number(document.getElementById('new-weight').value);
  if(!v || v<=0){ showToast('נא להזין משקל תקין'); return; }
  const log = (await sGet(`weight-log:${CURRENT_PROFILE}`)) || [];
  log.push({date: todayStr(), weight: v});
  await sSet(`weight-log:${CURRENT_PROFILE}`, log);
  showToast('המשקל נשמר ✅');
  await checkBadges();
  renderWeight();
}
async function updateHeight(v){
  const s = await ensureSettings();
  s.height = Number(v)||s.height;
  await sSet(`settings:${CURRENT_PROFILE}`, s);
}

/* ============================================================
   BADGES
============================================================ */
async function checkBadges(){
  const earned = (await sGet(`badges:${CURRENT_PROFILE}`)) || [];
  const earnedIds = new Set(earned.map(b=>b.id));
  const cum = (await sGet(`water-cumulative:${CURRENT_PROFILE}`)) || {total:0};
  const log = (await sGet(`weight-log:${CURRENT_PROFILE}`)) || [];
  const streak = (await sGet(`water-streak:${CURRENT_PROFILE}`)) || {count:0};
  const first = log.length?log[0].weight:null;
  const latest = log.length?log[log.length-1].weight:null;
  const lostSoFar = (first!=null && latest!=null) ? (first-latest) : 0;

  let newlyEarned = [];
  for(const b of BADGE_DEFS){
    if(earnedIds.has(b.id)) continue;
    let achieved = false;
    if(b.type==='water') achieved = cum.total >= b.threshold;
    if(b.type==='waterstreak') achieved = streak.count >= b.threshold;
    if(b.type==='weight') achieved = lostSoFar >= b.threshold;
    if(b.type==='weightlog') achieved = log.length >= b.threshold;
    if(achieved){
      earned.push({id:b.id, date: todayStr()});
      newlyEarned.push(b);
    }
  }
  if(newlyEarned.length){
    await sSet(`badges:${CURRENT_PROFILE}`, earned);
    newlyEarned.forEach(b=> showToast(`🏅 תג חדש: ${b.label}!`));
  }
}

async function updateWaterStreakOnLoad(){
  // check yesterday's total, update streak counter once per day
  const streakData = (await sGet(`water-streak:${CURRENT_PROFILE}`)) || {count:0, lastChecked:null};
  const today = todayStr();
  if(streakData.lastChecked === today) return;
  const yesterday = todayStr(addDays(new Date(),-1));
  const yWater = await sGet(`water:${CURRENT_PROFILE}:${yesterday}`);
  if(streakData.lastChecked === yesterday || streakData.lastChecked===null){
    if(yWater && yWater.total>=2500) streakData.count = (streakData.count||0)+1;
    else if(streakData.lastChecked!==null) streakData.count = 0;
  } else {
    streakData.count = 0; // missed more than a day gap
  }
  streakData.lastChecked = today;
  await sSet(`water-streak:${CURRENT_PROFILE}`, streakData);
}

async function renderBadges(){
  await updateWaterStreakOnLoad();
  await checkBadges();
  const el = document.getElementById('tab-content');
  const earned = (await sGet(`badges:${CURRENT_PROFILE}`)) || [];
  const earnedMap = {}; earned.forEach(b=> earnedMap[b.id]=b.date);
  el.innerHTML = `
    <div class="card">
      <h3>🏅 התגים שלך</h3>
      <div class="badge-grid">
        ${BADGE_DEFS.map(b=>`
          <div class="badge ${earnedMap[b.id]?'earned':'locked'}">
            <div class="ic">${b.ic}</div>
            <div class="t">${b.label}</div>
            <div class="d">${b.desc}</div>
            ${earnedMap[b.id]?`<div class="d" style="color:var(--primary-dark);margin-top:4px;">התקבל ${earnedMap[b.id]}</div>`:''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ============================================================
   SHOPPING LIST
============================================================ */
async function renderShopping(){
  const el = document.getElementById('tab-content');
  el.innerHTML = '<div class="card muted">בונה רשימת קניות לשבוע...</div>';
  const settings = await ensureSettings();
  const tier = settings.tier;
  const weekStart = getWeekStart();
  const weekId = todayStr(weekStart);
  const tally = {};
  for(let i=0;i<7;i++){
    const date = addDays(weekStart,i);
    const dateStr = todayStr(date);
    const menu = (await sGet(`menu:${CURRENT_PROFILE}:${dateStr}`)) || {};
    for(const slot of SLOTS){
      const options = await allOptionsFor(tier, slot.id);
      const selId = menu[slot.id] || options[0].id;
      const opt = options.find(o=>o.id===selId) || options[0];
      opt.ingredients.forEach(ing=>{ tally[ing] = (tally[ing]||0)+1; });
    }
  }
  const checks = (await sGet(`shopping:${CURRENT_PROFILE}:${weekId}`)) || {};
  const items = Object.keys(tally).sort((a,b)=>a.localeCompare(b,'he'));
  el.innerHTML = `
    <div class="card">
      <h3>🛒 רשימת קניות - השבוע</h3>
      <div class="muted" style="margin-bottom:8px;">מבוסס על התפריט שנבחר לכל ימות השבוע</div>
      ${items.map(ing=>`
        <div class="shop-item ${checks[ing]?'checked':''}" data-ing="${encodeURIComponent(ing)}">
          <input type="checkbox" ${checks[ing]?'checked':''} onchange="toggleShopItem('${weekId}','${encodeURIComponent(ing)}', this.checked)">
          <span>${ing}${tally[ing]>1?' (x'+tally[ing]+')':''}</span>
        </div>
      `).join('')}
    </div>
  `;
}
async function toggleShopItem(weekId, encIng, checked){
  const ing = decodeURIComponent(encIng);
  const checks = (await sGet(`shopping:${CURRENT_PROFILE}:${weekId}`)) || {};
  checks[ing] = checked;
  await sSet(`shopping:${CURRENT_PROFILE}:${weekId}`, checks);
  document.querySelector(`.shop-item[data-ing="${encIng}"]`).classList.toggle('checked', checked);
}

/* ============================================================
   EXPOSE TO WINDOW
   (נדרש כי הקובץ הוא ES module - פונקציות שנקראות מתוך onclick/onchange
   בתוך ה-HTML חייבות להיות זמינות על window)
============================================================ */
window.createProfile = createProfile;
window.switchProfile = switchProfile;
window.setTier = setTier;
window.showRecipe = showRecipe;
window.addCustomOption = addCustomOption;
window.saveCustomOption = saveCustomOption;
window.addWater = addWater;
window.addCustomWater = addCustomWater;
window.logWeight = logWeight;
window.updateHeight = updateHeight;
window.toggleShopItem = toggleShopItem;
window.closeSheet = closeSheet;

/* ============================================================
   INIT
============================================================ */
initGate();
