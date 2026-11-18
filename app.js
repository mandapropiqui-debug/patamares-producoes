(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var qs=new URLSearchParams(location.search);
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var WA='557196818080';

/* ================= ABERTURA: 20 PEÇAS, 20 ANOS ================= */
var intro=$('#intro'),lg=$('#lg'),tk=$('#ticks'),N=20,strips=[],asm=[],count=0,done=false,touched=false;
var MOV=['',''];
for(var i=0;i<N;i++){
  var s=document.createElement('i');
  s.style.left=(i*5)+'%';s.style.width='5.05%';s.style.backgroundPosition=(i/(N-1)*100)+'% 0';
  var ang=Math.random()*60-30,dx=Math.random()*260-130,dy=(Math.random()>.5?1:-1)*(120+Math.random()*220);
  s._off='translate('+dx.toFixed(0)+'px,'+dy.toFixed(0)+'px) rotate('+ang.toFixed(0)+'deg) scale('+(0.4+Math.random()*.8).toFixed(2)+')';
  s.style.transform=s._off;s.style.opacity=.0;s.style.filter='blur(6px)';
  lg.appendChild(s);strips.push(s);asm.push(0);
  var t=document.createElement('i');tk.appendChild(t);
}
requestAnimationFrame(function(){strips.forEach(function(s,i){setTimeout(function(){s.style.opacity=.45},i*30)})});
function put(i){
  if(asm[i])return;asm[i]=1;count++;
  var s=strips[i];s.style.transform='none';s.style.opacity=1;s.style.filter='none';
  tk.children[i].classList.add('on');
  $('#cn').textContent=('0'+count).slice(-2);
  $('#hint').style.opacity=0;
  if(count>=N&&!done){done=true;lg.classList.add('shine');setTimeout(function(){intro.classList.add('ready')},700)}
}
function atX(cxp){
  var r=lg.getBoundingClientRect();touched=true;
  var k=Math.floor((cxp-r.left)/r.width*N);
  for(var d=-2;d<=2;d++){var q=k+d;if(q>=0&&q<N)put(q)}
  if(cxp>r.right)for(var z=0;z<N;z++)if(z<=N)put(z);
}
var drag=false;
intro.addEventListener('pointerdown',function(e){if(e.target.closest('#skip,#enter'))return;drag=true;atX(e.clientX)});
intro.addEventListener('pointermove',function(e){if(drag)atX(e.clientX)});
addEventListener('pointerup',function(){drag=false});
/* se ninguém tocar, as peças se encaixam sozinhas, uma por ano */
var auto=0;setTimeout(function(){var iv=setInterval(function(){if(touched||done){clearInterval(iv);if(!done)finishAuto();return}put(auto++);if(auto>=N)clearInterval(iv)},260)},2600);
function finishAuto(){}
document.documentElement.classList.add('lock');
function enter(){
  intro.classList.add('out');document.documentElement.classList.remove('lock');
  setTimeout(function(){$('#nav').classList.add('on')},500);
  var h=location.hash&&location.hash!=='#links'?$(location.hash):null;if(h)h.scrollIntoView();else window.scrollTo(0,0);
}
$('#enter').addEventListener('click',enter);
$('#skip').addEventListener('click',function(e){e.preventDefault();done=true;enter();history.replaceState(null,'','#links')});
if(qs.has('skip')){done=true;intro.classList.add('out');document.documentElement.classList.remove('lock');$('#nav').classList.add('on')}
else if(qs.get('p')){var pp=parseFloat(qs.get('p'));for(var z=0;z<Math.round(pp*N);z++)put(z)}

/* ================= NAV: acende por seção ================= */
var navA=$$('#nav a'),secs=$$('[data-s]');
var secMap={links:0,shows:1,anos:2,fofo:3,faca:4,faq:5,contato:5};
function spy(){
  var y=innerHeight*.35,cur=null;
  secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y)cur=s.dataset.s});
  if(cur!==null){var n=secMap[cur];navA.forEach(function(a,i){a.classList.toggle('cur',i===n)})}
}
/* ================= REVEAL ================= */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
$$('.rv').forEach(function(el){io.observe(el)});

/* ================= MAGNETIC (ibelick, recriado) ================= */
$$('.mag').forEach(function(el){
  el.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.18;el.style.transform='translate('+x+'px,'+y+'px)'});
  el.addEventListener('pointerleave',function(){el.style.transform=''});
});

/* ================= CONTAGEM: Number Flow recriado ================= */
function mkDigits(host,n){
  host.innerHTML='';host._cols=[];
  for(var i=0;i<n;i++){var c=document.createElement('span');c.className='col';c.innerHTML='0123456789'.split('').map(function(d){return '<span>'+d+'</span>'}).join('');host.appendChild(c);host._cols.push(c)}
}
function setDigits(host,str){
  if(!host._cols||host._cols.length!==str.length)mkDigits(host,str.length);
  for(var i=0;i<str.length;i++)host._cols[i].style.transform='translateY(-'+(+str[i])+'em)';
}
var target=new Date('2026-12-05T17:30:00-03:00').getTime();
var cdEls={};$$('#cd .dg').forEach(function(e){cdEls[e.dataset.k]=e});
function tick(){
  var t=Math.max(0,target-Date.now()),s=Math.floor(t/1000);
  var dd=Math.floor(s/86400),hh=Math.floor(s%86400/3600),mm=Math.floor(s%3600/60),ss=s%60;
  var P=function(n,l){return ('0'+n).slice(-l)};
  setDigits(cdEls.d,P(dd,2));setDigits(cdEls.h,P(hh,2));setDigits(cdEls.m,P(mm,2));setDigits(cdEls.s,P(ss,2));
}
tick();setInterval(tick,1000);

/* ================= FAIXAS: Scroll Based Velocity recriado ================= */
var sv=0,lastY=scrollY;
var rails=$$('.rail').map(function(r,i){
  var tr=$('.tr',r);var kids=$$('figure',tr);
  kids.forEach(function(k){tr.appendChild(k.cloneNode(true))});
  return {tr:tr,x:0,dir:i%2?1:-1,w:0,drag:0};
});
function measure(){rails.forEach(function(r){r.w=r.tr.scrollWidth/2+5})}
window.addEventListener('load',measure);setTimeout(measure,1200);
rails.forEach(function(r){
  var host=r.tr.parentNode,dx0=null;
  host.addEventListener('pointerdown',function(e){dx0=e.clientX;r.drag=0});
  host.addEventListener('pointermove',function(e){if(dx0===null)return;r.x+=(e.clientX-dx0);dx0=e.clientX});
  window.addEventListener('pointerup',function(){dx0=null});
});
/* ================= TRILHO CURVO: Marquee Along SVG Path recriado (offset-path) ================= */
var items=$$('#curve .it'),curve=$('#curve'),cpos=0,cspeed=.00012,cdrag=null;
var pathD='M-40 290 C60 330 110 120 240 150 S400 330 520 40';
function setCurvePath(){
  var r=curve.getBoundingClientRect(),sx=r.width/480,sy=r.height/330;
  var d=pathD.replace(/(-?\d+) (-?\d+)/g,function(m,a,b){return (a*sx).toFixed(1)+' '+(b*sy).toFixed(1)});
  items.forEach(function(it){it.style.offsetPath="path('"+d+"')"});
}
setCurvePath();window.addEventListener('resize',setCurvePath);
curve.addEventListener('pointerdown',function(e){cdrag=e.clientX});
curve.addEventListener('pointermove',function(e){if(cdrag===null)return;cpos+=(e.clientX-cdrag)*.0016;cdrag=e.clientX});
window.addEventListener('pointerup',function(){cdrag=null});

/* ================= LINHA DO TEMPO ================= */
var tl=$('#tl'),fill=$('#tl .rail2 i'),steps=$$('.st',tl);
function tlUpdate(){
  var r=tl.getBoundingClientRect(),vh=innerHeight,line=vh*.62;
  var pr=Math.max(0,Math.min(1,(line-r.top)/r.height));
  fill.style.height=(pr*100)+'%';
  steps.forEach(function(s){var sr=s.getBoundingClientRect();s.classList.toggle('on',sr.top<line)});
}

/* ================= CASES: Tilt (ibelick, recriado) + abrir ================= */
$$('.case').forEach(function(c){
  var b=$('button',c);
  b.addEventListener('click',function(){var o=c.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  c.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=c.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/Math.min(r.height,90)-.5;c.style.transform='perspective(700px) rotateX('+(-y*5)+'deg) rotateY('+(x*6)+'deg)'});
  c.addEventListener('pointerleave',function(){c.style.transform=''});
});
$$('[data-quero]').forEach(function(b){b.addEventListener('click',function(){
  setType(b.dataset.quero);$('#faca').scrollIntoView({behavior:'smooth'});
})});

/* ================= CORRE FOFO: pilha de fotos ================= */
var stkF=$$('#stk figure'),order=stkF.map(function(_,i){return i});
function layoutStack(){
  order.forEach(function(idx,pos){
    var f=stkF[idx];
    f.style.zIndex=stkF.length-pos;
    f.style.transform=pos===0?'none':'translate('+(pos%2?1:-1)*pos*8+'px,'+pos*6+'px) rotate('+((pos%2?1:-1)*pos*3)+'deg) scale('+(1-pos*.04)+')';
    f.style.opacity=pos>3?0:1;
  });
}
layoutStack();
(function(){
  var st=$('#stk'),x0=null,dx=0;
  function next(dir){var f=order.shift();order.push(f);layoutStack()}
  st.addEventListener('pointerdown',function(e){x0=e.clientX;dx=0});
  st.addEventListener('pointermove',function(e){if(x0===null)return;dx=e.clientX-x0;var f=stkF[order[0]];f.style.transition='none';f.style.transform='translateX('+dx+'px) rotate('+dx*.06+'deg)'});
  window.addEventListener('pointerup',function(){
    if(x0===null)return;var f=stkF[order[0]];f.style.transition='';
    if(Math.abs(dx)>40||Math.abs(dx)<5){var dir=dx<0?-1:1;f.style.transform='translateX('+(dir*320)+'px) rotate('+dir*20+'deg)';f.style.opacity=0;setTimeout(function(){next();},260)}
    else layoutStack();
    x0=null;dx=0;
  });
})();
/* barra de inscrições */
var barIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
  var fl=$('#fl'),n=$('#pcn');setTimeout(function(){fl.style.width='70%'},200);
  setTimeout(function(){fl.style.width='85%'},1900);
  var t0=performance.now();(function a(t){var k=Math.min(1,(t-t0)/3400);var v=k<.5?70*(k/.5):70+15*((k-.5)/.5);n.textContent=Math.round(v);if(k<1)requestAnimationFrame(a)})(t0);
  barIO.disconnect();
}})},{threshold:.5});
barIO.observe($('#bar'));

/* ================= FAÇA SEU EVENTO ================= */
var B={tipo:null,publico:2000,cidade:'',data:'',precisa:[],invest:''};
var tipos={show:'Show',corrida:'Corrida / esportivo',festival:'Festival',corp:'Corporativo',social:'Social / aniversário'};
var precisaL=['Palco','Som','Luz','Camarote','Credenciamento','Ingressos','Artista','Segurança'];
var invL=['Até R$ 50 mil','R$ 50 a 150 mil','R$ 150 a 500 mil','Acima de R$ 500 mil','Prefiro não informar'];
var step=0,stg=$('#stg'),panel=$('#panel'),stp=$$('#stp i'),stag=$('#stag');
var seed=(Math.floor(Math.random()*9000)+1000);$('#rn').textContent='#'+seed;
/* palco SVG que monta */
function stageSVG(){
  var s='<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" aria-label="Palco em montagem">';
  s+='<defs><linearGradient id="fl1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3f"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient><linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="st1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#8e8e96"/></linearGradient></defs>';
  s+='<rect width="320" height="190" fill="url(#fl1)"/>';
  for(var i=0;i<7;i++)s+='<line x1="0" y1="'+(110+i*14)+'" x2="320" y2="'+(110+i*14)+'" stroke="#fff" stroke-opacity=".05"/>';
  /* palco base: três patamares (sempre) */
  s+='<g class="g on" id="g-base"><rect x="86" y="96" width="148" height="12" fill="url(#st1)" opacity=".5"/><rect x="100" y="84" width="120" height="12" fill="url(#st1)" opacity=".75"/><rect x="114" y="72" width="92" height="12" fill="url(#st1)"/></g>';
  /* treliça + refletores */
  s+='<g class="g" id="g-truss"><rect x="70" y="26" width="180" height="5" fill="#d8d8dd"/><rect x="70" y="26" width="3" height="70" fill="#d8d8dd"/><rect x="247" y="26" width="3" height="70" fill="#d8d8dd"/>';
  for(var k=0;k<18;k++)s+='<path d="M'+(74+k*10)+' 26 l5 5 l5 -5" stroke="#9a9aa2" fill="none"/>';
  s+='</g><g class="g" id="g-lamps">';
  for(var j=0;j<8;j++){var x=84+j*22;s+='<circle cx="'+x+'" cy="36" r="3.4" fill="#fff"/><polygon class="lamp" style="animation-delay:'+(-j*.37)+'s" points="'+x+',38 '+(x-14+((j%3)*9))+',96 '+(x+14+((j%3)*9))+',96" fill="url(#bm)" opacity=".4"/>'}
  s+='</g>';
  /* PA */
  s+='<g class="g" id="g-pa"><rect x="44" y="52" width="22" height="50" fill="#cfcfd5"/><rect x="254" y="52" width="22" height="50" fill="#cfcfd5"/>';
  [0,1,2,3].forEach(function(r){s+='<circle cx="55" cy="'+(62+r*11)+'" r="4" fill="#2a2a2e"/><circle cx="265" cy="'+(62+r*11)+'" r="4" fill="#2a2a2e"/>'});
  s+='</g>';
  /* camarote */
  s+='<g class="g" id="g-cam"><rect x="6" y="84" width="34" height="22" fill="#e8e8ec" opacity=".85"/><rect x="280" y="84" width="34" height="22" fill="#e8e8ec" opacity=".85"/><text x="23" y="99" font-size="8" fill="#0e0e10" text-anchor="middle" font-family="Hanken" font-weight="700">VIP</text><text x="297" y="99" font-size="8" fill="#0e0e10" text-anchor="middle" font-family="Hanken" font-weight="700">VIP</text></g>';
  /* credenciamento */
  s+='<g class="g" id="g-cred"><rect x="150" y="150" width="20" height="14" fill="#fff" opacity=".9"/><rect x="146" y="146" width="28" height="4" fill="#cfcfd5"/><rect x="152" y="153" width="16" height="2" fill="#0e0e10"/></g>';
  /* ingressos */
  s+='<g class="g" id="g-tix"><path d="M12 150h26v8a3 3 0 0 0 0 6v8H12v-8a3 3 0 0 0 0-6z" fill="#fff"/><line x1="25" y1="152" x2="25" y2="170" stroke="#0e0e10" stroke-dasharray="2 2"/></g>';
  /* artista */
  s+='<g class="g" id="g-art"><circle cx="160" cy="52" r="5" fill="#fff"/><rect x="155" y="58" width="10" height="14" rx="3" fill="#fff"/><line x1="170" y1="54" x2="176" y2="48" stroke="#fff" stroke-width="1.5"/></g>';
  /* segurança */
  s+='<g class="g" id="g-sec">';
  for(var q=0;q<7;q++)s+='<rect x="'+(96+q*21)+'" y="116" width="6" height="9" rx="2" fill="#bdbdc4"/><circle cx="'+(99+q*21)+'" cy="113" r="2.6" fill="#bdbdc4"/>';
  s+='</g>';
  /* específicos por tipo */
  s+='<g class="g" id="t-show"><rect x="116" y="42" width="88" height="28" fill="#fff" opacity=".18"/><rect x="116" y="42" width="88" height="28" fill="none" stroke="#fff" stroke-opacity=".6"/></g>';
  s+='<g class="g" id="t-corrida"><path d="M90 140 V108 Q160 76 230 108 V140" fill="none" stroke="#fff" stroke-width="5"/><text x="160" y="104" font-size="9" text-anchor="middle" fill="#fff" font-family="Hanken" font-weight="800">LARGADA</text></g>';
  s+='<g class="g" id="t-festival"><rect x="8" y="58" width="50" height="38" fill="url(#st1)" opacity=".8"/><rect x="262" y="58" width="50" height="38" fill="url(#st1)" opacity=".8"/></g>';
  s+='<g class="g" id="t-corp"><rect x="150" y="60" width="20" height="12" fill="#fff"/><rect x="98" y="40" width="30" height="22" fill="#fff" opacity=".3"/><rect x="192" y="40" width="30" height="22" fill="#fff" opacity=".3"/></g>';
  s+='<g class="g" id="t-social"><path d="M10 28 Q160 70 310 28" fill="none" stroke="#fff" stroke-opacity=".6"/>';
  for(var l=0;l<9;l++){var lx=10+l*37.5,ly=28+Math.sin(l/8*Math.PI)*21;s+='<circle class="lamp" style="animation-delay:'+(-l*.3)+'s" cx="'+lx+'" cy="'+ly+'" r="3" fill="#fff"/>'}
  s+='</g>';
  /* público */
  s+='<g id="crowd"></g></svg>';
  stg.insertAdjacentHTML('afterbegin',s);
}
stageSVG();
function g(id,on){var e=$('#'+id,stg);if(e)e.classList.toggle('on',!!on)}
function drawCrowd(){
  var n=Math.round(Math.min(150,12+Math.log(B.publico/100+1)*34)),h='';
  var rows=5,per=Math.ceil(n/rows),c=0;
  for(var r=0;r<rows;r++)for(var i=0;i<per&&c<n;i++,c++){var x=18+ (284/(per))*(i+.5)+(r%2?4:0),y=130+r*10+ (c%3);h+='<circle cx="'+x.toFixed(1)+'" cy="'+y+'" r="2.3" fill="#fff" opacity="'+(.35+r*.12)+'"/>'}
  $('#crowd',stg).innerHTML=h;
}
function sync(){
  g('g-truss',B.tipo||B.precisa.indexOf('Luz')>-1||B.precisa.indexOf('Palco')>-1);
  g('g-lamps',B.tipo||B.precisa.indexOf('Luz')>-1);
  g('g-pa',B.precisa.indexOf('Som')>-1);g('g-cam',B.precisa.indexOf('Camarote')>-1);
  g('g-cred',B.precisa.indexOf('Credenciamento')>-1);g('g-tix',B.precisa.indexOf('Ingressos')>-1);
  g('g-art',B.precisa.indexOf('Artista')>-1||B.tipo==='show');g('g-sec',B.precisa.indexOf('Segurança')>-1);
  ['show','corrida','festival','corp','social'].forEach(function(t){g('t-'+t,B.tipo===t)});
  if(step>=1)drawCrowd();
  stag.textContent=B.tipo?tipos[B.tipo]+' · '+fmt(B.publico)+' pessoas':'Palco vazio';
  var luz=document.querySelectorAll('#g-lamps .lamp');
  $('#rs').textContent=[B.tipo?tipos[B.tipo]:'',step>=1?fmt(B.publico):'',B.cidade].filter(Boolean).join(' · ')||'aguardando';
  stp.forEach(function(s,i){s.classList.toggle('on',i<=step)});
}
function fmt(n){return n.toLocaleString('pt-BR')}
function pubFromSlider(v){var x=Math.round(100*Math.pow(600,v/100));return x>=1000?Math.round(x/100)*100:Math.round(x/50)*50}
function setType(t){B.tipo=t;if(step===0)render0();sync()}
function nav(back,next,label){return '<div class="nv">'+(back?'<button class="btn ghost" id="bk"><span>Voltar</span></button>':'')+'<button class="btn lt" id="nx"><span>'+label+'</span></button></div>'}
function q(t,b){return '<div class="q"><span class="t">'+t+'</span> <span class="b">'+b+'</span></div>'}
function render0(){
  panel.innerHTML=q('Que tipo de','evento?')+'<div class="opts">'+Object.keys(tipos).map(function(k){return '<button class="opt'+(B.tipo===k?' sel':'')+'" data-t="'+k+'">'+tipos[k]+'</button>'}).join('')+'</div>'+nav(false,true,'Próximo');
  $$('.opt',panel).forEach(function(o){o.onclick=function(){B.tipo=o.dataset.t;$$('.opt',panel).forEach(function(x){x.classList.toggle('sel',x===o)});sync()}});
  $('#nx').onclick=function(){if(!B.tipo){flash('Escolha um tipo');return}go(1)};
}
function render1(){
  var v=Math.round(Math.log(B.publico/100)/Math.log(600)*100);
  panel.innerHTML=q('Quantas','pessoas?')+'<div class="big"><span class="dg" id="pg"></span><small>pessoas</small></div><input class="rng" id="rg" type="range" min="0" max="100" value="'+v+'" style="--v:'+v+'%" aria-label="Tamanho do público">'+nav(true,true,'Próximo');
  var pg=$('#pg');pg.className='cd';pg.innerHTML='<span class="dg" style="display:inline-flex"></span>';var host=pg.firstChild;
  function upd(){setDigits(host,String(B.publico))}
  upd();
  $('#rg').oninput=function(){B.publico=pubFromSlider(+this.value);this.style.setProperty('--v',this.value+'%');upd();sync()};
  $('#bk').onclick=function(){go(0)};$('#nx').onclick=function(){go(2)};
}
function render2(){
  panel.innerHTML=q('Onde e','quando?')+'<input class="fld" id="ci" placeholder="Cidade (ex.: Teresina-PI)" value="'+esc(B.cidade)+'" autocomplete="off"><input class="fld" id="da" placeholder="Data aproximada (ex.: março de 2027)" value="'+esc(B.data)+'" autocomplete="off">'+nav(true,true,'Próximo');
  $('#ci').oninput=function(){B.cidade=this.value;sync()};$('#da').oninput=function(){B.data=this.value};
  $('#bk').onclick=function(){go(1)};$('#nx').onclick=function(){go(3)};
}
function render3(){
  panel.innerHTML=q('O que você','precisa?')+'<div class="opts">'+precisaL.map(function(k){return '<button class="opt'+(B.precisa.indexOf(k)>-1?' sel':'')+'" data-p="'+k+'">'+k+'</button>'}).join('')+'</div>'+nav(true,true,'Próximo');
  $$('.opt',panel).forEach(function(o){o.onclick=function(){var k=o.dataset.p,i=B.precisa.indexOf(k);if(i>-1)B.precisa.splice(i,1);else B.precisa.push(k);o.classList.toggle('sel');sync()}});
  $('#bk').onclick=function(){go(2)};$('#nx').onclick=function(){go(4)};
}
function render4(){
  panel.innerHTML=q('Faixa de','investimento?')+'<div class="opts">'+invL.map(function(k){return '<button class="opt'+(B.invest===k?' sel':'')+'" data-i="'+k+'">'+k+'</button>'}).join('')+'</div>'+nav(true,true,'Gerar briefing');
  $$('.opt',panel).forEach(function(o){o.onclick=function(){B.invest=o.dataset.i;$$('.opt',panel).forEach(function(x){x.classList.toggle('sel',x===o)})}});
  $('#bk').onclick=function(){go(3)};$('#nx').onclick=finish;
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function flash(t){$('#rs').textContent=t}
var R=[render0,render1,render2,render3,render4];
function go(n){step=n;R[n]();sync()}
function waMsg(){
  var L=['Olá, Patamares!','Vim pelo biolink e fiz o briefing #'+seed+':','',
    'Evento: '+(tipos[B.tipo]||'—'),'Público: '+fmt(B.publico)+' pessoas','Cidade: '+(B.cidade||'a definir'),'Data: '+(B.data||'a definir'),
    'Precisa de: '+(B.precisa.length?B.precisa.join(', '):'a definir'),'Investimento: '+(B.invest||'a conversar'),'','Quero um orçamento.'];
  return 'https://wa.me/'+WA+'?text='+encodeURIComponent(L.join('\n'));
}
function finish(){
  if(!B.tipo){go(0);flash('Escolha um tipo');return}
  panel.innerHTML='<div class="q"><span class="t">Palco</span> <span class="b">montado</span></div>';
  stp.forEach(function(s){s.classList.add('on')});
  $('#rs').textContent='pronto para enviar';
  var rows=[['Evento',tipos[B.tipo]],['Público',fmt(B.publico)+' pessoas'],['Cidade',B.cidade||'a definir'],['Data',B.data||'a definir'],['Precisa de',B.precisa.length?B.precisa.join(', '):'a definir'],['Investimento',B.invest||'a conversar']];
  $('#result').innerHTML='<div class="tkt"><div class="hd"><small>Patamares Produções · briefing</small><b><em>Briefing</em> #'+seed+'</b></div><dl>'+rows.map(function(r){return '<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>'}).join('')+'</dl><div class="sh"></div><div class="bt"><a class="btn" href="'+waMsg()+'" target="_blank" rel="noopener"><span>Enviar para a Patamares</span></a><button class="btn lt sm" id="rs2" style="margin-top:8px;width:100%"><span>Refazer briefing</span></button></div></div>';
  $('#rs2').onclick=function(){B={tipo:null,publico:2000,cidade:'',data:'',precisa:[],invest:''};seed=Math.floor(Math.random()*9000)+1000;$('#rn').textContent='#'+seed;$('#result').innerHTML='';go(0)};
}
go(0);

/* ================= FAQ em conversa ================= */
var FAQ=[
 ['Como contratar?','Preencha o briefing em “Faça seu evento” e envie pelo WhatsApp (55 71 9681-8080). A equipe responde com os próximos passos.'],
 ['Que eventos vocês fazem?','Shows nacionais, como o The Pop com Humberto Gessinger e Dado Villa-Lobos, e eventos esportivos, como o Corre Fofo Teresina. Os cases estão em “Palco dos shows”.'],
 ['Atendem outras cidades?','A Patamares é de Teresina-PI. Para outra cidade, informe no briefing e a equipe responde sobre a viabilidade.'],
 ['Prazo para orçar?','Depende do porte do evento. Envie o briefing completo pelo WhatsApp para a equipe avaliar e retornar.']
];
var msgs=$('#msgs'),qsEl=$('#qs'),busy=false,asked={};
FAQ.forEach(function(f,i){var b=document.createElement('button');b.textContent=f[0];b.onclick=function(){ask(i,b)};qsEl.appendChild(b)});
function bubble(cls,txt){var d=document.createElement('div');d.className='bb '+cls;d.innerHTML=txt||'';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
function ask(i,btn){
  if(busy)return;busy=true;btn&&btn.classList.add('dn');
  bubble('u',FAQ[i][0]);
  var a=bubble('a','<span class="dots"><i></i><i></i><i></i></span>');
  setTimeout(function(){
    var t=FAQ[i][1],n=0;a.textContent='';
    (function w(){n+=reduce?t.length:2;a.textContent=t.slice(0,n);msgs.scrollTop=msgs.scrollHeight;if(n<t.length)setTimeout(w,22);else busy=false})();
  },900);
}
var faqIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){faqIO.disconnect();ask(0,qsEl.children[0])}})},{threshold:.5});
faqIO.observe($('#chat'));

/* ================= LOOP ================= */
function loop(t){
  var y=scrollY,v=y-lastY;lastY=y;sv+=(Math.min(Math.abs(v),60)-sv)*.1;
  rails.forEach(function(r){
    if(!r.w)return;
    r.x+=r.dir*(.5+sv*.18);
    if(r.x<=-r.w)r.x+=r.w;if(r.x>0)r.x-=r.w;
    r.tr.style.transform='translate3d('+r.x+'px,0,0)';
  });
  cpos+=cspeed*(1+sv*.1)*16;
  var n=items.length;
  items.forEach(function(it,i){var o=((cpos+i/n)%1+1)%1;it.style.offsetDistance=(o*100)+'%'});
  if(!intro.classList.contains('out'))return requestAnimationFrame(loop);
  spy();tlUpdate();requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.addEventListener('scroll',function(){spy();tlUpdate()},{passive:true});
})();
