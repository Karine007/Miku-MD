const TXT = {
  n0:'Day 4: <b>new</b><br>in Herberg! 🏙️',
  n1:'An <b>ice cream</b><br><b>truck</b> 🍦',
  n2:'...and a <b>man</b> in<br>the lighthouse 🗼',
  wait:'WAIT...<br><b>what was that?!</b>',
  s0:'🚨 <b>Breaking news</b><br>from Herberg',
  s1:'The volcano<br><b>erupted!</b> 🌋',
  s2:'Lava is heading<br>to the <b>city</b>!',
  s3:'<b>1,354</b> citizens<br>in danger 😱',
  s4:'It hits the city<br>in <b>24 hours</b> ⏳',
  s5:'If it gets there...<br><b>everything</b> is gone',
  s5b:'<span class="sub">houses, parliament, port... all of it</span>',
  s6:'<b>You</b> can<br>save Herberg!',
  s6b:'<span class="sub">reach <b>ONE</b> goal = city saved ✅</span>',
  s7:'We build a giant<br><b>lava wall</b> 🧱',
  s8:'<b>Share</b> now 🔁<br>before it\'s too late!',
  s8b:'<span class="sub">Day 5 only comes if Herberg survives</span>',
  goals:[['🔁','1,000 SHARES','send this video to friends','0 / 1,000','','#2f7de1'],['❤️','OR 1,000 LIKES','double tap this video','0 / 1,000','','#e8334f']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('goals').innerHTML=TXT.goals.map(g=>`<div class="goal"><div class="ge">${g[0]}</div><div class="gb"><div class="gt">${g[1]}</div><div class="gs">${g[2]}</div><div class="bar"><i style="background:${g[5]}"></i></div></div><div class="gn">${g[3]}</div></div>`).join('');
