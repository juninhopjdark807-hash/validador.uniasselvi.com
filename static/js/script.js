/* Pequenos ajustes de usabilidade no campo do código de autenticação. */
(function () {
  "use strict";

  var entrada = document.getElementById("codigo");
  if (!entrada) return;

  var TAMANHO_BLOCO = 4;
  var MAX_CARACTERES = 24;

  /* Mantém apenas letras e números, em maiúsculas. */
  function limpar(valor) {
    return valor.replace(/[^0-9A-Za-z]/g, "").toUpperCase().slice(0, MAX_CARACTERES);
  }

  /* Insere hífens a cada 4 caracteres: ABCD1234 -> ABCD-1234 */
  function agrupar(valor) {
    var partes = [];
    for (var i = 0; i < valor.length; i += TAMANHO_BLOCO) {
      partes.push(valor.slice(i, i + TAMANHO_BLOCO));
    }
    return partes.join("-");
  }

  entrada.addEventListener("input", function () {
    var noFinal = entrada.selectionStart === entrada.value.length;
    entrada.value = agrupar(limpar(entrada.value));
    if (noFinal) {
      entrada.selectionStart = entrada.selectionEnd = entrada.value.length;
    }
  });

  /* Cola de um código copiado de um PDF costuma trazer espaços/quebras. */
  entrada.addEventListener("paste", function (evento) {
    evento.preventDefault();
    var texto = (evento.clipboardData || window.clipboardData).getData("text");
    entrada.value = agrupar(limpar(texto));
  });

  /* Posiciona o cursor no fim ao focar num valor já preenchido. */
  entrada.addEventListener("focus", function () {
    var fim = entrada.value.length;
    entrada.setSelectionRange(fim, fim);
  });
})();
