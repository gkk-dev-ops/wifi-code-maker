# wifi-code-maker

## Description

Application let's you generate QR code for your wifi network. You can print it and put it on the wall. Then your guests can scan it and connect to your wifi network.

<img src="docs/App screenshot.png">

After providing WIFI data download of qr code starts.

<img src="docs/admin - QR Code.png">

## Installation

```bash
git clone https://github.com/gkk-dev-ops/wifi-code-maker.git
```

Adjust PORT and DOMAIN_NAME of your server in docker compose `app.build.args` and `ALLOWED_ORIGINS`.
