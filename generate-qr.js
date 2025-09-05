const qrcode = require('qrcode');

const qrString = '2@XmjCFmK9h+Pr67Hpl6l9Q41jiGShV6zULYciQSIXu2THwSFzABNUwuk+EtBsKusZyeVvmVdQ+U/y0WIqHk8DD6RR2Gu0+lWvWWY=,OC3lWTOU49pAYHdZcpb9uwu8xWOlrT3DfjdVBp/mgB4=,2TPl1jCeuxbnIWPMMJ2yctbiyIP5Baj4VhZoXa+V/Dg=,W/Oi4i36BwY6WlJ5MVwrGnb/jw1813XWJ+1/4w/8Xlc=,1';

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