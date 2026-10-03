const WHATSAPP_NUMBER = '553484471024'; // WhatsApp pessoal da Lívia.

const waUrl = (message='Oi, Lívia! Vim pelo seu site.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Ano do rodapé
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Cabeçalho: transparente sobre o hero e sólido durante a navegação
const siteHeader = document.querySelector('.site-header');
function updateHeader(){
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 48);
}
window.addEventListener('scroll', updateHeader, {passive:true});
updateHeader();

// Menu imersivo
const menuBtn = document.querySelector('.menu-button');
const menuPanel = document.querySelector('#menuPanel');
function setMenu(open){
  menuBtn?.setAttribute('aria-expanded', String(open));
  menuPanel?.setAttribute('aria-hidden', String(!open));
  menuPanel?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
menuPanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if(e.key === 'Escape') setMenu(false); });

// Universos expansíveis
const universeCards = [...document.querySelectorAll('[data-universe]')];
function closeUniverse(card){
  const trigger = card.querySelector('.universe-trigger');
  const panel = card.querySelector('.universe-panel');
  card.classList.remove('is-open');
  trigger.setAttribute('aria-expanded','false');
  panel.setAttribute('aria-hidden','true');
  panel.style.maxHeight = '0px';
}
function openUniverse(card){
  const trigger = card.querySelector('.universe-trigger');
  const panel = card.querySelector('.universe-panel');
  card.classList.add('is-open');
  trigger.setAttribute('aria-expanded','true');
  panel.setAttribute('aria-hidden','false');
  panel.style.maxHeight = panel.scrollHeight + 'px';
  setTimeout(() => {
    card.scrollIntoView({behavior:'smooth',block:'start'});
  }, 160);
}
universeCards.forEach(card => {
  const trigger = card.querySelector('.universe-trigger');
  trigger.addEventListener('click', () => {
    const open = card.classList.contains('is-open');
    universeCards.forEach(c => { if(c !== card) closeUniverse(c); });
    open ? closeUniverse(card) : openUniverse(card);
  });
});
window.addEventListener('resize', () => {
  universeCards.filter(c => c.classList.contains('is-open')).forEach(c => {
    c.querySelector('.universe-panel').style.maxHeight = c.querySelector('.universe-panel').scrollHeight + 'px';
  });
});

// Reveal no scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12, rootMargin:'0px 0px -5%'});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Progresso + parallax delicado
const progress = document.querySelector('.scroll-progress span');
const parallaxImg = document.querySelector('.parallax-media img');
function onScroll(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - innerHeight;
  const pct = max > 0 ? (scrollY / max) * 100 : 0;
  if(progress) progress.style.width = pct + '%';
  if(parallaxImg && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const rect = parallaxImg.parentElement.getBoundingClientRect();
    const offset = Math.max(-26, Math.min(26, (innerHeight/2 - (rect.top + rect.height/2)) * .045));
    parallaxImg.style.setProperty('--parallax-y', `${offset}px`);
  }
}
addEventListener('scroll', onScroll, {passive:true});
onScroll();

// Antes / depois
const baRange = document.querySelector('.ba-range');
const baStage = document.querySelector('.before-after');
function updateBA(value){
  if(baStage) baStage.style.setProperty('--ba', `${value}%`);
}
baRange?.addEventListener('input', e => updateBA(e.target.value));
updateBA(baRange?.value || 52);

// Links de WhatsApp
function attachWhatsApp(){
  document.querySelectorAll('.js-wa').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const msg = el.dataset.message || 'Oi, Lívia! Vim pelo seu site.';
      window.open(waUrl(msg), '_blank', 'noopener');
    });
  });
}
attachWhatsApp();

// Lista de espera: nesta versão estática, envia os dados para o WhatsApp.
document.querySelector('#waitlistForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const name = data.get('name')?.trim();
  const instagram = data.get('instagram')?.trim() || 'não informado';
  const phone = data.get('phone')?.trim() || 'não informado';
  const message = `Oi, Lívia! Quero entrar na lista de espera dos presets.\n\nNome: ${name}\nInstagram: ${instagram}\nWhatsApp: ${phone}`;
  window.open(waUrl(message), '_blank', 'noopener');
});
