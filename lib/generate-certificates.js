const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const sslDir = path.join(process.cwd(), 'ssl');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: sslDir }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function generateCertificates() {
  if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir);
  }

  if (fs.existsSync(path.join(sslDir, 'localhost.crt')) && 
      fs.existsSync(path.join(sslDir, 'localhost.key'))) {
    console.log('SSL certificates already exist. Skipping generation.');
    return;
  }

  console.log('Generating SSL certificates...');

  // Create openssl.cnf
  const opensslCnf = `
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
[dn]
C=US
ST=YourState
L=YourCity
O=YourOrganization
OU=YourUnit
emailAddress=your.email@example.com
CN = localhost
  `;
  fs.writeFileSync(path.join(sslDir, 'openssl.cnf'), opensslCnf);

  // Generate Root CA
  await runCommand('openssl req -x509 -nodes -new -sha256 -days 390 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -config openssl.cnf');
  await runCommand('openssl x509 -outform pem -in RootCA.pem -out RootCA.crt');

  // Create vhosts_domains.ext
  const vhostsDomains = `
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1=localhost
  `;
  fs.writeFileSync(path.join(sslDir, 'vhosts_domains.ext'), vhostsDomains);

  // Generate certificate
  await runCommand('openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -config openssl.cnf');
  await runCommand('openssl x509 -req -sha256 -days 390 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile vhosts_domains.ext -out localhost.crt');

  console.log('Certificates generated successfully.');
}

module.exports = generateCertificates;
