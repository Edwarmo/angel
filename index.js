require('dotenv').config();
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

let messages = [];
let ready = false;
let qrGenerated = false;

// Email transporter
const transporter = process.env.EMAIL_USER ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
}) : null;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', async (qr) => {
  if (!qrGenerated) {
    console.log('📱 QR generado para conexión inicial');
    
    if (transporter) {
      try {
        const qrBuffer = await qrcode.toBuffer(qr, { width: 300 });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: '📱 WhatsApp Bot - Código QR',
          text: 'Escanea este código QR con WhatsApp para conectar el bot.',
          attachments: [{ filename: 'whatsapp-qr.png', content: qrBuffer }]
        });
        console.log('✅ QR enviado por email');
      } catch (e) {
        console.log('❌ Error enviando email:', e.message);
      }
    }
    qrGenerated = true;
  }
});
client.on('ready', () => { 
  ready = true;
  console.log('🚀 Bot conectado y listo');
});

client.on('disconnected', (reason) => {
  ready = false;
  console.log('⚠️ Bot desconectado:', reason);
});
client.on('message', (msg) => {
  messages.unshift({ from: msg.from, body: msg.body, timestamp: Date.now() });
  if (messages.length > 50) messages.pop();
});

app.get('/status', (req, res) => res.json({ ready, messages: messages.length }));
app.get('/messages', (req, res) => res.json({ messages }));
app.post('/send', async (req, res) => {
  const { number, message } = req.body;
  if (!ready || !number || !message) return res.status(400).json({ error: 'Invalid' });
  try {
    const chat = await client.getChatById(number.includes('@c.us') ? number : `${number}@c.us`);
    await chat.sendMessage(message);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

client.initialize();
app.listen(process.env.PORT || 3000, () => console.log('API running'));