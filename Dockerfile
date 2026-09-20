# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS build
WORKDIR /frontend
COPY ./frontend /frontend
RUN npm ci
RUN npm run build

FROM python:3.12-slim-bookworm
WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/gkk-dev-ops/wifi-code-maker"
LABEL org.opencontainers.image.description="WiFi QR code credential sharing webapp"

COPY ./app/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

RUN addgroup --system app && adduser --system --ingroup app app
COPY --chown=app:app ./app /app
COPY --chown=app:app --from=build /frontend /app/frontend
RUN mkdir -p /app/persistant/static/img && chown -R app:app /app/persistant

USER app
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
