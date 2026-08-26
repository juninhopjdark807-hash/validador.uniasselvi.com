# Validador de Documentos

Site estático (**HTML + CSS + JavaScript**) para conferir a autenticidade de um
documento a partir do seu código de autenticação: digite o código impresso no
documento e a página informa se ele é autêntico, exibindo os dados do registro.

Sem Python, sem servidor, sem build e sem dependências externas — basta abrir o
`index.html` no navegador.

> Projeto de uso pessoal/interno, escrito do zero. Os dados são fictícios e não
> há vínculo com nenhuma instituição de ensino.

## Como usar

Dê duplo clique em **`index.html`**. É só isso.

Se preferir servir por HTTP (opcional):

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Funcionalidades

- Busca do documento pelo código de autenticação
- Entrada tolerante: ignora hífens, pontos, espaços e maiúsculas/minúsculas —
  `a1b2c3d4e5f6`, `A1B2-C3D4-E5F6` e `A1B2 C3D4 E5F6` chegam ao mesmo registro
- Máscara automática no campo (blocos de 4 caracteres)
- Ao colar um código de um PDF, quebras de linha e espaços são removidos
- Link direto com validação automática: `index.html?codigo=A1B2C3D4E5F6`
- Layout responsivo (desktop e celular)

## Resultados possíveis

| Situação | Quando ocorre | Cor |
|---|---|---|
| Documento autêntico | encontrado e dentro do prazo | verde |
| Fora do prazo de validade | encontrado, mas vencido | âmbar |
| Documento cancelado | marcado como revogado | vermelho |
| Não localizado | nenhum registro para o código | vermelho |
| Código inválido | menos de 6 caracteres | âmbar |

## Códigos de demonstração

| Código | Resultado |
|---|---|
| `A1B2-C3D4-E5F6` | válido |
| `9F8E-7D6C-5B4A` | válido, sem prazo de validade |
| `1234-5678-90AB` | fora do prazo |
| `DEAD-BEEF-0001` | cancelado |

## Estrutura

```
.
├── index.html            página
├── css/
│   └── estilo.css        aparência
└── js/
    ├── documentos.js     BASE DE DOCUMENTOS (edite aqui)
    └── script.js         lógica da validação
```

## Cadastrando documentos

Abra **`js/documentos.js`** e acrescente um bloco na lista:

```js
{
  codigo: "AAAA-BBBB-CCCC",
  tipo: "Declaração de Matrícula",
  nome: "Nome da Pessoa",
  matricula: "00000000000",
  curso: "Nome do Curso",
  unidade: "Polo — Cidade/UF",
  emitidoEm: "2026-01-15",
  validoAte: "2026-07-15",
  emissor: "Secretaria Acadêmica",
  cancelado: false
}
```

- `validoAte: null` → documento sem prazo de validade
- `cancelado: true` → documento revogado
- Datas no formato `AAAA-MM-DD`
- Separe cada bloco com vírgula

## Observação sobre segurança

Por ser um site estático, a base de documentos fica em um arquivo `.js` visível
para quem abrir a página. Isso é adequado para uso pessoal e interno, mas se um
dia for publicado na internet, a validação deve passar a ser feita em um
servidor.
