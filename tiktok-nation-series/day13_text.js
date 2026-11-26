const TXT = {
  d0:'The vote: <b>2 – 0</b> 🏅',
  d0b:'Herberg hosts the<br><b>OLYMPIC GAMES!</b>',
  d1:'<b>190,000</b><br>seats 🏟️',
  d1b:'The <b>torch</b><br>is lit! 🔥',
  d2:'RDA goes<br>to <b>SPACE</b> 🚀',
  d2b:'300 <b>sextillion</b> trillion<br>meters per minute 🤯',
  d3:'"Wrong tower!"<br>The spire <b>moves</b> 🗼',
  d4:'<b>Bridges</b> connect<br>every island 🌉',
  d5:'<b>Hotel</b><br><b>Island</b> 🏨',
  d6:'More <b>pyramids</b>...<br>and <b>mummies</b> 🧟',
  d7:'The <b>SCP Foundation</b><br>in the volcano 🔬',
  d7b:"Don't open<br><b>that door...</b> 👀",
  d8:"<b>Jack's Burgers</b><br>island 🍔",
  d9:'A <b>thick wall</b> +<br>a <b>Filipino town</b> 🇵🇭',
  d10:'A <b>stadium</b><br>island ⚽',
  d11:'<b>Kola Beach</b> 🏖️',
  d12:'Day 14 vote:<br><b>flying cars</b> or a <b>giant robot?</b>',
  d12b:'Share for<br><b>your own island!</b> 🔁',
  oA:'OLYMPIC GAMES', oB:'MOON BASE',
  vA:'FLYING CARS', vB:'GIANT ROBOT',
  goals:[],
  laws:[['💬','COMMENT A OR B','#2f7de1'],['🔁','SHARE = NEW ISLAND','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${i+1}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
