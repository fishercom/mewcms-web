import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-300-italic.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/jost/latin-300.css';
import '@fontsource/jost/latin-400.css';
import '@fontsource/jost/latin-500.css';
import './styles/style.css';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.getElementById('hero');
const header = document.querySelector('.site-header');
const video = hero.querySelector('.hero-video');

/* Header turns translucent once the hero has scrolled away */
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('solid', !entry.isIntersecting);
  }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
}

/* Hero: the video loads after the page has painted; the slogan appears when it ends.
   With reduced motion the poster stays and the slogan shows at once. */
let fallback;
const reveal = () => {
  clearTimeout(fallback);
  hero.classList.add('revealed');
};

function startHero() {
  if (reduceMotion || !video) {
    reveal();
    return;
  }
  video.addEventListener('ended', reveal, { once: true });
  video.addEventListener('error', reveal, { once: true });
  video.src = video.dataset.src;
  const playing = video.play();
  if (playing && playing.catch) playing.catch(reveal);
  // Never keep the slogan hidden for long, even on a slow connection
  fallback = setTimeout(reveal, 9000);
}

if (document.readyState === 'complete') startHero();
else window.addEventListener('load', startHero, { once: true });

/* Scroll reveal: blocks fade and rise in once, with a small stagger */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  const fold = window.innerHeight * 0.9;
  for (const el of document.querySelectorAll('.rv')) {
    if (el.getBoundingClientRect().top > fold) {
      el.classList.add('pending');
      io.observe(el);
    }
  }
}
