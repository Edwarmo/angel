require('dotenv').config();
const { Client, NoAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🔄 Iniciando bot simple...');

const client = new Client({
  authStrategy: new NoAuth(),
  puppeteer: { 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  console.log('📱 QR Code:');
  qrcode.generate(qr, { small: true });
  console.log('\n⚠️ IMPORTANTE: Escanea INMEDIATAMENTE (tienes 2-3 minutos)');
});

client.on('ready', () => {
  console.log('✅ ¡Bot conectado exitosamente!');
  console.log('📱 WhatsApp Web está listo');
});

client.on('authenticated', () => {
  console.log('🔐 Autenticación exitosa');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Error de autenticación:', msg);
});

client.on('disconnected', (reason) => {
  console.log('⚠️ Desconectado:', reason);
});

client.initialize();