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


def models_insert_aparelho_config(id_config, cliente, tipo_config, re_assumiu=None, observacao=None):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO aparelho_configuracao 
                (id_config, cliente, tipo_config, status, re_assumiu, observacao, dt_cadastro)
                VALUES (%s, %s, %s, 'pendente', %s, %s, NOW())
            """
            cursor.execute(sql, (id_config, cliente, tipo_config, re_assumiu, observacao))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao inserir aparelho_configuracao:", e)
        return False
    finally:
        conn.close()



def models_get_all_aparelho_config():
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """SELECT 
                    a.id,
                    a.id_config,
                    a.cliente,
                    a.tipo_config,
                    a.status,
                    a.observacao,
                    a.dt_cadastro,
                    a.dt_assumiu,
                    a.dt_finalizou,
                    a.re_assumiu,
                    u.nome AS nome_responsavel
                FROM aparelho_configuracao a
                LEFT JOIN usuarios u ON a.re_assumiu = u.re                
                ORDER BY a.dt_cadastro DESC"""
            cursor.execute(sql)
            return cursor.fetchall()
    finally:
        conn.close()


def models_get_aparelho_config_by_id(id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM aparelho_configuracao WHERE id = %s"
            cursor.execute(sql, (id,))
            return cursor.fetchone()
    finally:
        conn.close()


def models_update_aparelho_config(id, status=None, re_assumiu=None, dt_assumiu=None, dt_finalizou=None, observacao=None, tipo_config=None):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql_parts = []
            params = []

            if status:
                sql_parts.append("status = %s")
                params.append(status)
            if re_assumiu:
                sql_parts.append("re_assumiu = %s")
                params.append(re_assumiu)
            if dt_assumiu:
                sql_parts.append("dt_assumiu = %s")
                params.append(dt_assumiu)
            if dt_finalizou:
                sql_parts.append("dt_finalizou = %s")
                params.append(dt_finalizou)
            if observacao is not None:
                sql_parts.append("observacao = %s")
                params.append(observacao)
            if tipo_config:
                sql_parts.append("tipo_config = %s")
                params.append(tipo_config)

            if not sql_parts:
                return False

            sql = f"""
                UPDATE aparelho_configuracao
                SET {', '.join(sql_parts)}, dt_atualizacao = NOW()
                WHERE id = %s
            """
            params.append(id)
            cursor.execute(sql, tuple(params))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao atualizar aparelho_configuracao:", e)
        return False
    finally:
        conn.close()



def models_delete_aparelho_config(id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = "DELETE FROM aparelho_configuracao WHERE id = %s"
            cursor.execute(sql, (id,))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao deletar aparelho_configuracao:", e)
        return False
    finally:
        conn.close()

def models_get_pendentes_config_geral():
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT 
                    a.id,
                    a.id_config,
                    a.cliente,
                    a.tipo_config,
                    a.status,
                    a.observacao,
                    a.dt_cadastro,
                    a.dt_assumiu,
                    a.dt_finalizou,
                    a.re_assumiu,
                    u.nome AS nome_responsavel
                FROM aparelho_configuracao a
                LEFT JOIN usuarios u ON a.re_assumiu = u.re
                WHERE a.tipo_config = 'config_geral'
                AND a.status IN ('pendente', 'em_andamento')
                ORDER BY a.dt_cadastro DESC
            """
            cursor.execute(sql)
            return cursor.fetchall()
    finally:
        conn.close()


def models_get_pendentes_manobra():
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT 
                    a.id,
                    a.id_config,
                    a.cliente,
                    a.tipo_config,
                    a.status,
                    a.observacao,
                    a.dt_cadastro,
                    a.dt_assumiu,
                    a.re_assumiu,
                    u.nome AS nome_responsavel
                FROM aparelho_configuracao a
                LEFT JOIN usuarios u ON a.re_assumiu = u.re
                WHERE a.tipo_config = 'manobra'
                AND a.status IN ('pendente', 'em_andamento')
                ORDER BY a.dt_cadastro DESC
            """
            cursor.execute(sql)
            return cursor.fetchall()
    finally:
        conn.close()

def models_assumir_aparelho(id, re_assumiu):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                UPDATE aparelho_configuracao
                SET re_assumiu = %s,
                    dt_assumiu = NOW(),
                    status = 'em_andamento',
                    dt_atualizacao = NOW()
                WHERE id = %s
            """
            cursor.execute(sql, (re_assumiu, id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print("Erro ao assumir aparelho:", e)
        return False
    finally:
        conn.close()

def models_update_finalizacao(id, dt_finalizou):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                UPDATE aparelho_configuracao
                SET status = 'finalizado', dt_finalizou = %s
                WHERE id = %s
            """
            cursor.execute(sql, (dt_finalizou, id))
        conn.commit()
        return True
    except Exception as e:
        print("Erro ao atualizar finalização:", e)
        return False
    finally:
        conn.close()
