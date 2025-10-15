from src.resumo.models import (
models_get_resumo_por_perfil,
models_get_tarefas_tecnico,

)

def controller_resumo_por_perfil(period):
    data = models_get_resumo_por_perfil(period)
    if not data:
        return {"message": "Nenhum dado encontrado"}, 404
    return {"resumo": data}, 200

def controller_get_tarefas_tecnico(re_assumiu):
    try:
        data = models_get_tarefas_tecnico(re_assumiu)
        if not data:
            return {"message": "Nenhuma tarefa encontrada"}, 404
        return {"tarefas": data}, 200
    except Exception as e:
        print("Erro ao buscar tarefas do técnico:", e)
        return {"message": "Erro interno"}, 500
