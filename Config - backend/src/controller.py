from src.models import ( models_insert_user, models_get_user_by_re, models_activer_user, models_change_permission, models_insert_user_historic
                         ,models_get_all_users, models_delete_user)

def controller_register_user(data):
    # verifica se já existe
    if models_get_user_by_re(data["re"]):
        return {"message": "Usuário já existe"}, 400

    ok = models_insert_user(
        nome=data["nome"],
        re=data["re"],
        senha=data["senha"],   # aqui ainda está em texto puro
        permissao=data.get("permissao", "usuario"),
    )

    if not ok:
        return {"message": "Erro ao registrar usuário"}, 500

    return {"message": "Usuário registrado com sucesso"}, 201


def controller_login_user(data):
    user = models_get_user_by_re(data["re"])  # busca usuário no banco

    # Se não encontrou usuário → erro 400
    if not user:
        return {"message": "Usuário não existe, favor solicitar cadastro à coordenação."}, 400

    # Se senha não bate → erro 401
    if user["senha"] != data["senha"]:
        return {"message": "Credenciais inválidas, senha incorreta."}, 401

    # Se usuário existe mas não está ativo → erro 403
    if user["ativo"] != "sim":
        return {"message": "Seu perfil ainda não foi ativado, entre em contato com a coordenação."}, 403

    # Registro de login no histórico
    models_insert_user_historic(user["re"])

    # Sucesso
    return {
        "user": {"nome": user["nome"], "permissao": user["permissao"]}
    }, 200



def controller_active_user(data):
    if not models_get_user_by_re(data["re"]):
        return {"message": "Usuário não encontrado"}, 404

    if models_activer_user(data["re"]):
        return {"message": "Usuário ativado com sucesso"}, 200
    return {"message": "Erro ao ativar usuário"}, 500


def controller_change_permission(data):
    if not models_get_user_by_re(data["re"]):
        return {"message": "Usuário não encontrado"}, 404

    if models_change_permission(data["re"], data["permissao"]):
        return {"message": "Permissão alterada com sucesso"}, 200
    return {"message": "Erro ao alterar permissão"}, 500

def controller_get_all_users():
    users = models_get_all_users()
    return {"users": users}, 200

def controller_delete_user(re):
    if not models_get_user_by_re(re):
        return {"message": "Usuário não encontrado"}, 404

    if models_delete_user(re):
        return {"message": "Usuário excluído com sucesso"}, 200
    return {"message": "Erro ao excluir usuário"}, 500



