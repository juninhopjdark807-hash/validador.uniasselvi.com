# Cadastro de Documentos

Site estático (**HTML + CSS + JavaScript**) com um formulário para informar os
dados que serão impressos no documento: Nome, Curso, Matrícula e CPF.

Sem Python, sem servidor, sem build e sem dependências externas — basta abrir o
`index.html` no navegador.

> Projeto de uso pessoal/interno, escrito do zero. Dados fictícios, sem vínculo
> com nenhuma instituição de ensino.

## Como usar

Dê duplo clique em **`index.html`**. É só isso.

Se preferir servir por HTTP (opcional):

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## O formulário

| Campo | Observação |
|---|---|
| Nome | texto livre, ocupa a linha inteira |
| Curso | texto livre, ocupa a linha inteira |
| Matrícula | aceita apenas números (até 15 dígitos) |
| CPF | aceita apenas números, com máscara `000.000.000-00` |

O botão de confirmação é verde, traz o selo **OK** e o texto **Teste Teste**.
Ao clicar, os dados preenchidos são exibidos logo abaixo em um painel de
confirmação. Campos deixados em branco aparecem como `—`.

## Estrutura

```
.
├── index.html          formulário
├── css/
│   └── estilo.css      aparência
└── js/
    └── script.js       máscaras e exibição dos dados
```

## Personalização rápida

- **Texto ou cor do botão:** o texto está no `index.html`; a cor vem da regra
  `.botao--ok` no `css/estilo.css` (variáveis `--verde` e `--verde-escuro`,
  definidas no topo do arquivo).
- **Novos campos:** duplique um bloco `.grupo` no `index.html` e acrescente a
  linha correspondente na função `exibir()` do `js/script.js`.
- **Layout:** os campos ficam em duas colunas no desktop e em uma no celular.
  Use a classe `grupo--largo` para um campo ocupar a linha inteira.

## Observação

Os dados preenchidos apenas são exibidos na tela — nada é salvo ou enviado a
lugar nenhum. Ao recarregar a página, o formulário volta em branco. Se for
preciso armazenar os registros, será necessário adicionar um backend.
