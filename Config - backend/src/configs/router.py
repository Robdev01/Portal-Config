from flask import Blueprint, request, jsonify
from src.configs.controller import (
controller_create_aparelho_config,
controller_get_all_aparelhos,
controller_get_aparelho_by_id,
controller_update_aparelho,
controller_delete_aparelho,
controller_get_pendentes_manobra,
controller_get_pendentes_config_geral,
controller_assumir_aparelho,
controller_finalizar_configuracao,
                            )


api_aparelho = Blueprint("api_aparelho", __name__)

@api_aparelho.route("/aparelhos", methods=["POST"])
def create_aparelho():
    data = request.get_json()
    resp, status = controller_create_aparelho_config(data)
    return jsonify(resp), status

@api_aparelho.route("/aparelhos", methods=["GET"])
def get_aparelhos():
    resp, status = controller_get_all_aparelhos()
    return jsonify(resp), status


@api_aparelho.route("/aparelhos/<int:id>", methods=["GET"])
def get_aparelho(id):
    resp, status = controller_get_aparelho_by_id(id)
    return jsonify(resp), status


@api_aparelho.route("/aparelhos/<int:id>", methods=["PUT", "PATCH"])
def update_aparelho(id):
    data = request.get_json()
    resp, status = controller_update_aparelho(id, data)
    return jsonify(resp), status


@api_aparelho.route("/aparelhos/<int:id>", methods=["DELETE"])
def delete_aparelho(id):
    resp, status = controller_delete_aparelho(id)
    return jsonify(resp), status

@api_aparelho.route("/aparelhos/pendentes/manobra", methods=["GET"])
def get_pendentes_manobra():
    resp, status = controller_get_pendentes_manobra()
    return jsonify(resp), status


@api_aparelho.route("/aparelhos/pendentes/config_geral", methods=["GET"])
def get_pendentes_config_geral():
    resp, status = controller_get_pendentes_config_geral()
    return jsonify(resp), status

@api_aparelho.route("/aparelhos/assumir/<int:id>", methods=["PATCH"])
def assumir_aparelho(id):
    data = request.get_json()
    resp, status = controller_assumir_aparelho(id, data)
    return jsonify(resp), status
@api_aparelho.route("/aparelhos/finalizar/<int:id>", methods=["PATCH"])
def finalizar_aparelho(id):
    resp, status = controller_finalizar_configuracao(id)
    return jsonify(resp), status

