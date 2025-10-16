FROM python:3.12-alpine

WORKDIR /app

RUN apk update && apk add --no-cache gcc musl-dev

COPY .python-version pyproject.toml uv.lock ./

RUN pip install --no-cache-dir uv

# Create virtual environment and sync dependencies
RUN uv venv && uv sync --no-cache

COPY . .

# CMD ["/app/.venv/bin/gunicorn", "server:app", "--bind", "0.0.0.0:5000"]
CMD [ "/app/.venv/bin/python", "server.py" ]