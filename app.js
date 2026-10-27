const $ = (id) => document.getElementById(id);
const embedded = new URLSearchParams(location.search).get('embed') === '1';
if (embedded) document.documentElement.classList.add('embed');
let slides = [...window.SLIDES], index = 0, timer, requestId = 0;
let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;
function schedule() {
 clearTimeout(timer);
 if (playing && !document.hidden && slides.length > 1) timer = setTimeout(() => show(index + 1), 4000);
 $('play').textContent = playing ? 'Pause' : 'Play';
}
function show(next) {
 clearTimeout(timer);
 const currentRequest = ++requestId;
 index = (next + slides.length) % slides.length;
 const slide = slides[index];
 $('count').textContent = `${index + 1} / ${slides.length}`;
 const incoming = new Image();
 incoming.onload = () => {
  if (currentRequest !== requestId) return;
  $('photo').src = slide.src;
  $('photo').alt = slide.alt;
  $('error').hidden = true;
  schedule();
 };
 incoming.onerror = () => {
  if (currentRequest !== requestId) return;
  $('error').hidden = false; schedule();
 };
 incoming.src = slide.src;
}
$('prev').onclick = () => show(index - 1);
$('next').onclick = () => show(index + 1);
$('play').onclick = () => { playing = !playing; schedule(); };
document.querySelector('.gallery').addEventListener('keydown', e => {
 if (e.target.tagName === 'BUTTON') return;
 if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
 if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
 if (e.code === 'Space') { e.preventDefault(); playing = !playing; schedule(); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else schedule(); });
show(0);
