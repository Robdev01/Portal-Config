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
controller_get_aparelho_config,
controller_finalizar_manobra,
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

@api_aparelho.route("/aparelhos_periode", methods=["GET"])
def get_aparelhos_period():
    period = request.args.get("period", "all")
    resp, status = controller_get_aparelho_config(period)
    return jsonify(resp), status

@api_aparelho.route("/finalizar_manobra/<id>", methods=["PATCH"])
def route_finalizar_manobra(id):
    return controller_finalizar_manobra(id)



@api_aparelho.route("/reportar_erro", methods=["POST"])
def reportar_erro():
    data = request.get_json()
    assunto = data.get("assunto")
    descricao = data.get("descricao")
    usuario = data.get("usuario")  # opcional, quem reportou

    if not assunto or not descricao:
        return {"message": "Assunto e descrição são obrigatórios"}, 400

    # Montar corpo de e-mail e texto Telegram
    corpo_email = f"Usuário: {usuario}\nAssunto: {assunto}\nDescrição:\n{descricao}"
    telegram_text = f"Novo relatório de erro:\nUsuário: {usuario}\nAssunto: {assunto}\n{descricao}"

    # Enviar email
    lista_dest = ["suporte@empresa.com", "outro@empresa.com"]  # ajustar
    sucesso_email = send_email(assunto, corpo_email, lista_dest)

    # Enviar Telegram
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    sucesso_telegram = send_telegram_message(bot_token, chat_id, telegram_text)

    if sucesso_email or sucesso_telegram:
        return {"message": "Relatório enviado com sucesso"}, 200
    else:
        return {"message": "Falha ao enviar relatório"}, 500
