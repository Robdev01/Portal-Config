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
    models_get_aparelho_config,
    models_update_manobra_status

)
from src.services.telegram_service import send_telegram_message
from src.services.report_gmail import send_email

from flask import jsonify

def controller_create_aparelho_config(data):
    # Validação dos campos obrigatórios
    if not data.get("id_config") or not data.get("cliente") or not data.get("tipo_config"):
        return {"message": "Campos obrigatórios ausentes"}, 400

    # Tratar o tipo_config para valores amigáveis
    if data["tipo_config"] == "config_geral":
        data["tipo_config"] = "Configuração Geral"
    elif data["tipo_config"] == "manobra":
        data["tipo_config"] = "Manobra"

    sucesso = models_insert_aparelho_config(
        data["id_config"],
        data["cliente"],
        data["tipo_config"],
        data.get("re_assumiu"),
        data.get("re_cadastrou"),  # novo campo
        data.get("observacao"),
    )

    if sucesso:
        mensagem = (
            f"<strong> Nova configuração cadastrada! </strong>\n\n"
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

def controller_get_aparelho_config(period="all"):
    data = models_get_aparelho_config(period)
    if not data:
        return {"message": "Nenhum dado encontrado"}, 404
    return {"aparelhos": data}, 200

def controller_reportar_erro(data):
    assunto = data.get("assunto")
    descricao = data.get("descricao")
    usuario = data.get("usuario")  # opcional

    if not assunto or not descricao:
        return {"message": "Assunto e descrição são obrigatórios"}, 400

    # Corpo das mensagens
    corpo_email = f"Usuário: {usuario or 'Não informado'}\n\nAssunto: {assunto}\n\nDescrição:\n{descricao}"
    telegram_text = f"🛠️ *Novo relatório de erro:*\n👤 Usuário: {usuario or 'Não informado'}\n🧩 Assunto: {assunto}\n📝 {descricao}"

    # Enviar email
    lista_dest = ["suporte@empresa.com", "outro@empresa.com"]  # ajuste conforme sua equipe
    sucesso_email = send_email(assunto, corpo_email, lista_dest)

    # Enviar
    sucesso_telegram = send_telegram_message(telegram_text)

    if sucesso_email or sucesso_telegram:
        return {"message": "Relatório enviado com sucesso"}, 200
    else:
        return {"message": "Falha ao enviar relatório"}, 500


def controller_finalizar_manobra(id):
    dt_finalizou = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        # 1. Buscar a manobra
        manobra = models_get_aparelho_config_by_id(id)
        if not manobra:
            return jsonify({"message": "Manobra não encontrada!"}), 404


        # 3. Atualizando o status da manobra para 'finalizado'
        update_status = models_update_finalizacao(id, dt_finalizou)

        if update_status:
            return jsonify({"message": "Manobra finalizada e nova configuração criada com sucesso!"}), 200
        else:
            return jsonify({"message": "Erro ao criar nova configuração ou atualizar manobra!"}), 500

    except Exception as e:
        print("Erro ao finalizar manobra:", e)
        return jsonify({"message": "Erro ao finalizar manobra!"}), 500