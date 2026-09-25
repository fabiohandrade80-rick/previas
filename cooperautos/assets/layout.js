// Cooperautos — cabeçalho, rodapé e formulários compartilhados
// Cada página define <body data-root="../"> (ou "./" na raiz) e data-page="saude" etc.
(function () {
  var CONTATO = {
    telefone: "(11) 4509-5165",
    tel: "+551145095165",
    email: "contato@cooperautos.com.br",
    cnpj: "57.492.649/0001-94",
    endereco: "R. Jair Martins Mil Homens, 500 — Sala 815, São José do Rio Preto/SP — CEP 15.090-080"
  };
  window.COOPERAUTOS = CONTATO;

  var body = document.body;
  var root = body.getAttribute("data-root") || "./";
  var page = body.getAttribute("data-page") || "";

  var links = [
    ["saude", "Saúde"],
    ["seguros", "Seguros"],
    ["protecao-veicular", "Proteção Veicular"],
    ["automotivo", "Automotivo"]
  ];

  var nav = links.map(function (l) {
    return '<a href="' + root + l[0] + '/"' + (page === l[0] ? ' class="active"' : "") + ">" + l[1] + "</a>";
  }).join("");

  var header = document.createElement("header");
  header.className = "header";
  header.innerHTML =
    '<div class="container">' +
    '<a class="logo" href="' + root + '"><span class="logo-mark">C</span><span>Cooper<b>autos</b></span></a>' +
    '<nav class="nav" id="nav">' + nav +
    '<a class="btn btn-primary btn-sm" href="' + root + '#associe">Quero ser cooperado</a></nav>' +
    '<button class="nav-toggle" aria-label="Abrir menu" onclick="document.getElementById(\'nav\').classList.toggle(\'open\')">☰</button>' +
    "</div>";
  body.insertBefore(header, body.firstChild);

  var footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML =
    '<div class="container"><div class="cols">' +
    '<div><a class="logo" href="' + root + '"><span class="logo-mark">C</span><span>Cooper<b>autos</b></span></a>' +
    "<p style=\"margin-top:14px\">Cooperativa de consumo registrada na OCB. Consumo inteligente é fazer juntos.</p></div>" +
    "<div><h4>Linhas</h4>" + links.map(function (l) { return '<a href="' + root + l[0] + '/">' + l[1] + "</a>"; }).join("") + "</div>" +
    '<div><h4>Cooperativa</h4><a href="' + root + '#como-funciona">Como funciona</a><a href="' + root + '#associe">Seja cooperado</a><a href="' + root + '#quem-somos">Quem somos</a></div>' +
    '<div><h4>Fale conosco</h4><a href="tel:' + CONTATO.tel + '">' + CONTATO.telefone + '</a><a href="mailto:' + CONTATO.email + '">' + CONTATO.email + "</a></div>" +
    "</div>" +
    '<div class="legal">Cooperautos Cooperativa de Consumo Ltda · CNPJ ' + CONTATO.cnpj + " · " + CONTATO.endereco +
    "<br>Seguros intermediados por corretora habilitada na Susep. Coberturas, carências e condições conforme regulamento de cada produto e parceiro.</div>" +
    "</div>";
  body.appendChild(footer);

  var float = document.createElement("a");
  float.className = "float-cta";
  float.href = "tel:" + CONTATO.tel;
  float.textContent = "📞 Fale com a gente";
  body.appendChild(float);

  // Formulários: sem backend, abrem o e-mail já preenchido.
  document.querySelectorAll("form[data-assunto]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var dados = new FormData(form);
      var linhas = [];
      dados.forEach(function (v, k) { if (v) linhas.push(k + ": " + v); });
      var assunto = "[Site] " + form.getAttribute("data-assunto");
      window.location.href = "mailto:" + CONTATO.email +
        "?subject=" + encodeURIComponent(assunto) +
        "&body=" + encodeURIComponent(linhas.join("\n"));
    });
  });
})();
