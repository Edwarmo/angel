const qrcode = require('qrcode');

const qrString = '2@KS10tVAlkbd780S6rQaypMwp9Q74WrYv6MycPxOtxXmYKYclc16LE8v4l8yl0y0ilg1y+PIBgcUDf8riSen8gTnABQM+Sz5MhVk=,FZNY1chCuuLUQd7jxmvwK7yiQcxbdHyOl90ferp68Ug=,eBT+vPRbhxSI9NhHOeLjJyTU6FsmJa7ba3n53ObV8yg=,Txg8c32s57aZFkKtJMu7Qfua1suV9oE1Mhrfkk5nhAE=,1';

qrcode.toFile('whatsapp-qr.png', qrString, { width: 300 }, (err) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('✅ QR generado: whatsapp-qr.png');
  }
});

// También mostrar en terminal
qrcode.toString(qrString, { type: 'terminal', small: true }, (err, qr) => {
  if (!err) {
    console.log(qr);
  }
});