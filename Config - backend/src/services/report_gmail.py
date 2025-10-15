import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(sujeito: str, corpo: str, destinatarios: list[str]):
    # Configurações do Gmail
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    gmail_user = os.getenv("GMAIL_USER")
    gmail_pass = os.getenv("GMAIL_APP_PASSWORD")  # usar Senha de App do Gmail

    msg = MIMEMultipart()
    msg["From"] = gmail_user
    msg["To"] = ", ".join(destinatarios)
    msg["Subject"] = sujeito
    msg.attach(MIMEText(corpo, "plain"))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(gmail_user, gmail_pass)
        server.sendmail(gmail_user, destinatarios, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print("Erro ao enviar email:", e)
        return False
