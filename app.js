const $ = (id) => document.getElementById(id);
const embedded = new URLSearchParams(location.search).get('embed') === '1';
if (embedded) document.documentElement.classList.add('embed');
let slides = [...window.SLIDES], index = 0, timer, changeTimer, requestId = 0;
let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
function schedule() {
  clearTimeout(timer);
  if (playing && !document.hidden && slides.length > 1) timer = setTimeout(() => show(index + 1), 4000);
  $('play').textContent = playing ? 'Pause' : 'Play';
  $('play').setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
}
function show(next, instant = false) {
  clearTimeout(timer); clearTimeout(changeTimer);
  const currentRequest = ++requestId;
  index = (next + slides.length) % slides.length;
  const slide = slides[index];
  $('count').textContent = `${String(index + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  const incoming = new Image();
  incoming.onload = () => {
    if (currentRequest !== requestId) return;
    const replace = () => {
      $('photo').src = slide.src; $('photo').alt = slide.alt;
      $('photo').classList.remove('fading'); $('error').hidden = true; schedule();
    };
    if (!instant && true && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $('photo').classList.add('fading'); changeTimer = setTimeout(replace,450);
    } else replace();
  };
  incoming.onerror = () => {
    if (currentRequest !== requestId) return;
    $('photo').classList.remove('fading'); $('error').hidden = false; schedule();
  };
  incoming.src = slide.src;
}
$('prev').onclick = () => show(index - 1);
$('next').onclick = () => show(index + 1);
$('play').onclick = () => { playing = !playing; schedule(); };
document.querySelector('.gallery').addEventListener('keydown', e => {
  if (e.target.tagName === 'BUTTON') return;
  if (e.key === 'ArrowRight') {e.preventDefault();show(index + 1);}
  if (e.key === 'ArrowLeft') {e.preventDefault();show(index - 1);}
  if (e.code === 'Space') {e.preventDefault();playing = !playing;schedule();}
});
document.addEventListener('visibilitychange', () => {if(document.hidden) clearTimeout(timer);else schedule();});
show(0,true);
