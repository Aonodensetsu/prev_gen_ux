FROM python:3.12.13-slim

ENV UV_PROJECT_ENVIRONMENT=/usr/local

COPY pyproject.toml uv.lock .python-version ./
RUN pip install uv && uv sync

COPY app/ /app/

EXPOSE 80
CMD ["hypercorn", "--bind", "0.0.0.0:80", "app:app"]
HEALTHCHECK CMD ["python", "-c", "import httpx; exit(httpx.get('http://localhost/api/v1/ping').is_error)"]

