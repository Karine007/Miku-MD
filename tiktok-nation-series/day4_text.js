const TXT = {
  s0:'Day 4: <b>1,354</b><br>citizens!',
  s1:'But the city was<br>a <b>mess</b> 😵',
  s1b:'<span class="sub">houses inside houses, roads through roofs...</span>',
  s2a:'So we <b>cut the forest</b> 🪓',
  s2b:'...and made the island<br><b>bigger</b>',
  s3:'Then: real <b>roads</b> 🛣️<br>(you asked!)',
  s4a:'Every building gets<br>its <b>own lot</b>',
  s4b:'No more houses<br>inside houses ✅',
  s5:'<b>Bridges</b> to the islands 🌉<br>+ <b>Port Sunny</b> ⚓',
  s6a:'Your <b>coast</b> requests 🏖️',
  s6b:'...and yes, a <b>man</b><br>in the lighthouse 🗼',
  s7a:'An <b>ice cream truck</b> 🍦',
  s7b:'A <b>watermill</b> for flour<br>+ air traffic control ✈️',
  s8:'2nd city vote:<br><b>San Vista</b> wins!',
  s8b:'<span class="sub">we build it at <b>2,000 likes</b> ❤️</span>',
  s9:'Day 5 vote:<br>what\'s next?',
  s9b:'Comment <b>A</b> or <b>B</b><span class="sub">❤️ 2,000 likes = <b>San Vista</b> gets built</span>',
  vA:'VELLERA', vB:'SAN VISTA',
  goals:[['❤️','BUILD SAN VISTA','likes on this video','64 / 2,000','','#e8334f']],
  laws:[['🦁','A ZOO · @kaizylen17','#2f7de1'],['🏖️','BEACH RESORT · @_eruzazyy','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${'AB'[i]}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML=TXT.goals.map(g=>`<div class="goal"><div class="ge">${g[0]}</div><div class="gb"><div class="gt">${g[1]}</div><div class="gs">${g[2]}</div><div class="bar"><i style="background:${g[5]}"></i></div></div><div class="gn">${g[3]}</div></div>`).join('');
