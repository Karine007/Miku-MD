const TXT = {
  d0:'Day 9: <b>1,466</b><br>citizens! 🎉',
  d1:'You voted:<br><b>R32 Highway</b> 🛣️',
  d2:'The <b>Kingdom</b><br><b>Tower</b> 🗼',
  d3:'A <b>pet</b><br><b>hospital</b> 🏥',
  d4:'<b>FLASH</b><br><b>FLOOD!</b> 🌊',
  d4b:'Flood walls<br><b>hold it back!</b> 🧱',
  d5:'A <b>mansion</b><br>for Manky 🏰',
  d6:'A new <b>control</b><br><b>tower</b> ✈️',
  d7:'Your <b>watch</b><br><b>tower</b> 🌲',
  d8:'The <b>RDA</b><br><b>Metro</b> 🚇',
  d9:'Herberg<br><b>University</b> 🎓',
  d10:'The island<br>is <b>full!</b> 😱',
  d11:'<b>SHARE</b> to grow<br>the island 🏝️',
  d11b:'Everyone who shares gets<br><b>their own island!</b>',
  vA:'HIGHWAY', vB:'ROCKET',
  goals:[],
  laws:[['🔁','SHARE THIS VIDEO','#f08a24'],['🏝️','GET YOUR OWN ISLAND','#2f7de1']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${i+1}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
