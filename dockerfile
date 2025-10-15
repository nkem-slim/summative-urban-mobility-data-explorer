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

CMD ["uv", "run", "python", "server.py"]
