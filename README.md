# ProjetoPessoal — Validador de Documentos

Aplicação web em **Python + Flask** para conferir a autenticidade de um
documento a partir do seu código de autenticação: o usuário digita o código
impresso no documento e o sistema informa se ele é autêntico, exibindo os
dados do registro.

> Implementação **original**, escrita do zero como projeto de estudo.
> Os dados são fictícios e a aplicação não possui vínculo com nenhuma
> instituição de ensino.

## Funcionalidades

- Busca de documento pelo código de autenticação
- Normalização da entrada: ignora hífens, espaços, pontos e maiúsculas/minúsculas
- Máscara automática no campo (blocos de 4 caracteres) e tratamento de colagem
- Cinco desfechos distintos de validação:
  | Situação | Descrição |
  |---|---|
  | `valido` | documento encontrado e dentro do prazo |
  | `expirado` | documento encontrado, prazo de validade vencido |
  | `cancelado` | documento revogado pela emissora |
  | `nao_encontrado` | nenhum registro para o código |
  | `invalido` | código curto demais para ser válido |
- Endpoint JSON `GET /api/validar?codigo=...` para integrações
- Layout responsivo, sem dependências de front-end

## Como executar

```bash
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Acesse <http://localhost:5000>. A porta pode ser alterada pela variável de
ambiente `PORT`.

## Códigos de demonstração

| Código | Resultado esperado |
|---|---|
| `A1B2-C3D4-E5F6` | válido |
| `9F8E-7D6C-5B4A` | válido, sem prazo de validade |
| `1234-5678-90AB` | fora do prazo |
| `DEAD-BEEF-0001` | cancelado |

## Estrutura

```
.
├── app.py                    # rotas e regras de validação
├── requirements.txt
├── data/
│   └── documentos.json       # base de documentos (fictícia)
├── templates/
│   └── index.html
└── static/
    ├── css/estilo.css
    └── js/script.js
```

## Como cadastrar novos documentos

Basta acrescentar um objeto em `data/documentos.json`:

```json
{
  "codigo": "AAAA-BBBB-CCCC",
  "tipo": "Declaração de Matrícula",
  "aluno": "Nome do Aluno",
  "matricula": "00000000000",
  "curso": "Nome do Curso",
  "unidade": "Polo — Cidade/UF",
  "emitido_em": "2026-01-15",
  "valido_ate": "2026-07-15",
  "emissor": "Secretaria Acadêmica",
  "cancelado": false
}
```

Use `"valido_ate": null` para documentos sem prazo de validade.
