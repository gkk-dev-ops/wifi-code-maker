# syntax=docker/dockerfile:1
FROM node:20 as build
WORKDIR /frontend
COPY ./frontend /frontend
RUN npm ci
ARG DOMAIN_NAME=${DOMAIN_NAME:-localhost}
RUN echo "VITE_HOST=$DOMAIN_NAME" > .env
RUN echo "VITE_PORT=$PORT" >> .env
RUN npm run build

FROM python:3.9-slim-buster
WORKDIR /app
COPY ./app /app
COPY --from=build /frontend /app/frontend

# RUN pip install -r requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
