(function(){
  /* ---------- Son (créé dans le navigateur, coupé par défaut) ---------- */
  var ctx=null,soundOn=false,sBtn=document.querySelector('[data-sound]'),sLbl=document.querySelector('[data-sound-label]');
  function ac(){if(!ctx){var C=window.AudioContext||window.webkitAudioContext;if(C)ctx=new C()}if(ctx&&ctx.state==='suspended')ctx.resume();return ctx}
  sBtn.addEventListener('click',function(){soundOn=!soundOn;if(soundOn)ac();sBtn.setAttribute('aria-pressed',soundOn);sLbl.textContent=soundOn?'Son activé':'Son coupé';if(soundOn)crunch()});
  function crunch(){
    if(!soundOn)return;var c=ac();if(!c)return;var t=c.currentTime;
    for(var g=0;g<5;g++){
      var len=0.03+Math.random()*0.05,buf=c.createBuffer(1,Math.floor(c.sampleRate*len),c.sampleRate),d=buf.getChannelData(0);
      for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
      var src=c.createBufferSource();src.buffer=buf;
      var f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1200+Math.random()*2600;f.Q.value=0.9;
      var v=c.createGain();v.gain.value=0.55;
      src.connect(f);f.connect(v);v.connect(c.destination);src.start(t+g*0.035+Math.random()*0.02);
    }
  }
  function ding(){
    if(!soundOn)return;var c=ac();if(!c)return;var t=c.currentTime;
    [0,0.18,0.36].forEach(function(o){var os=c.createOscillator(),v=c.createGain();os.type='square';os.frequency.value=1760;v.gain.setValueAtTime(0.0001,t+o);v.gain.exponentialRampToValueAtTime(0.12,t+o+0.01);v.gain.exponentialRampToValueAtTime(0.0001,t+o+0.12);os.connect(v);v.connect(c.destination);os.start(t+o);os.stop(t+o+0.14)});
  }

  var top=document.querySelector('.mx-top');addEventListener('scroll',function(){top.classList.toggle('is-solid',scrollY>innerHeight*0.8)},{passive:true});

  /* ---------- Croque l'écran ---------- */
  var field=document.querySelector('[data-field]'),bits=[].slice.call(document.querySelectorAll('.mx-bit')),
      countEl=document.querySelector('[data-count]'),reveal=document.querySelector('[data-reveal]'),done=0;
  function place(){
    var W=field.clientWidth,H=field.clientHeight;
    bits.forEach(function(cv){
      var w=Math.min(W*cv.dataset.w/100*(W>700?0.55:1),240);
      cv.style.width=w+'px';
      cv.style.left=(cv.dataset.x/100*W)+'px';cv.style.top=(cv.dataset.y/100*H)+'px';
      cv.style.transform='rotate('+cv.dataset.r+'deg)';
    });
  }
  bits.forEach(function(cv){
    var img=new Image();img.onload=function(){cv.width=img.naturalWidth;cv.height=img.naturalHeight;cv.getContext('2d').drawImage(img,0,0);cv._bites=0};img.src=cv.dataset.src;
    cv.addEventListener('pointerdown',function(e){e.preventDefault();var r=cv.getBoundingClientRect();bite(cv,e.clientX,e.clientY,r)});
    cv.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();var r=cv.getBoundingClientRect();bite(cv,r.left+r.width*Math.random(),r.top+r.height*Math.random(),r)}});
  });
  function bite(cv,cx,cy,rect){
    if(cv.classList.contains('is-gone')||!cv.width)return;
    var g=cv.getContext('2d'),W=cv.width,H=cv.height;
    // point touché, ramené dans le repère du canvas (en tenant compte de la rotation)
    var mx=rect.left+rect.width/2,my=rect.top+rect.height/2,a=-cv.dataset.r*Math.PI/180,
        dx=cx-mx,dy=cy-my,rx=dx*Math.cos(a)-dy*Math.sin(a),ry=dx*Math.sin(a)+dy*Math.cos(a),
        sc=W/cv.offsetWidth,px=W/2+rx*sc,py=H/2+ry*sc;
    // on cherche le bord du morceau dans la direction du toucher
    var data=g.getImageData(0,0,W,H).data,vx=px-W/2,vy=py-H/2,L=Math.hypot(vx,vy)||1;vx/=L;vy/=L;
    if(L<2){var an=Math.random()*6.28;vx=Math.cos(an);vy=Math.sin(an)}
    var ex=W/2,ey=H/2;
    for(var s=0;s<Math.max(W,H);s+=2){var x=Math.round(W/2+vx*s),y=Math.round(H/2+vy*s);if(x<0||y<0||x>=W||y>=H)break;if(data[(y*W+x)*4+3]>40){ex=x;ey=y}}
    var R=Math.min(W,H)*0.34;
    g.save();g.globalCompositeOperation='destination-out';
    g.beginPath();g.arc(ex+vx*R*0.35,ey+vy*R*0.35,R,0,7);g.fill();
    // petites dents sur le bord de la morsure
    var n=7;for(var i=0;i<n;i++){var t=Math.atan2(-vy,-vx)+(i-(n-1)/2)*0.32;g.beginPath();g.arc(ex+vx*R*0.35+Math.cos(t)*R,ey+vy*R*0.35+Math.sin(t)*R,R*0.16,0,7);g.fill()}
    g.restore();
    crumbs(cx,cy);crunch();
    if(navigator.vibrate)navigator.vibrate(18);
    cv._bites=(cv._bites||0)+1;
    if(cv._bites>=3){cv.classList.add('is-gone');cv.style.transform+=' scale(.4)';done++;countEl.textContent=done;if(done===bits.length)setTimeout(finish,450)}
  }
  function crumbs(x,y){
    for(var i=0;i<14;i++){
      var c=document.createElement('span');c.className='mx-crumb';c.style.left=x+'px';c.style.top=y+'px';
      var s=4+Math.random()*7;c.style.width=c.style.height=s+'px';c.style.background=['#E3A24A','#C9812E','#F2C46A'][i%3];
      document.body.appendChild(c);
      var ang=Math.random()*Math.PI*2,dist=40+Math.random()*90;
      c.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+Math.cos(ang)*dist+'px,'+(Math.sin(ang)*dist+120)+'px) rotate('+(Math.random()*400)+'deg)',opacity:0}],{duration:700+Math.random()*400,easing:'cubic-bezier(.2,.6,.4,1)'}).onfinish=function(){this.effect.target.remove()};
    }
  }
  function finish(){field.style.visibility='hidden';document.querySelector('.mx-crunch-text').style.visibility='hidden';reveal.hidden=false;crunch()}
  place();addEventListener('resize',place);

  /* ---------- Gamme ---------- */
  var P={
    nug:{n:'Nuggets de poulet',ar:'نوقتس الدجاج',t:'Aux filets de poulet, panure extra croustillante. Le classique des assiettes du soir.',w:'300 g',img:'../img/pack_nuggets.webp',pack:true,alt:'Sachet Dayzy Nuggets de poulet'},
    bat:{n:'Bâtonnets de poulet',ar:'أصابع الدجاج',t:'Extra croustillants, faciles à attraper. Dans la boîte à goûter ou sur une salade César.',w:'300 g',img:'../img/lunchbox-batonnets.webp',pack:false,alt:'Bâtonnets de poulet Dayzy et leur sachet'},
    bur:{n:'Burger de poulet',ar:'برقر الدجاج',t:'Un steak de poulet pané, un pain, une feuille de salade. Le burger maison sans effort.',w:'800 g',img:'../img/lunchbox-burger.webp',pack:false,alt:'Burger de poulet Dayzy et son sachet'}
  };
  var sec=document.querySelector('.mx-range'),pimg=document.querySelector('[data-p-img]');
  pimg.classList.add('is-pack');
  document.querySelectorAll('.mx-switch button').forEach(function(b){b.addEventListener('click',function(){
    var k=b.dataset.k,p=P[k];
    document.querySelectorAll('.mx-switch button').forEach(function(x){x.setAttribute('aria-selected',x===b)});
    sec.dataset.prod=k;
    document.querySelector('[data-p-name]').textContent=p.n;document.querySelector('[data-p-ar]').textContent=p.ar;
    document.querySelector('[data-p-txt]').textContent=p.t;document.querySelector('[data-p-w]').textContent=p.w;
    pimg.classList.add('is-out');
    setTimeout(function(){pimg.src=p.img;pimg.alt=p.alt;pimg.classList.toggle('is-pack',p.pack);pimg.classList.remove('is-out')},250);
  })});

  /* ---------- Minuteur ---------- */
  var M={poele:5,four:25},mode='poele',left=M.poele*60,iv=null,clock=document.querySelector('[data-clock]'),ready=document.querySelector('[data-ready]');
  function show(){var m=Math.floor(left/60),s=left%60;clock.textContent=m+':'+(s<10?'0':'')+s}
  function stop(){clearInterval(iv);iv=null}
  function reset(){stop();left=M[mode]*60;ready.classList.remove('is-on');show()}
  document.querySelectorAll('[data-m]').forEach(function(b){b.addEventListener('click',function(){
    document.querySelectorAll('[data-m]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});mode=b.dataset.m;reset()})});
  document.querySelector('[data-start]').addEventListener('click',function(){
    if(iv){stop();return}ready.classList.remove('is-on');if(left<=0)left=M[mode]*60;
    iv=setInterval(function(){left-=60;if(left<=0){left=0;stop();show();ready.classList.add('is-on');ding();return}show()},1000);
  });
  document.querySelector('[data-reset]').addEventListener('click',reset);
  document.querySelector('[data-plus]').addEventListener('click',function(){left+=60;ready.classList.remove('is-on');show()});
  show();
})();
