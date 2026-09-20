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

The frontend uses the browser's current origin for API requests, so it works
behind either local HTTP or a TLS-terminating reverse proxy. Adjust
`ALLOWED_ORIGINS` when the API is accessed from another origin.

Pushes to `master` publish an amd64 image to
`ghcr.io/gkk-dev-ops/wifi-code-maker`. GitHub Container Registry creates new
packages as private; change the package visibility to public before deploying
it without an image pull secret.
