(function(){
  var b=document.querySelector('.al-burger'),d=document.querySelector('.al-drawer');
  if(b&&d)b.addEventListener('click',function(){var o=d.classList.toggle('is-open');b.setAttribute('aria-expanded',o)});
  document.querySelectorAll('form[data-demo]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
    var ok=f.querySelector('.al-ok');if(ok){ok.classList.add('is-on');ok.scrollIntoView({behavior:'smooth',block:'center'})}
    f.querySelectorAll('input,textarea').forEach(function(i){i.value=''})})});
})();