/* ==========================================================================
   Base de documentos
   --------------------------------------------------------------------------
   Para cadastrar um documento novo, copie um bloco abaixo e ajuste os campos.
   - validoAte: use null quando o documento não tiver prazo de validade.
   - cancelado: true marca o documento como revogado.
   As datas seguem o formato AAAA-MM-DD.
   ========================================================================== */

var DOCUMENTOS = [
  {
    codigo: "39698039",
    tipo: "Declaração de Matrícula",
    nome: "Paulo Oliveira da Silva Junior",
    matricula: "39698039",
    curso: "SPBEF - Educação Física",
    unidade: "Polo - Arthur Nogueira",
    emitidoEm: "2026-03-14",
    validoAte: "2026-12-14",
    emissor: "Secretaria Acadêmica",
    cancelado: false
  },
  {
    codigo: "9F8E-7D6C-5B4A",
    tipo: "Histórico Escolar",
    nome: "Carlos Eduardo Ramos",
    matricula: "20219933110",
    curso: "Pedagogia",
    unidade: "Polo Norte — Joinville/SC",
    emitidoEm: "2025-11-02",
    validoAte: null,
    emissor: "Secretaria Acadêmica",
    cancelado: false
  },
  {
    codigo: "1234-5678-90AB",
    tipo: "Certificado de Conclusão",
    nome: "Fernanda Lima Barreto",
    matricula: "20185512004",
    curso: "Administração",
    unidade: "Polo Sul — Florianópolis/SC",
    emitidoEm: "2024-07-30",
    validoAte: "2025-07-30",
    emissor: "Registro Acadêmico",
    cancelado: false
  },
  {
    codigo: "DEAD-BEEF-0001",
    tipo: "Declaração de Frequência",
    nome: "Roberto Nunes Pacheco",
    matricula: "20240087651",
    curso: "Engenharia de Software",
    unidade: "Polo Leste — Itajaí/SC",
    emitidoEm: "2026-01-20",
    validoAte: "2026-12-20",
    emissor: "Secretaria Acadêmica",
    cancelado: true
  }
];
