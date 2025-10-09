import requests
import os
import certifi
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_telegram_message(message: str):
    try:
        if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
            print("❌ Faltam variáveis TELEGRAM_TOKEN ou TELEGRAM_CHAT_ID no .env")
            return False

        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }

        # Usa certificados atualizados
        response = requests.post(url, json=payload, verify=certifi.where())
        data = response.json()

        if response.status_code == 200 and data.get("ok"):
            print("✅ Mensagem enviada com sucesso no Telegram!")
            return True
        else:
            print(f"❌ Erro ({response.status_code}): {data}")
            return False

    except requests.exceptions.SSLError as ssl_err:
        print("⚠️ Erro de SSL:", ssl_err)
        print("➡️ Tente atualizar o pacote 'certifi' ou usar verify=False para teste.")
        return False
    except Exception as e:
        print("⚠️ Erro geral no envio:", e)
        return False
