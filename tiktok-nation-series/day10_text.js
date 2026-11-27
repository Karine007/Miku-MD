const TXT = {
  d0:'<b>10 shares</b> =<br><b>10 new islands!</b> 🏝️',
  d1:"<b>D4SH's</b><br><b>island</b> ✈️",
  d1b:'"Balong has a<br><b>new island!</b>"',
  d2:'An <b>Italian</b><br>island 🍝',
  d3:'A giant<br><b>cruise port</b> 🛳️',
  d4:'<b>Gold</b><br><b>Island</b> 💰',
  d5:'The <b>Grand</b><br><b>Hotel</b> 🏨',
  d6:'Mr.<br><b>President</b> 🏛️',
  d7:'A whole<br><b>pork farm</b> 🐷',
  d8:'<b>Fortress</b><br><b>Island</b> 🛡️',
  d9:'A <b>pyramid</b><br>island 🔺',
  d10:'Your own<br><b>forest island</b> 🌲',
  d11:'Now running<br>on <b>STEAM!</b> 🚂',
  d12:'Day 11 vote:<br><b>bridges</b> or <b>boats?</b>',
  d12b:'Keep sharing for<br><b>more islands!</b> 🔁',
  vA:'BRIDGES', vB:'BOATS',
  goals:[],
  laws:[['💬','COMMENT A OR B','#2f7de1'],['🔁','SHARE = NEW ISLAND','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${i+1}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
