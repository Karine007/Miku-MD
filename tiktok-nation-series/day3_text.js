const TXT = {
  day:'DAY',pop:'POPULATION',nation:'HERBERG',
  s1:'Day 3: from 80 to<br><b>1,160 citizens</b> !!!',
  s2a:'Every follower<br>is <b>on the map</b>...',
  s2b:'<b>17,300 views</b><br>thank you 🙏',
  s3:'First law:<br><b>free pizza</b> every Friday!',
  vA:'FREE PIZZA', vB:'NO PINEAPPLE',
  s4:'And you unlocked...<br><b>everything</b>',
  goals:[['❤️','VOLCANO ERUPTION','100 likes needed','570 ✅','','#e8334f'],['🔁','2 NEW ISLANDS','10 shares each','23 ✅','','#2f7de1'],['📌','SECRET EVENT','25 saves needed','112 ✅','','#f2a33a']],
  s5a:'570 likes...<br>the volcano <b>erupts</b> !',
  s5b:'Don\'t worry: the lava<br>flows <b>away</b> from Vardia',
  s6:'23 shares =<br><b>2 new islands</b>',
  s7a:'112 saves =<br>the <b>secret event</b>',
  s7b:'The eruption revealed<br><b>ancient ruins</b> !<span class="sub">discovered by <b>@nikolozi6327</b></span>',
  s8:'And you sent us<br><b>228 requests</b>...',
  s8b:'We build them <b>all</b><span class="sub">parts 1 to 4 this week · follow so you don\'t miss yours</span>',
  s9:'Day 4 vote:<br>what do we build <b>first</b>?',
  s9b:'Comment <b>A</b> or <b>B</b><span class="sub">2,000 likes = a <b>second city</b> 🏙️</span>',
  tags:[['🍕 PIZZERIA','idea: @nikothecatty'],['👨‍🍳 PIZZA BAKER','@mizomin52'],['🛕 TEMPLE ISLAND','@leclercsleftmirror'],['☕ CAFÉ ISLAND','@yunrxi'],['🏛️ ANCIENT COLOSSEUM','@orangutan_lover1'],['🏰 OLD CASTLE','@mr_toca13460']],
  bubbles:[['“please add a church” ⛪','@gellie96'],['“a football stadium named Club FC Herbegus” ⚽','@milinkovicbird'],['“add a airport” ✈️','@000000biggycheese000000'],['“add a school”','@jairus_is_bro2'],['“can I own a roller coaster” 🎢','@worship_on_god']],
  laws:[['⚽','FOOTBALL STADIUM','#2f7de1'],['✈️','AIRPORT','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent=TXT.day; $('t_pop').textContent=TXT.pop; $('t_nation').textContent=TXT.nation; $('tag').textContent='';
$('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB;
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${'AB'[i]}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
