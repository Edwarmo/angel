const qrcode = require('qrcode');

const qrString = '2@wugXf2aLQrOVIxyEJN/EBhCFRAwi9NxmZZSHTNYqtR2pKf2oIylAT9s0UCvTG4N5wsl5c66G0HHWAp9Y3B9wQyGvSIu1medxf98=,cHIEXTsf8mFviEu1H4tTRWNBwod8QIW3MwVokIT7a0c=,OAUtS/hyqZhAnNxYr2/KIKn8urK5e1OtSAVUky31M0o=,rp8SGaRamyGsE9oP943TDXRrc6upFMtspFTdv4ffF24=,1"';

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