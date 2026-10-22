// Interações da prévia: abas comprar/vender e simulador de parcelas.
(function () {
  function showTab(tab) {
    document.querySelectorAll('[data-if]').forEach(function (el) {
      el.hidden = el.getAttribute('data-if') !== tab + 'Tab';
    });
    document.querySelectorAll('[data-action]').forEach(function (btn) {
      var active = btn.getAttribute('data-action') === (tab === 'buy' ? 'showBuy' : 'showSell');
      btn.setAttribute('aria-selected', String(active));
      btn.style.background = active ? '#0E45AB' : 'transparent';
      btn.style.color = active ? '#FFFFFF' : '#4B5873';
    });
  }
  document.querySelectorAll('[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTab(btn.getAttribute('data-action') === 'showBuy' ? 'buy' : 'sell');
    });
  });

  var price = 489900, rate = 0.0169;
  var termBtns = document.querySelectorAll('[data-months]');
  function pick(n) {
    var pmt = price * 0.7 * rate / (1 - Math.pow(1 + rate, -n));
    termBtns.forEach(function (b) {
      var active = Number(b.getAttribute('data-months')) === n;
      b.setAttribute('aria-pressed', String(active));
      b.style.background = active ? '#0E45AB' : '#FFFFFF';
      b.style.color = active ? '#FFFFFF' : '#0F172A';
      b.style.borderColor = active ? '#0E45AB' : '#E2E7F0';
    });
    var out = document.querySelector('[data-installment]');
    if (out) out.textContent = 'R$ ' + Math.round(pmt).toLocaleString('pt-BR');
    var months = document.querySelector('[data-months-label]');
    if (months) months.textContent = n + ' parcelas de';
  }
  termBtns.forEach(function (b) {
    b.addEventListener('click', function () { pick(Number(b.getAttribute('data-months'))); });
  });
})();
