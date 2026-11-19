const TXT = {
  d0:'Day 8: <b>1,466</b><br>citizens! 🎉',
  d1:'You voted:<br><b>Zoo</b> 🦁',
  d2:'<b>Herberg Zoo</b><br>is open! 🐘',
  d3:'<b>Garlic Corp</b><br>HQ 🐱',
  d4:'Herberg\'s<br><b>top doctor</b> 🩺',
  d5:'A <b>children\'s</b><br><b>home</b> 🏠',
  d6:'A <b>phone</b><br>store 📱',
  d7:'Herberg<br><b>High School</b> 🏫',
  d8:'A <b>swimming</b><br><b>pool</b> 🏊',
  d9:'The <b>blue</b><br>dog tower 🐕',
  d10:'A <b>jet pilot</b> ✈️',
  d11:'<b>SWAT</b><br>headquarters 🚨',
  d12:'A <b>pet store</b> 🐶',
  d13:'Day 9 vote:<br>what\'s next?',
  d13b:'Comment <b>A</b> or <b>B</b><span class="sub">🧱 lava wall still unlocks at 1,000 shares</span>',
  vA:'ZOO', vB:'HIGHWAY',
  goals:[],
  laws:[['🛣️','R32 HIGHWAY · @k17.gaming','#2f7de1'],['🚀','ROCKET LAUNCH PAD','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${'AB'[i]}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
