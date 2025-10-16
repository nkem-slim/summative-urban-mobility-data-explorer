from functools import wraps
from flask import jsonify

def handler(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            response = {
                "error": str(e),
                "type": e.__class__.__name__,
            }
            return jsonify(response), 500

    return wrapper
