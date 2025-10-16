FROM python:3.12-alpine

WORKDIR /app

RUN apk update

COPY .python-version \
    pyproject.toml \
    uv.lock \
    ./


RUN pip install --no-cache-dir uv

RUN uv sync --no-cache 

COPY . .

CMD ["gunicorn", "serve:app", "--bind", "0.0.0.0:8000"]
