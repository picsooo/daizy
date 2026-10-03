(function(){
  // Menu mobile
  var b=document.querySelector('.dz-burger'),d=document.querySelector('.dz-drawer');
  if(b&&d){b.addEventListener('click',function(){var o=d.classList.toggle('is-open');b.setAttribute('aria-expanded',o)})}

  // Formulaires factices
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=f.querySelector('.dz-ok');
      if(ok){ok.classList.add('is-on');ok.scrollIntoView({behavior:'smooth',block:'center'})}
      f.querySelectorAll('input,select,textarea').forEach(function(i){if(i.type!=='checkbox'&&i.type!=='radio')i.value=''});
    });
  });

  // Chrono de cuisson (temps lus sur les sachets)
  var t=document.querySelector('[data-timer]');if(!t)return;
  var TIMES={four:{min:20,max:25,label:'Au four'},poele:{min:3,max:5,label:'À la poêle'}};
  var prod='nuggets',mode='poele',iv=null,left=0;
  var clock=t.querySelector('.dz-clock-n'),sub=t.querySelector('.dz-clock small'),go=t.querySelector('[data-go]');
  function fmt(s){var m=Math.floor(s/60),x=s%60;return m+':'+(x<10?'0':'')+x}
  function reset(){clearInterval(iv);iv=null;var T=TIMES[mode];left=T.max*60;clock.textContent=fmt(left);
    sub.textContent=T.label+' : '+T.min+' à '+T.max+' minutes';go.textContent='Lancer le chrono'}
  t.querySelectorAll('[data-prod]').forEach(function(x){x.addEventListener('click',function(){
    t.querySelectorAll('[data-prod]').forEach(function(y){y.setAttribute('aria-pressed',y===x)});prod=x.dataset.prod;reset()})});
  t.querySelectorAll('[data-mode]').forEach(function(x){x.addEventListener('click',function(){
    t.querySelectorAll('[data-mode]').forEach(function(y){y.setAttribute('aria-pressed',y===x)});mode=x.dataset.mode;reset()})});
  go.addEventListener('click',function(){
    if(iv){reset();return}
    go.textContent='Arrêter';
    // démonstration accélérée : 1 seconde = 1 minute
    iv=setInterval(function(){left-=60;if(left<=0){left=0;clearInterval(iv);iv=null;clock.textContent='Prêt !';go.textContent='Recommencer';return}clock.textContent=fmt(left)},1000);
  });
  reset();
})();
