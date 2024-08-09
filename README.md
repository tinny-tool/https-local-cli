<h1 text-align="center">https-local-cli</h1>

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A command-line interface (CLI) tool for creating a local HTTPS server with custom proxy support. This tool simplifies the process of setting up a secure local development environment, particularly useful for testing applications that require HTTPS or for working with APIs that mandate secure connections.

## Features

- Generate self-signed SSL certificates for local use
- Start an HTTPS server on your local machine
- Serve static files from a specified directory
- Proxy requests to another server (e.g., API server)
- Customizable proxy paths

## Installation

To install the `https-local-cli` globally on your system, run:

```bash
npm install -g https-local-cli
```

## Usage

### Generating SSL Certificates

To generate self-signed SSL certificates:

```bash
https-local generate
```

This command creates SSL certificates in the `./ssl` directory of your current working directory.

### Starting the HTTPS Server

To start the HTTPS server:

```bash
https-local start [options]
```

#### Options:

- `-p, --port <port>`: Port to run the server on (default: 3000)
- `-d, --directory <directory>`: Directory to serve static files from
- `-t, --target <target>`: Proxy target (e.g., http://localhost:11434)
- `--proxy-path <path>`: Path to proxy (e.g., /api)

### Examples

Start server on port 8443:

```bash
https-local start -p 8443
```

Serve static files from './public' directory:

```bash
https-local start -d ./public
```

Start server with proxy to another local server:

```bash
https-local start -t http://localhost:11434 --proxy-path /api
```

## How It Works

1. The `generate` command creates self-signed SSL certificates using OpenSSL.
2. The `start` command:
   - Checks for existing certificates, generating them if they don't exist.
   - Sets up an Express.js server with HTTPS support.
   - Configures static file serving and/or proxying based on provided options.
   - Starts the server on the specified port.

## Star History ⭐

<div align="center">

<img src="https://api.star-history.com/svg?repos=tinny-tool/https-local-cli&type=Date" width="600" height="400" alt="Star History Chart" valign="middle">

</div>

## Troubleshooting

- Ensure you have OpenSSL installed on your system.
- If you encounter certificate warnings in your browser, you may need to add the generated certificate to your system's trusted certificates.
