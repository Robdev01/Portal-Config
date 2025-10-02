import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT")),
        cursorclass=pymysql.cursors.DictCursor
    )

def models_insert_user(nome, re, senha, permissao):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO usuarios (nome, re, senha, permissao, ativo)
                VALUES (%s, %s, %s, %s, 'nao')
            """
            cursor.execute(sql, (nome, re, senha, permissao))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao inserir usuário:", e)
        return False
    finally:
        conn.close()

def models_get_user_by_re(re):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM usuarios WHERE re = %s"
            cursor.execute(sql, (re,))
            return cursor.fetchone()
    finally:
        conn.close()

def models_activer_user(re):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "UPDATE usuarios SET ativo = 'sim' WHERE re = %s"
            cursor.execute(sql, (re,))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao ativar usuário:", e)
        return False
    finally:
        conn.close()

def models_change_permission(re, permissao):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "UPDATE usuarios SET permissao = %s WHERE re = %s"
            cursor.execute(sql, (permissao, re))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao mudar permissão:", e)
        return False
    finally:
        conn.close()


def models_insert_user_historic(re):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO historico_login_vivoconfig ( re)
                VALUES (%s)
            """
            cursor.execute(sql, ( re))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao inserir usuário:", e)
        return False
    finally:
        conn.close()

def models_get_all_users():
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT id, nome, re, permissao, ativo FROM usuarios"
            cursor.execute(sql)
            return cursor.fetchall()
    finally:
        conn.close()

def models_delete_user(re):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "DELETE FROM usuarios WHERE re = %s"
            cursor.execute(sql, (re,))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao excluir usuário:", e)
        return False
    finally:
        conn.close()
