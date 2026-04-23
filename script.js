document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',e=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

const revealItems=document.querySelectorAll('.reveal');
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.16,rootMargin:'0px 0px -40px 0px'});

revealItems.forEach(item=>revealObserver.observe(item));

document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const track=carousel.querySelector('.carousel-track');
  const slides=[...carousel.querySelectorAll('.post-slide')];
  const prev=carousel.querySelector('.prev');
  const next=carousel.querySelector('.next');
  const dotsWrap=carousel.querySelector('.carousel-dots');

  if(!track || slides.length===0) return;

  const dots=slides.map((_,index)=>{
    const dot=document.createElement('button');
    dot.type='button';
    dot.setAttribute('aria-label',`اذهب إلى الصورة ${index+1}`);
    dot.addEventListener('click',()=>{
      slides[index].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const getActiveIndex=()=>{
    const slideWidth=track.clientWidth || 1;
    return Math.round(track.scrollLeft/slideWidth);
  };

  const setActiveDot=()=>{
    const active=Math.max(0,Math.min(slides.length-1,getActiveIndex()));
    dots.forEach((dot,index)=>dot.classList.toggle('active',index===active));
  };

  const move=direction=>{
    const active=getActiveIndex();
    const nextIndex=(active+direction+slides.length)%slides.length;
    slides[nextIndex].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
  };

  prev?.addEventListener('click',()=>move(-1));
  next?.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',()=>{
    window.requestAnimationFrame(setActiveDot);
  });
  window.addEventListener('resize',setActiveDot);
  setActiveDot();
});
