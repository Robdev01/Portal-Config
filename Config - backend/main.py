from flask import Flask
from src.users.router import api_bp
from src.configs.router import api_aparelho
from src.resumo.router import api_resumo
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite requisições de qualquer origem (http, https, etc.)

app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(api_aparelho, url_prefix='/api')
app.register_blueprint(api_resumo, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)
