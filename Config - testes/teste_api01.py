import requests
import random
from datetime import datetime

BASE_URL = "http://localhost:5003/api/aparelhos"

# Gera até 10 configurações fictícias
aparelhos = [
    {
        "id_config": f"CFG{100 + i}",
        "cliente": random.choice(["Elgin", "Assaí", "OmegaWorks", "Zhaz", "Colorvip"]),
        "tipo_config": random.choice(["MC33", "ET51", "TC51", "ET40"]),
    }
    for i in range(1, 11)
]


def testar_criar():
    print("=== Testando POST /aparelhos ===")
    for ap in aparelhos:
        r = requests.post(BASE_URL, json=ap)
        try:
            print(f"→ Criar {ap['id_config']} -> {r.status_code} | {r.json()}")
        except Exception:
            print(f"→ Criar {ap['id_config']} -> {r.status_code} | Erro na resposta")


def testar_listar():
    print("\n=== Testando GET /aparelhos ===")
    r = requests.get(BASE_URL)
    try:
        dados = r.json()
        print(f"→ Listar -> {r.status_code} | Total: {len(dados.get('aparelhos', []))}")
        return dados.get("aparelhos", [])
    except Exception:
        print(f"→ Erro ao listar -> {r.status_code}")
        return []


def testar_get_por_id(aparelhos):
    print("\n=== Testando GET /aparelhos/<id> ===")
    if not aparelhos:
        print("→ Nenhum aparelho disponível para teste.")
        return
    escolhido = random.choice(aparelhos)
    aparelho_id = escolhido.get("id")
    if not aparelho_id:
        print("→ ID ausente no retorno, pulei o teste.")
        return
    r = requests.get(f"{BASE_URL}/{aparelho_id}")
    try:
        print(f"→ Buscar {aparelho_id} -> {r.status_code} | {r.json()}")
    except Exception:
        print(f"→ Buscar {aparelho_id} -> {r.status_code} | Erro na resposta")


def testar_update(aparelhos):
    print("\n=== Testando PATCH /aparelhos/<id> ===")
    if not aparelhos:
        print("→ Nenhum aparelho para atualizar.")
        return
    escolhido = random.choice(aparelhos)
    aparelho_id = escolhido.get("id")
    if not aparelho_id:
        print("→ ID ausente no retorno, pulei o teste.")
        return

    payload = {
        "status": random.choice(["em_andamento", "finalizado"]),
        "re_assumiu": f"RE{random.randint(1000, 9999)}",
        "dt_assumiu": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dt_finalizou": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    r = requests.patch(f"{BASE_URL}/{aparelho_id}", json=payload)
    try:
        print(f"→ Atualizar {aparelho_id} -> {r.status_code} | {r.json()}")
    except Exception:
        print(f"→ Atualizar {aparelho_id} -> {r.status_code} | Erro na resposta")


def testar_delete(aparelhos):
    print("\n=== Testando DELETE /aparelhos/<id> ===")
    if not aparelhos:
        print("→ Nenhum aparelho para excluir.")
        return
    escolhido = random.choice(aparelhos)
    aparelho_id = escolhido.get("id")
    if not aparelho_id:
        print("→ ID ausente no retorno, pulei o teste.")
        return
    r = requests.delete(f"{BASE_URL}/{aparelho_id}")
    try:
        print(f"→ Deletar {aparelho_id} -> {r.status_code} | {r.json()}")
    except Exception:
        print(f"→ Deletar {aparelho_id} -> {r.status_code} | Erro na resposta")


if __name__ == "__main__":
    testar_criar()
    lista = testar_listar()
    testar_get_por_id(lista)
    testar_update(lista)
    testar_delete(lista)
    testar_listar()  # checar se foi realmente excluído
