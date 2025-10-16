FROM python:3.12-alpine

WORKDIR /app

RUN apk update && apk add --no-cache gcc musl-dev

COPY .python-version pyproject.toml uv.lock ./

RUN pip install --no-cache-dir uv

# Create virtual environment and sync dependencies
RUN uv venv && uv sync --no-cache

COPY . .

# Use gunicorn from the venv
CMD ["/app/.venv/bin/gunicorn", "serve:app", "--bind", "0.0.0.0:5000"]
