"""
Validador de Documentos
=======================

Aplicação web simples para conferir a autenticidade de um documento a partir
do seu código de autenticação.

Implementação original (Flask), inspirada no fluxo comum de validadores
acadêmicos: o usuário digita o código impresso no documento e o sistema
responde se ele é autêntico, exibindo os metadados do registro.

Execução:
    pip install -r requirements.txt
    python app.py
"""

from __future__ import annotations

import json
import os
import re
from datetime import date, datetime
from pathlib import Path

from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "documentos.json"

app = Flask(__name__)


# --------------------------------------------------------------------------- #
# Camada de dados
# --------------------------------------------------------------------------- #
def normalizar_codigo(codigo: str) -> str:
    """Remove ruído (espaços, hífens, pontos) e padroniza em maiúsculas.

    Assim `abc1-2345.6789` e `ABC123456789` são tratados como o mesmo código.
    """
    return re.sub(r"[^0-9A-Za-z]", "", codigo or "").upper()


def formatar_codigo(codigo: str) -> str:
    """Exibe o código em blocos de 4 caracteres, facilitando a leitura."""
    limpo = normalizar_codigo(codigo)
    return "-".join(limpo[i:i + 4] for i in range(0, len(limpo), 4))


def carregar_documentos() -> dict[str, dict]:
    """Lê o arquivo JSON e devolve um índice {codigo_normalizado: documento}."""
    if not DATA_FILE.exists():
        return {}

    with DATA_FILE.open(encoding="utf-8") as arquivo:
        registros = json.load(arquivo)

    indice: dict[str, dict] = {}
    for registro in registros:
        chave = normalizar_codigo(registro.get("codigo", ""))
        if chave:
            indice[chave] = registro
    return indice


def formatar_data(iso: str | None) -> str:
    """Converte '2026-03-14' em '14/03/2026'. Devolve '—' se não houver data."""
    if not iso:
        return "—"
    try:
        return datetime.strptime(iso, "%Y-%m-%d").strftime("%d/%m/%Y")
    except ValueError:
        return iso


def documento_expirado(registro: dict) -> bool:
    validade = registro.get("valido_ate")
    if not validade:
        return False
    try:
        return datetime.strptime(validade, "%Y-%m-%d").date() < date.today()
    except ValueError:
        return False


def validar(codigo_bruto: str) -> dict:
    """Executa a validação e devolve um dicionário pronto para o template."""
    codigo = normalizar_codigo(codigo_bruto)

    if not codigo:
        return {
            "status": "vazio",
            "mensagem": "Digite o código de autenticação impresso no documento.",
        }

    if len(codigo) < 6:
        return {
            "status": "invalido",
            "codigo": formatar_codigo(codigo),
            "mensagem": "O código informado é curto demais para ser válido. "
                        "Confira os caracteres e tente novamente.",
        }

    registro = carregar_documentos().get(codigo)

    if registro is None:
        return {
            "status": "nao_encontrado",
            "codigo": formatar_codigo(codigo),
            "mensagem": "Nenhum documento foi localizado para este código de "
                        "autenticação. Verifique a digitação — se o problema "
                        "persistir, procure a secretaria da sua unidade.",
        }

    if registro.get("cancelado"):
        return {
            "status": "cancelado",
            "codigo": formatar_codigo(codigo),
            "documento": registro,
            "mensagem": "Este documento foi cancelado pela instituição emissora "
                        "e não possui validade.",
        }

    if documento_expirado(registro):
        return {
            "status": "expirado",
            "codigo": formatar_codigo(codigo),
            "documento": registro,
            "mensagem": "O prazo de validade deste documento já se encerrou.",
        }

    return {
        "status": "valido",
        "codigo": formatar_codigo(codigo),
        "documento": registro,
        "mensagem": "Documento autêntico. Os dados abaixo conferem com o "
                    "registro da instituição emissora.",
    }


# --------------------------------------------------------------------------- #
# Rotas
# --------------------------------------------------------------------------- #
@app.route("/", methods=["GET", "POST"])
def index():
    codigo = (request.values.get("codigo") or "").strip()
    resultado = validar(codigo) if codigo else None
    return render_template(
        "index.html",
        codigo=codigo,
        resultado=resultado,
        formatar_data=formatar_data,
        ano=date.today().year,
    )


@app.route("/api/validar")
def api_validar():
    """Mesma validação em JSON, útil para integrações."""
    resultado = validar(request.args.get("codigo", ""))
    http_status = 200 if resultado["status"] in {"valido", "vazio"} else 404
    return jsonify(resultado), http_status


@app.errorhandler(404)
def nao_encontrada(_erro):
    return render_template(
        "index.html",
        codigo="",
        resultado=None,
        formatar_data=formatar_data,
        ano=date.today().year,
    ), 404


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=True,
    )
