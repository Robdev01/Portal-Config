import requests
import random

BASE_URL = "http://localhost:5003/api"

# Criar até 5 usuários fictícios para testar
usuarios = [
    {
        "nome": f"Usuário {i}",
        "re": f"re{i:03d}",
        "senha": f"senha{i:03d}",
        "permissao": random.choice(["usuario", "admin", "coordenação","tecnico"])
    }
    for i in range(1, 21)
]

def testar_register():
    print("=== Testando /register ===")
    for user in usuarios:
        r = requests.post(f"{BASE_URL}/register", json=user)
        print(f"Register {user['re']} -> {r.status_code} | {r.json()}")

def testar_login():
    print("\n=== Testando /login ===")
    for user in usuarios:
        payload = {"re": user["re"], "senha": user["senha"]}
        r = requests.post(f"{BASE_URL}/login", json=payload)
        print(f"Login {user['re']} -> {r.status_code} | {r.json()}")

def testar_ativar():
    print("\n=== Testando /ativar ===")
    for user in usuarios:
        payload = {"re": user["re"]}
        r = requests.patch(f"{BASE_URL}/ativar", json=payload)
        print(f"Ativar {user['re']} -> {r.status_code} | {r.json()}")

def testar_permissao():
    print("\n=== Testando /permissao ===")
    for user in usuarios:
        nova_permissao = random.choice(["usuario", "admin", "coordenador"])
        payload = {"re": user["re"], "permissao": nova_permissao}
        r = requests.patch(f"{BASE_URL}/permissao", json=payload)
        print(f"Permissão {user['re']} -> {r.status_code} | {r.json()}")

if __name__ == "__main__":
    testar_register()
    testar_login()
    testar_ativar()
    testar_permissao()
    testar_login()  # login final para confirmar ativação
