from flask import Blueprint, request, jsonify
from src.resumo.controller import (
controller_resumo_por_perfil,
controller_get_tarefas_tecnico
)


api_resumo = Blueprint("api_resumo", __name__)


@api_resumo.route("/resumo_perfil", methods=["GET"])
def get_resumo_perfil():
    period = request.args.get("period", "current_month")
    resp, status = controller_resumo_por_perfil(period)
    return jsonify(resp), status

@api_resumo.route("/resumo_perfil/<re_assumiu>/tarefas", methods=["GET"])
def get_tarefas_tecnico(re_assumiu):
    resp, status = controller_get_tarefas_tecnico(re_assumiu)
    return jsonify(resp), status
