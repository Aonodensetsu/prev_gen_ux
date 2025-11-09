FROM python:3.12-slim
WORKDIR /server
COPY server/requirements.txt .
RUN pip install -r requirements.txt
COPY server .
WORKDIR /
ENV UVICORN_HOST=0.0.0.0
ENV UVICORN_PORT=80
EXPOSE 80
CMD ["uvicorn", "server:app"]
HEALTHCHECK CMD ["python", "-c", "import requests; exit(not requests.get('http://localhost/api/v1/ping').ok)"]

