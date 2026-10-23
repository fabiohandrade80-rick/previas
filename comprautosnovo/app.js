// Prévia Comprautos: estoque de exemplo, cartões, filtros e animações.
(function () {
  'use strict';

  var cars = [
    { id: 1, img: 'assets/v2/suv-azul.jpg', name: 'Hyundai Creta', version: '1.0 Turbo Platinum Aut.', year: 2023, km: 28400, city: 'Catanduva, SP', price: 129900, fipe: 136500, body: 'suv', gear: 'auto' },
    { id: 2, img: 'assets/v2/sedan-prata.jpg', name: 'Toyota Corolla', version: '2.0 XEi Flex Aut.', year: 2021, km: 46200, city: 'Ribeirão Preto, SP', price: 118500, fipe: 121300, body: 'sedan', gear: 'auto' },
    { id: 3, img: 'assets/v2/hatch-vermelho.jpg', name: 'Volkswagen Polo', version: '1.0 TSI Highline Aut.', year: 2022, km: 31000, city: 'São José do Rio Preto, SP', price: 89900, fipe: 94200, body: 'hatch', gear: 'auto' },
    { id: 4, img: 'assets/v2/picape-grafite.jpg', name: 'Toyota Hilux', version: '2.8 SRV 4x4 Diesel Aut.', year: 2020, km: 88000, city: 'Barretos, SP', price: 219000, fipe: 226800, body: 'picape', gear: 'auto' },
    { id: 5, img: 'assets/v2/suv-preto.jpg', name: 'Jeep Commander', version: '2.0 Overland 4x4 Diesel', year: 2023, km: 22500, city: 'São Paulo, SP', price: 219900, fipe: 224100, body: 'suv', gear: 'auto' },
    { id: 6, img: 'assets/v2/hatch-branco.jpg', name: 'Chevrolet Onix', version: '1.0 LT Flex Manual', year: 2021, km: 52300, city: 'Catanduva, SP', price: 67900, fipe: 69800, body: 'hatch', gear: 'manual' },
    { id: 7, img: 'assets/v2/hero.jpg', name: 'Volkswagen T-Cross', version: '1.4 TSI Highline Aut.', year: 2022, km: 35800, city: 'Araraquara, SP', price: 132900, fipe: 131000, body: 'suv', gear: 'auto' },
    { id: 8, img: 'assets/v2/sedan-prata.jpg', name: 'Honda City', version: '1.5 EXL Sedan CVT', year: 2022, km: 40100, city: 'Bauru, SP', price: 104900, fipe: 108700, body: 'sedan', gear: 'auto' }
  ];

  var brl = function (n) { return 'R$ ' + Math.round(n).toLocaleString('pt-BR'); };
  var monthly = function (price, n) { var r = 0.0169; return price * 0.7 * r / (1 - Math.pow(1 + r, -n)); };
  var heart = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';

  var favs = [];
  try { favs = JSON.parse(localStorage.getItem('ca-favs') || '[]'); } catch (e) { favs = []; }
  function saveFavs() { try { localStorage.setItem('ca-favs', JSON.stringify(favs)); } catch (e) {} }
  function updateFavCount() {
    document.querySelectorAll('[data-fav-count]').forEach(function (el) {
      el.textContent = favs.length;
      if (favs.length) el.removeAttribute('data-zero'); else el.setAttribute('data-zero', '');
    });
  }

  function card(c) {
    var pct = Math.round((1 - c.price / c.fipe) * 100);
    var badge = pct > 0 ? '<span class="badge good">' + pct + '% abaixo da FIPE</span>' : '<span class="badge">Na média da FIPE</span>';
    var on = favs.indexOf(c.id) > -1;
    return '<article class="car reveal" data-id="' + c.id + '" data-body="' + c.body + '" data-gear="' + c.gear + '" data-good="' + (pct > 0) + '">' +
      '<a class="car-media" href="veiculo.html" data-car-link>' +
        '<img src="' + c.img + '" alt="' + c.name + ' ' + c.year + '" loading="lazy">' + badge +
      '</a>' +
      '<button class="fav" type="button" aria-label="Favoritar ' + c.name + '" aria-pressed="' + on + '">' + heart + '</button>' +
      '<a class="car-body" href="veiculo.html" data-car-link style="color:inherit">' +
        '<span class="car-title">' + c.name + '</span>' +
        '<span class="car-meta">' + c.version + '</span>' +
        '<span class="car-meta">' + c.year + ' · ' + c.km.toLocaleString('pt-BR') + ' km · ' + c.city + '</span>' +
        '<span class="car-price"><strong>' + brl(c.price) + '</strong><span>FIPE ' + brl(c.fipe) + '</span></span>' +
        '<span class="car-month">ou <b>' + brl(monthly(c.price, 48)) + '/mês</b> com 30% de entrada</span>' +
      '</a>' +
    '</article>';
  }

  document.querySelectorAll('[data-cars]').forEach(function (box) {
    var list = cars;
    var pick = box.getAttribute('data-cars');
    if (pick) list = pick.split(',').map(function (id) { return cars.filter(function (c) { return c.id === Number(id); })[0]; });
    box.innerHTML = list.map(card).join('');
  });

  // Favoritos com animação
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.fav');
    if (!btn) return;
    var id = Number(btn.closest('.car').getAttribute('data-id'));
    var i = favs.indexOf(id);
    if (i > -1) favs.splice(i, 1); else favs.push(id);
    btn.setAttribute('aria-pressed', String(i === -1));
    btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
    saveFavs(); updateFavCount();
  });
  updateFavCount();

  // Foto do cartão "voa" até a galeria do veículo (View Transitions entre páginas)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-car-link]');
    if (!link) return;
    var img = link.closest('.car').querySelector('.car-media img');
    if (img) img.style.viewTransitionName = 'car-photo';
  });
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.car-media img').forEach(function (img) { img.style.viewTransitionName = ''; });
  });

  // Cabeçalho ganha fundo ao rolar
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Entrada suave ao rolar
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function observe(root) {
    (root || document).querySelectorAll('.reveal:not(.is-in)').forEach(function (el) {
      var sib = Array.prototype.indexOf.call(el.parentElement.children, el);
      if (el.classList.contains('car') || el.classList.contains('moment')) el.style.setProperty('--d', (sib % 4) * 80 + 'ms');
      if (io) io.observe(el); else el.classList.add('is-in');
    });
  }
  observe();

  // Abas comprar / vender com indicador deslizante
  var seg = document.querySelector('.seg');
  if (seg) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var tab = b.getAttribute('data-tab');
      seg.setAttribute('data-active', tab);
      seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      document.querySelectorAll('.panel').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== tab; });
    });
  }

  // Placa digitando sozinha na seção Vender
  var typing = document.querySelector('[data-typing]');
  if (typing && io) {
    var plateIo = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      plateIo.disconnect();
      var text = typing.getAttribute('data-typing'), i = 0;
      typing.value = '';
      var t = setInterval(function () {
        typing.value = text.slice(0, ++i);
        if (i >= text.length) {
          clearInterval(t);
          var f = document.querySelector('[data-found]');
          if (f) f.classList.add('is-in');
        }
      }, 140);
    }, { threshold: 0.6 });
    plateIo.observe(typing);
  }

  // Filtros da busca com saída animada dos cartões
  var results = document.querySelector('[data-results]');
  if (results) {
    var state = { body: null, gear: null, good: false };
    var countEl = document.querySelector('[data-count]');
    function apply() {
      var shown = 0;
      results.querySelectorAll('.car').forEach(function (el) {
        var ok = (!state.body || el.getAttribute('data-body') === state.body) &&
                 (!state.gear || el.getAttribute('data-gear') === state.gear) &&
                 (!state.good || el.getAttribute('data-good') === 'true');
        if (ok) {
          shown++;
          el.classList.add('is-in');
          if (el.hidden || el.classList.contains('is-out')) {
            el.hidden = false; el.classList.add('is-out');
            setTimeout(function () { el.classList.remove('is-out'); }, 20);
          }
        } else if (!el.hidden) {
          el.classList.add('is-out');
          setTimeout(function () { if (el.classList.contains('is-out')) el.hidden = true; }, 340);
        }
      });
      if (countEl) countEl.textContent = shown;
      var empty = document.querySelector('[data-empty]');
      if (empty) empty.hidden = shown > 0;
    }
    document.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-filter'), val = b.getAttribute('data-value');
        state[key] = state[key] === val ? null : val;
        document.querySelectorAll('[data-filter="' + key + '"]').forEach(function (x) {
          x.setAttribute('aria-pressed', String(state[key] === x.getAttribute('data-value')));
        });
        apply();
      });
    });
    var good = document.querySelector('[data-good-toggle]');
    if (good) good.addEventListener('change', function () { state.good = good.checked; apply(); });
    var opener = document.querySelector('.filter-open');
    if (opener) opener.addEventListener('click', function () {
      var f = document.querySelector('.filters');
      var open = f.classList.toggle('is-open');
      opener.setAttribute('aria-expanded', String(open));
    });
    apply();
  }

  // Galeria com troca suave
  var stage = document.querySelector('.stage img');
  document.querySelectorAll('.thumbs button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-current') === 'true') return;
      document.querySelectorAll('.thumbs button').forEach(function (x) { x.setAttribute('aria-current', String(x === b)); });
      stage.classList.add('is-leaving');
      setTimeout(function () {
        stage.src = b.getAttribute('data-src');
        stage.style.transformOrigin = b.getAttribute('data-pos') || '50% 50%';
        stage.style.transform = 'scale(' + (b.getAttribute('data-zoom') || 1) + ')';
        stage.classList.remove('is-leaving');
      }, 220);
    });
  });

  // Barra de comparação com a FIPE enche ao aparecer
  document.querySelectorAll('.meter').forEach(function (m) {
    if (!io) { m.classList.add('is-in'); return; }
    var mo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { m.classList.add('is-in'); mo.disconnect(); } }, { threshold: 0.6 });
    mo.observe(m);
  });

  // Simulador: indicador desliza e o valor conta até o novo número
  var terms = document.querySelector('.terms');
  if (terms) {
    var price = Number(terms.getAttribute('data-price'));
    var out = document.querySelector('[data-installment]');
    var label = document.querySelector('[data-months-label]');
    var ind = terms.querySelector('.terms-ind');
    var current = monthly(price, 48);
    var raf;
    function tween(to) {
      var from = current, start = performance.now(), dur = 500;
      cancelAnimationFrame(raf);
      (function step(now) {
        var t = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - t, 3);
        current = from + (to - from) * e;
        out.textContent = brl(current);
        if (t < 1) raf = requestAnimationFrame(step);
      })(start);
    }
    terms.querySelectorAll('button').forEach(function (b, i) {
      b.addEventListener('click', function () {
        var n = Number(b.getAttribute('data-months'));
        terms.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        ind.style.transform = 'translateX(' + (i * 100) + '%)';
        label.textContent = n + ' parcelas de';
        tween(monthly(price, n));
      });
    });
    out.textContent = brl(current);
  }
})();
