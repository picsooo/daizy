(function(){
  var btn=document.querySelector('[data-incubate]'),dayEl=document.querySelector('[data-day]'),egg=document.querySelector('[data-egg]'),
      crack=document.querySelector('[data-crack]'),top=document.querySelector('[data-top]'),chick=document.querySelector('[data-chick]'),
      msg=document.querySelector('[data-hatched]'),full=document.querySelector('[data-full]'),running=false;
  function reset(){egg.classList.remove('is-wobble','is-wobble2');crack.classList.remove('is-on');top.classList.remove('is-off');chick.classList.remove('is-out');full.style.opacity=1;msg.hidden=true;dayEl.textContent='J0'}
  btn.addEventListener('click',function(){
    if(running)return;reset();running=true;btn.disabled=true;var d=0;
    var iv=setInterval(function(){
      d++;dayEl.textContent='J'+d;
      if(d===14)egg.classList.add('is-wobble');
      if(d===18){egg.classList.remove('is-wobble');egg.classList.add('is-wobble2');crack.classList.add('is-on')}
      if(d>=21){clearInterval(iv);setTimeout(function(){egg.classList.remove('is-wobble2');full.style.opacity=0;top.classList.add('is-off');crack.classList.remove('is-on');
        setTimeout(function(){chick.classList.add('is-out');msg.hidden=false;btn.disabled=false;btn.textContent='Recommencer';running=false},250)},350)}
    },170);
  });
})();
