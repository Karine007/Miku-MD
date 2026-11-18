const TXT = {
  d0:'Day 7: <b>1,466</b><br>citizens! 🎉',
  d1:'You voted:<br><b>Railway</b> 🚂',
  d2:'<b>Herberg Railway</b><br>is open! 🚆',
  d3:'A <b>king</b> on<br>the castle 👑',
  d4:'The <b>priest</b> +<br>altar boys ⛪',
  d5:'A <b>blacksmith</b><br>forge ⚒️',
  d6:'Police: the<br><b>3rd division</b> 🚓',
  d7:'A new<br><b>fire captain</b> 🚒',
  d8:'The <b>ferry</b><br>+ its sailor ⛴️',
  d9:'Herberg <b>Navy</b> ⚓',
  d10:'A <b>hotel</b><br>by the sea 🏨',
  d11:'Antarctic <b>helicopter</b><br>pilot 🚁',
  d12:'Day 8 vote:<br>what\'s next?',
  d12b:'Comment <b>A</b> or <b>B</b><span class="sub">🧱 lava wall still unlocks at 1,000 shares</span>',
  vA:'RAILWAY', vB:'ZOO',
  goals:[],
  laws:[['🦁','ZOO · @kofipif','#2f7de1'],['🛣️','R32 HIGHWAY · @k17.gaming','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${'AB'[i]}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
