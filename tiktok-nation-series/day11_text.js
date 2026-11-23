const TXT = {
  d0:'<b>30 shares!</b> 🔁',
  d0b:'The vote was close...<br><b>BOATS WON!</b> ⛴️',
  d1:'The <b>Herusie Ship</b> 🛳️<br>to every island!',
  d2:'A <b>cookie</b><br>island 🍪',
  d3:'An island<br>made of <b>cake</b> 🎂',
  d4:'All hail<br><b>King Frinz!</b> 👑',
  d5:'A <b>farm</b> + a<br><b>modern house</b> 🚜',
  d6:'<b>Banano</b><br><b>Shoes</b> 👟',
  d7:'<b>Kola</b><br><b>Motors</b> 🚗',
  d8:'"Do I have<br>an island?"',
  d8b:'<b>You do now!</b> ✅',
  d9:'<b>Copenhagen</b><br>style 🇩🇰',
  d10:'An <b>RDA</b><br><b>resort</b> 🌴',
  d11:'Herberg goes<br>to <b>SPACE!</b> 🚀',
  d11b:'Antarctic Airlines<br><b>space plane</b> ✈️',
  d12:'Day 12 vote:<br><b>space</b> or <b>underwater?</b>',
  d12b:'Keep sharing for<br><b>your own island!</b> 🔁',
  oA:'BRIDGES', oB:'BOATS',
  vA:'SPACE STATION', vB:'UNDERWATER CITY',
  goals:[],
  laws:[['💬','COMMENT A OR B','#2f7de1'],['🔁','SHARE = NEW ISLAND','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${i+1}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
