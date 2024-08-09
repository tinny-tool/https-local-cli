#!/usr/bin/env node

const { program } = require('commander');
const generateCertificates = require('../lib/generate-certificates');
const startServer = require('../lib/start-server');

program
  .version('1.0.0')
  .description('Local HTTPS server CLI with custom proxy support')
  .addHelpText('after', `
Example calls:
  $ https-local generate
  $ https-local start -p 3000 -d ./public
  $ https-local start -p 3000 -t http://localhost:11434 --proxy-path /v1/api
  `);

program
  .command('generate')
  .description('Generate SSL certificates')
  .action(async () => {
    try {
      await generateCertificates();
    } catch (error) {
      console.error('Error generating certificates:', error);
    }
  });

program
  .command('start')
  .description('Start HTTPS server')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-d, --directory <directory>', 'Directory to serve static files from')
  .option('-t, --target <target>', 'Proxy target (e.g., http://localhost:11434)')
  .option('--proxy-path <path>', 'Path to proxy (e.g., /api)', '/api')
  .action(async (options) => {
    try {
      await generateCertificates();
      startServer(options.port, options.directory, options.target, options.proxyPath);
    } catch (error) {
      console.error('Error starting server:', error);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
