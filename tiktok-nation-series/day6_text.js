const TXT = {
  d0:'Day 6: <b>1,464</b><br>citizens! 🎉',
  d1:'You voted:<br><b>Military base</b> 🪖',
  d2:'The <b>military base</b><br>+ the <b>General</b> ⭐',
  d3:'A <b>desert island</b><br>+ <b>camel farm</b> 🐪',
  d4:'A <b>chemistry lab</b><br>+ its scientist 🧪',
  d5:'A big old<br><b>castle</b> 🏰',
  d6:'A 900 m<br><b>ocean tower</b> 🌊',
  d7:'<b>MATEL Air</b> + Antarctic<br><b>Airlines</b> HQ ✈️',
  d8:'A <b>basketball</b><br>court 🏀',
  d9:'<b>Fun park</b><br>+ mascots 🎡',
  d10:'"Where\'s my house?"<br>Here it is! 🏠',
  d11:'Day 7 vote:<br>what\'s next?',
  d11b:'Comment <b>A</b> or <b>B</b><span class="sub">🧱 lava wall still unlocks at 1,000 shares</span>',
  vA:'ZOO', vB:'MILITARY BASE',
  goals:[],
  laws:[['🚂','A RAILWAY · @newhamm.william','#2f7de1'],['🦁','B ZOO · @kofipif','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${'AB'[i]}</div><span class="em">${l[0]}</span>${l[1].replace(/^[AB] /,'')}</div>`).join('');
$('goals').innerHTML='';
