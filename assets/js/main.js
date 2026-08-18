/* La Maison du Carac.
   Aucun ecouteur de scroll : les apparitions passent par IntersectionObserver,
   et les effets lies au defilement tournent dans une seule boucle rAF, ouverte
   uniquement pendant que l element concerne est a l ecran.                    */
(function () {
  'use strict';

  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var avecIO = 'IntersectionObserver' in window;

  /* -- 1. apparitions --------------------------------------------------- */

  var blocs = document.querySelectorAll('[data-reveal]');
  if (!avecIO) {
    blocs.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var obsApparition = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        obsApparition.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
    blocs.forEach(function (el) { obsApparition.observe(el); });
  }

  /* -- 2. barre de navigation : transparente sur le hero, pleine ensuite -- */

  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero');
  if (avecIO && nav && hero) {
    new IntersectionObserver(function (entrees) {
      nav.classList.toggle('is-solide', !entrees[0].isIntersecting);
    }, { rootMargin: '-88% 0px 0px 0px', threshold: 0 }).observe(hero);
  }

  /* -- 3. boucle unique pour les effets lies au defilement ---------------- */

  var actifs = [];
  var image = null;

  function boucle() {
    for (var i = 0; i < actifs.length; i++) actifs[i]();
    image = actifs.length ? requestAnimationFrame(boucle) : null;
  }
  function ouvrir(maj) {
    if (actifs.indexOf(maj) === -1) actifs.push(maj);
    if (!image) image = requestAnimationFrame(boucle);
  }
  function fermer(maj) {
    var i = actifs.indexOf(maj);
    if (i !== -1) actifs.splice(i, 1);
  }
  function lier(cible, maj) {
    if (reduit || !avecIO) return;
    maj();
    new IntersectionObserver(function (entrees) {
      if (entrees[0].isIntersecting) ouvrir(maj); else fermer(maj);
    }, { rootMargin: '12% 0px 12% 0px' }).observe(cible);
  }

  /* -- 4. hero : le media s eloigne, le texte remonte et s efface --------- */

  var heroMedia = document.querySelector('.hero__media');
  var heroTexte = document.querySelector('.hero__copy');
  if (hero && heroMedia && heroTexte) {
    lier(hero, function () {
      var h = hero.offsetHeight || 1;
      var p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / h));
      heroMedia.style.transform = 'translate3d(0,' + (p * 9).toFixed(2) + '%,0) scale(' + (1 + p * 0.09).toFixed(4) + ')';
      heroTexte.style.transform = 'translate3d(0,' + (p * -30).toFixed(1) + 'px,0)';
      heroTexte.style.opacity = Math.max(0, 1 - p * 1.4).toFixed(3);
    });
  }

  /* -- 5. la vitrine : travelling lateral pendant que la scene reste collee */

  var pan = document.querySelector('.pan');
  var piste = pan && pan.querySelector('.pan__track');
  var cadre = pan && pan.querySelector('.pan__scroller');
  var mqPan = window.matchMedia('(min-width: 900px)');
  var course = 0;

  function majPan() {
    if (!course) return;
    var haut = pan.getBoundingClientRect().top;
    var trajet = pan.offsetHeight - window.innerHeight;
    if (trajet <= 0) return;
    var p = Math.min(1, Math.max(0, -haut / trajet));
    piste.style.transform = 'translate3d(' + (-p * course).toFixed(1) + 'px,0,0)';
  }

  function mesurerPan() {
    course = Math.max(0, piste.scrollWidth - cadre.clientWidth);
    // la hauteur de la section fixe le rapport entre defilement vertical
    // et deplacement horizontal : on vise un rapport proche de 1 pour 1
    pan.style.height = (window.innerHeight + course * 1.15) + 'px';
    majPan();
  }

  function reglerPan() {
    var epingler = mqPan.matches && !reduit && avecIO;
    pan.classList.toggle('is-pinned', epingler);
    if (!epingler) {
      pan.style.height = '';
      piste.style.transform = '';
      course = 0;
      return;
    }
    mesurerPan();
  }

  if (pan && piste && cadre) {
    reglerPan();
    mqPan.addEventListener('change', reglerPan);
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        if (pan.classList.contains('is-pinned')) mesurerPan();
      }).observe(document.documentElement);
    }
    lier(pan, majPan);
  }

  /* -- 6. nous trouver : legere parallaxe sur la photo de la boutique ----- */

  var lieu = document.querySelector('.lieu');
  var lieuMedia = document.querySelector('.lieu__media');
  if (lieu && lieuMedia && window.matchMedia('(min-width: 901px)').matches) {
    lier(lieu, function () {
      var r = lieu.getBoundingClientRect();
      var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      p = Math.max(-1, Math.min(1, p));   // hors ecran, on borne au lieu de deriver
      lieuMedia.style.transform = 'translate3d(0,' + (p * -5).toFixed(2) + '%,0)';
    });
  }

  /* -- 7. videos : jouees seulement quand elles sont visibles ------------- */

  document.querySelectorAll('video').forEach(function (v) {
    if (reduit) { v.removeAttribute('autoplay'); v.pause(); return; }
    if (!avecIO) return;
    new IntersectionObserver(function (entrees) {
      if (entrees[0].isIntersecting) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    }, { threshold: 0.1 }).observe(v);
  });
})();
