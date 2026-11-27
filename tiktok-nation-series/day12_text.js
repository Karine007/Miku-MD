const TXT = {
  d0:'The vote was a <b>TIE!</b> 🤯',
  d0b:'So we built <b>BOTH!</b> 🛰️🐠',
  d1:"Herberg's first<br><b>SPACE STATION</b> 🛰️",
  d1b:'Antarctic Airlines<br><b>docked on top</b> ✈️',
  d2:'An <b>UNDERWATER</b><br><b>CITY</b> 🐠',
  d3:'<b>RDA North Pacific</b><br><b>Airways</b> ✈️',
  d4:'You asked for it...<br><b>you got the job!</b> 🎧',
  d4b:'"RDA 1, <b>cleared</b><br><b>for takeoff!</b>" 🛫',
  d5:'The castle moved<br>to its <b>own island</b> 🏰',
  d6:'A <b>600 m spire</b><br>on the Kingdom Tower 🗼',
  d7:'<b>Herberg Mall</b><br>is open! 🛍️',
  d8:'"Dude, where\'s<br><b>my house?</b>"',
  d8b:'<b>Right here, Dre!</b> 🏠',
  d9:'A <b>chocolate</b><br><b>factory</b> island 🍫',
  d10:"Milo's <b>TITANIC</b> 🛳️",
  d10b:'No icebergs.<br><b>We checked.</b> ✅',
  d11:'Day 13 vote:<br><b>Olympics</b> or <b>Moon base?</b>',
  d11b:'Comment <b>what you</b><br><b>want next!</b> 💬',
  oA:'SPACE STATION', oB:'UNDERWATER CITY',
  vA:'OLYMPIC GAMES', vB:'MOON BASE',
  goals:[],
  laws:[['💬','COMMENT A OR B','#2f7de1'],['🔁','SHARE = NEW ISLAND','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${i+1}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
