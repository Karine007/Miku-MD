const TXT = {
  d0:'Day 5: <b>1,462</b><br>citizens! 🎉',
  d1:'You voted:<br><b>Beach resort</b> 🏖️',
  d2:'Welcome to the<br><b>Herberg Resort</b> 🌴',
  d3:'<b>Villas</b> on the water<br>+ a <b>yacht</b> 🛥️',
  d4:'A <b>skyscraper</b><br>+ a huge <b>mall</b> 🏙️',
  d5:'<b>Go-kart</b><br>track! 🏎️',
  d6:'A <b>bakery</b> 🥐<br>+ a <b>water tower</b>',
  d7:'Tornado <b>siren</b> 🚨<br>(finally!)',
  d8:'<b>Helipad</b> on<br>the hospital 🚁',
  d9:'<b>Heroes Academy</b><br>+ <b>Elias Park</b> 🌳',
  d10:'Bus station by<br>the <b>lighthouse</b> 🚌',
  d11:'Day 6 vote:<br>what\'s next?',
  d11b:'Comment <b>A</b> or <b>B</b><span class="sub">🧱 lava wall still unlocks at 1,000 shares</span>',
  vA:'ZOO', vB:'BEACH RESORT',
  goals:[],
  laws:[['🦁','A ZOO · @kofipif','#2f7de1'],['🪖','MILITARY BASE · @mongolianstarlight','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${'AB'[i]}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
$('goals').innerHTML='';
