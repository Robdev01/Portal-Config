from flask import Blueprint, request, jsonify
from src.users.controller import (
    controller_register_user,
    controller_login_user,
    controller_change_permission,
    controller_active_user,
    controller_get_all_users,
    controller_delete_user,
                            )


api_bp = Blueprint("api", __name__)

@api_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    resp, status = controller_register_user(data)
    return jsonify(resp), status

@api_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    resp, status = controller_login_user(data)
    return jsonify(resp), status

@api_bp.route("/ativar", methods=["PATCH"])
def ativar():
    data = request.get_json()
    resp, status = controller_active_user(data)
    return jsonify(resp), status

@api_bp.route("/permissao", methods=["PATCH"])
def permissao():
    data = request.get_json()
    resp, status = controller_change_permission(data)
    return jsonify(resp), status

@api_bp.route("/users", methods=["GET"])
def get_users():
    resp, status = controller_get_all_users()
    return jsonify(resp), status

@api_bp.route("/usuario/<re>", methods=["DELETE"])
def delete_user(re):
    resp, status = controller_delete_user(re)
    return jsonify(resp), status

