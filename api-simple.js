require('dotenv').config();
const express = require('express');
const { Client, NoAuth } = require('whatsapp-web.js');
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
let currentQR = null;

// Email transporter
const transporter = process.env.EMAIL_USER ? nodemailer.createTransporter({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
}) : null;

const client = new Client({
  authStrategy: new NoAuth(),
  puppeteer: { 
    headless: true, 
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run'
    ]
  }
});

client.on('qr', async (qr) => {
  currentQR = qr;
  console.log('📱 QR generado');
  console.log('\n=== QR STRING ===');
  console.log(qr);
  console.log('=== FIN QR ===\n');
  
  if (transporter) {
    try {
      const qrBuffer = await qrcode.toBuffer(qr, { width: 300 });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: '📱 WhatsApp QR',
        attachments: [{ filename: 'qr.png', content: qrBuffer }]
      });
      console.log('✅ QR enviado por email');
    } catch (e) {
      console.log('❌ Error email:', e.message);
    }
  }
});

client.on('ready', () => {
  ready = true;
  console.log('🚀 Bot conectado');
});

client.on('message', (msg) => {
  const messageData = {
    id: msg.id._serialized,
    from: msg.from,
    body: msg.body,
    timestamp: Date.now(),
    isGroup: msg.from.includes('@g.us')
  };
  
  messages.unshift(messageData);
  if (messages.length > 100) messages.pop();
  console.log(`📨 ${msg.from}: ${msg.body}`);
});

// API Endpoints
app.get('/status', (req, res) => {
  res.json({ 
    ready, 
    messages: messages.length,
    hasQR: !!currentQR 
  });
});

app.get('/messages', (req, res) => {
  res.json({ 
    success: true,
    count: messages.length,
    messages 
  });
});

app.get('/qr', (req, res) => {
  if (currentQR) {
    res.json({ 
      success: true,
      qr: currentQR 
    });
  } else {
    res.json({ 
      success: false,
      error: 'QR no disponible' 
    });
  }
});

app.post('/send', async (req, res) => {
  const { number, message } = req.body;
  
  if (!ready) {
    return res.status(503).json({ 
      success: false,
      error: 'Bot no conectado' 
    });
  }
  
  if (!number || !message) {
    return res.status(400).json({ 
      success: false,
      error: 'Número y mensaje requeridos' 
    });
  }
  
  try {
    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    const chat = await client.getChatById(chatId);
    await chat.sendMessage(message);
    
    res.json({ 
      success: true,
      message: 'Enviado correctamente',
      to: chatId
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error enviando mensaje' 
    });
  }
});

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 API corriendo en puerto ${PORT}`);
});