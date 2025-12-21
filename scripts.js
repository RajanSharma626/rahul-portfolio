// Navbar overlay open/close + toggle behavior
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('menuOverlay');
const toggle = document.querySelector('.toggle');

function openMenu(){
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  menuBtn.setAttribute('aria-expanded','true');
  menuBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu(){
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  menuBtn.setAttribute('aria-expanded','false');
  menuBtn.classList.remove('open');
  document.body.style.overflow = '';
}

menuBtn && menuBtn.addEventListener('click', ()=> openMenu());
closeBtn && closeBtn.addEventListener('click', ()=> closeMenu());
// close when clicking backdrop
const backdrop = document.querySelector('.menu-backdrop');
backdrop && backdrop.addEventListener('click', ()=> closeMenu());
// keyboard escape
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeMenu();
});

// toggle switch behavior
if(toggle){
  toggle.addEventListener('click', ()=>{
    const isOn = toggle.getAttribute('aria-checked') === 'true';
    toggle.setAttribute('aria-checked', (!isOn).toString());
  });
  toggle.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
  });
}

// ABOUT nav hover & click behaviour
const aboutLink = Array.from(document.querySelectorAll('.nav-link')).find(a=>a.textContent.trim().toUpperCase() === 'ABOUT');
const aboutLine = document.querySelector('.about-line');
const aboutSection = document.getElementById('about');
if(aboutLink && aboutLine && aboutSection){
  aboutLink.addEventListener('mouseenter', ()=> aboutLine.classList.add('active'))
  aboutLink.addEventListener('mouseleave', ()=> aboutLine.classList.remove('active'))

  aboutLink.addEventListener('click', (e)=>{
    e.preventDefault();
    closeMenu();
    aboutSection.scrollIntoView({behavior:'smooth'});
    aboutLine.classList.add('clicked');
    setTimeout(()=> aboutLine.classList.remove('clicked'), 1800);
  });
}

// --- GSAP-powered infinite marquee ---
document.addEventListener('DOMContentLoaded', ()=>{
  if(typeof gsap === 'undefined') return;
  const wraps = document.querySelectorAll('.marquee-wrap');
  wraps.forEach(wrap=>{
    const track = wrap.querySelector('.marquee-track');
    if(!track) return;

    // duplicate content for seamless looping
    track.innerHTML = track.innerHTML + track.innerHTML;
    const totalWidth = track.scrollWidth / 2;
    const speed = parseFloat(wrap.datasetSpeed) || 50; // px per second

    if(track.classList.contains('reverse')){
      // start offset so we can animate rightwards to 0
      track.style.transform = `translateX(${-totalWidth}px)`;
      const tween = gsap.to(track, {
        x: 0,
        ease: 'none',
        duration: totalWidth / speed,
        repeat: -1
      });

      wrap.addEventListener('mouseenter', ()=> tween.pause());
      wrap.addEventListener('mouseleave', ()=> tween.play());
    } else {
      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        duration: totalWidth / speed,
        repeat: -1
      });

      wrap.addEventListener('mouseenter', ()=> tween.pause());
      wrap.addEventListener('mouseleave', ()=> tween.play());
    }
  });
});

// small toast for contact demo
function showContactSuccess(){
  const el = document.createElement('div');
  el.className = 'contact-toast';
  el.textContent = 'Thanks — message sent';
  document.body.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('visible'));
  setTimeout(()=> el.classList.remove('visible'), 2200);
  setTimeout(()=> el.remove(), 2600);
}