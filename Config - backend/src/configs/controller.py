from datetime import datetime

from src.configs.models import (
    models_insert_aparelho_config,
    models_get_all_aparelho_config,
    models_get_aparelho_config_by_id,
    models_update_aparelho_config,
    models_delete_aparelho_config,
    models_get_pendentes_manobra,
    models_get_pendentes_config_geral,
    models_assumir_aparelho,
    models_update_finalizacao,

)
from src.services.telegram_service import send_telegram_message


def controller_create_aparelho_config(data):
    # Validação dos campos obrigatórios
    if not data.get("id_config") or not data.get("cliente") or not data.get("tipo_config"):
        return {"message": "Campos obrigatórios ausentes"}, 400

    sucesso = models_insert_aparelho_config(
        data["id_config"],
        data["cliente"],
        data["tipo_config"],
        data.get("re_assumiu"),
        data.get("observacao"),
    )

    if sucesso:
        # Monta a mensagem de notificação
        mensagem = (
            f"----- Nova configuração cadastrada! -----\n\n"
            f"ID: {data['id_config']}\n"
            f"Cliente: {data['cliente']}\n"
            f"Tipo: {data['tipo_config']}\n"
            f"Observação: {data.get('observacao', 'Nenhuma')}"
        )

        send_telegram_message(mensagem)

        return {"message": "Aparelho cadastrado e notificação enviada"}, 201

    return {"message": "Erro ao cadastrar aparelho"}, 500


def controller_get_all_aparelhos():
    aparelhos = models_get_all_aparelho_config()
    return {"aparelhos": aparelhos}, 200


def controller_get_aparelho_by_id(id):
    aparelho = models_get_aparelho_config_by_id(id)
    if not aparelho:
        return {"message": "Aparelho não encontrado"}, 404
    return {"aparelho": aparelho}, 200


def controller_update_aparelho(id, data):
    if models_update_aparelho_config(
        id,
        status=data.get("status"),
        re_assumiu=data.get("re_assumiu"),
        dt_assumiu=data.get("dt_assumiu"),
        dt_finalizou=data.get("dt_finalizou"),
        observacao=data.get("observacao"),
        tipo_config=data.get("tipo_config"),
    ):
        return {"message": "Aparelho atualizado com sucesso"}, 200
    return {"message": "Erro ao atualizar aparelho"}, 500

def controller_delete_aparelho(id):
    if not models_get_aparelho_config_by_id(id):
        return {"message": "Aparelho não encontrado"}, 404

    if models_delete_aparelho_config(id):
        return {"message": "Aparelho excluído com sucesso"}, 200
    return {"message": "Erro ao excluir aparelho"}, 500

def controller_get_pendentes_manobra():
    data = models_get_pendentes_manobra()
    return {"aparelhos": data}, 200


def controller_get_pendentes_config_geral():
    data = models_get_pendentes_config_geral()
    return {"aparelhos": data}, 200

def controller_assumir_aparelho(id, data):
    re_assumiu = data.get("re_assumiu")
    if not re_assumiu:
        return {"message": "RE do usuário é obrigatório"}, 400

    success = models_assumir_aparelho(id, re_assumiu)
    if success:
        return {"message": "Configuração assumida com sucesso"}, 200
    else:
        return {"message": "Configuração não encontrada ou erro ao assumir"}, 404

def controller_finalizar_configuracao(id):
    dt_finalizou = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if models_update_finalizacao(id, dt_finalizou):
        return {"message": "Configuração finalizada com sucesso"}, 200
    return {"message": "Erro ao finalizar configuração"}, 500