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


def models_get_resumo_por_perfil(period="current_month"):
    conn = get_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = """
                SELECT 
                    pe.re_assumiu AS re,
                    COALESCE(u.nome, pe.re_assumiu) AS tecnico,
                    COUNT(DISTINCT pe.id_config) AS total_assumidas,
                    SUM(CASE WHEN pe.dt_finalizou IS NOT NULL THEN 1 ELSE 0 END) AS total_finalizadas,
                    ROUND(AVG(TIMESTAMPDIFF(MINUTE, pe.dt_assumiu, pe.dt_finalizou)), 1) AS tempo_medio_minutos
                FROM perfil_execucao pe
                LEFT JOIN usuarios u ON pe.re_assumiu = u.re
                WHERE 1=1
            """

            if period == "current_month":
                sql += " AND MONTH(pe.dt_assumiu) = MONTH(CURDATE()) AND YEAR(pe.dt_assumiu) = YEAR(CURDATE())"
            elif period == "last_3_months":
                sql += " AND pe.dt_assumiu >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)"

            sql += " GROUP BY pe.re_assumiu ORDER BY total_finalizadas DESC"
            cursor.execute(sql)
            return cursor.fetchall()
    except Exception as e:
        print("Erro ao buscar resumo por perfil:", e)
        return []
    finally:
        conn.close()


def models_get_tarefas_tecnico(re_assumiu):
    conn = get_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = """
                SELECT 
                    a.id_config,
                    a.cliente,
                    a.tipo_config,
                    a.status,
                    TIMESTAMPDIFF(MINUTE, pe.dt_assumiu, pe.dt_finalizou) AS tempo_minutos
                FROM perfil_execucao pe
                JOIN aparelho_configuracao a ON a.id = pe.id_config
                WHERE pe.re_assumiu = %s
                ORDER BY pe.dt_assumiu DESC
            """
            cursor.execute(sql, (re_assumiu,))
            return cursor.fetchall()
    except Exception as e:
        print("Erro ao buscar tarefas do técnico:", e)
        return []
    finally:
        conn.close()

