/* ==========================================================================
   Validador de documentos — lógica da página
   Roda inteiramente no navegador, sem servidor.
   ========================================================================== */
(function () {
  "use strict";

  var TAMANHO_BLOCO = 4;
  var MAX_CARACTERES = 24;
  var MIN_CARACTERES = 6;

  var entrada    = document.getElementById("codigo");
  var formulario = document.getElementById("form-validacao");
  var saida      = document.getElementById("resultado");
  var campoAno   = document.getElementById("ano");

  /* Se a página não tiver os elementos esperados (por exemplo, um script
     antigo em cache rodando sobre um HTML novo), interrompe sem quebrar
     o restante da página. */
  if (!entrada || !formulario || !saida) {
    if (window.console) {
      console.warn("Validador: elementos do formulário não encontrados. " +
                   "Recarregue a página com Ctrl+F5 para limpar o cache.");
    }
    return;
  }

  if (campoAno) campoAno.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------- utilitários */

  /* Mantém só letras e números, em maiúsculas. */
  function normalizar(valor) {
    return String(valor || "")
      .replace(/[^0-9A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, MAX_CARACTERES);
  }

  /* ABCD1234 -> ABCD-1234 */
  function agrupar(valor) {
    var partes = [];
    for (var i = 0; i < valor.length; i += TAMANHO_BLOCO) {
      partes.push(valor.slice(i, i + TAMANHO_BLOCO));
    }
    return partes.join("-");
  }

  /* '2026-03-14' -> '14/03/2026' */
  function formatarData(iso) {
    if (!iso) return "—";
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function estaVencido(iso) {
    if (!iso) return false;
    var p = String(iso).split("-");
    if (p.length !== 3) return false;
    var validade = new Date(+p[0], +p[1] - 1, +p[2]);
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return validade < hoje;
  }

  /* Evita que conteúdo dos dados quebre o HTML. */
  function escapar(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buscar(codigo) {
    for (var i = 0; i < DOCUMENTOS.length; i++) {
      if (normalizar(DOCUMENTOS[i].codigo) === codigo) return DOCUMENTOS[i];
    }
    return null;
  }

  /* ----------------------------------------------------------- validação */

  function validar(valorBruto) {
    var codigo = normalizar(valorBruto);

    if (!codigo) {
      return {
        status: "vazio",
        mensagem: "Digite o código de autenticação impresso no documento."
      };
    }

    if (codigo.length < MIN_CARACTERES) {
      return {
        status: "invalido",
        codigo: (codigo),
        mensagem: "O código informado é curto demais para ser válido. " +
                  "Confira os caracteres e tente novamente."
      };
    }

    var doc = buscar(codigo);

    if (!doc) {
      return {
        status: "nao_encontrado",
        codigo: (codigo),
        mensagem: "Nenhum documento foi localizado para este código de " +
                  "autenticação. Verifique a digitação — se o problema " +
                  "persistir, procure a secretaria da sua unidade."
      };
    }

    if (doc.cancelado) {
      return {
        status: "cancelado",
        codigo: (codigo),
        documento: doc,
        mensagem: "Este documento foi cancelado pela instituição emissora " +
                  "e não possui validade."
      };
    }

    if (estaVencido(doc.validoAte)) {
      return {
        status: "expirado",
        codigo: (codigo),
        documento: doc,
        mensagem: "O prazo de validade deste documento já se encerrou."
      };
    }

    return {
      status: "valido",
      codigo: (codigo),
      documento: doc,
      mensagem: "Documento autêntico. Os dados abaixo conferem com o " +
                "registro da instituição emissora."
    };
  }

  /* ------------------------------------------------------------ exibição */

  var ROTULOS = {
    valido:         { selo: "Documento autêntico",        classe: "ok" },
    expirado:       { selo: "Fora do prazo de validade",  classe: "alerta" },
    cancelado:      { selo: "Documento cancelado",        classe: "erro" },
    invalido:       { selo: "Código inválido",            classe: "alerta" },
    nao_encontrado: { selo: "Não localizado",             classe: "erro" },
    vazio:          { selo: "Atenção",                    classe: "alerta" }
  };

  function linha(rotulo, valor) {
    return '<div class="dados__item"><dt>' + escapar(rotulo) +
           "</dt><dd>" + escapar(valor) + "</dd></div>";
  }

  function montarDados(d) {
    return '<dl class="dados">' +
      linha("Tipo de documento", d.tipo) +
      linha("Nome", d.nome) +
      linha("Matrícula", d.matricula) +
      linha("Curso", d.curso) +
      linha("Unidade", d.unidade) +
      linha("Válido até", d.validoAte ? formatarData(d.validoAte) : "Sem prazo de validade") +
      "</dl>";
  }

  function exibir(res) {
    var info = ROTULOS[res.status] || ROTULOS.vazio;
    var html =
      '<section class="resultado resultado--' + info.classe + '">' +
        '<div class="resultado__cabecalho">' +
          '<span class="selo selo--' + info.classe + '">' + info.selo + "</span>" +
          (res.codigo ? '<code class="resultado__codigo">' + escapar(res.codigo) + "</code>" : "") +
        "</div>" +
        '<p class="resultado__mensagem">' + escapar(res.mensagem) + "</p>" +
        (res.documento ? montarDados(res.documento) : "") +
      "</section>";

    saida.innerHTML = html;
  }

  /* ------------------------------------------------------------- eventos */

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    exibir(validar(entrada.value));
  });

  /* Máscara: agrupa em blocos de 4 enquanto digita. */
  entrada.addEventListener("input", function () {
    var noFinal = entrada.selectionStart === entrada.value.length;
    entrada.value = normalizar(entrada.value);
    if (noFinal) {
      entrada.selectionStart = entrada.selectionEnd = entrada.value.length;
    }
  });

  /* Código colado de um PDF costuma vir com espaços e quebras de linha. */
  entrada.addEventListener("paste", function (evento) {
    evento.preventDefault();
    var texto = (evento.clipboardData || window.clipboardData).getData("text");
    entrada.value = (normalizar(texto));
  });

  entrada.addEventListener("focus", function () {
    var fim = entrada.value.length;
    entrada.setSelectionRange(fim, fim);
  });

  /* Permite abrir a página já validando: index.html?codigo=A1B2C3D4E5F6 */
  (function preencherPelaURL() {
    var busca = window.location.search.match(/[?&]codigo=([^&]*)/);
    if (!busca) return;
    entrada.value = (normalizar(decodeURIComponent(busca[1])));
    exibir(validar(entrada.value));
  })();
})();
