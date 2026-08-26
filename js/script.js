/* ==========================================================================
   Cadastro de documentos — lógica da página
   Roda inteiramente no navegador, sem servidor.
   ========================================================================== */
(function () {
  "use strict";

  var formulario = document.getElementById("form-dados");
  var saida      = document.getElementById("resultado");
  var campoAno   = document.getElementById("ano");

  var nome      = document.getElementById("nome");
  var curso     = document.getElementById("curso");
  var matricula = document.getElementById("matricula");
  var cpf       = document.getElementById("cpf");

  if (campoAno) campoAno.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------- utilitários */

  function somenteDigitos(valor, max) {
    return String(valor || "").replace(/\D/g, "").slice(0, max);
  }

  /* 12345678901 -> 123.456.789-01 */
  function mascararCPF(valor) {
    var d = somenteDigitos(valor, 11);
    if (d.length > 9)  return d.slice(0,3)+"."+d.slice(3,6)+"."+d.slice(6,9)+"-"+d.slice(9);
    if (d.length > 6)  return d.slice(0,3)+"."+d.slice(3,6)+"."+d.slice(6);
    if (d.length > 3)  return d.slice(0,3)+"."+d.slice(3);
    return d;
  }

  function escapar(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------- máscaras */

  cpf.addEventListener("input", function () {
    var noFinal = cpf.selectionStart === cpf.value.length;
    cpf.value = mascararCPF(cpf.value);
    if (noFinal) cpf.selectionStart = cpf.selectionEnd = cpf.value.length;
  });

  matricula.addEventListener("input", function () {
    matricula.value = somenteDigitos(matricula.value, 15);
  });

  /* ------------------------------------------------------------ exibição */

  function linha(rotulo, valor) {
    return '<div class="dados__item"><dt>' + escapar(rotulo) +
           "</dt><dd>" + escapar(valor || "—") + "</dd></div>";
  }

  function exibir() {
    saida.innerHTML =
      '<section class="resultado resultado--ok">' +
        '<div class="resultado__cabecalho">' +
          '<span class="selo selo--ok">Teste Teste</span>' +
        "</div>" +
        '<p class="resultado__mensagem">Dados registrados com sucesso.</p>' +
        '<dl class="dados">' +
          linha("Nome", nome.value.trim()) +
          linha("Curso", curso.value.trim()) +
          linha("Matrícula", matricula.value.trim()) +
          linha("CPF", cpf.value.trim()) +
        "</dl>" +
      "</section>";
  }

  /* -------------------------------------------------------------- evento */

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    exibir();
  });
})();
