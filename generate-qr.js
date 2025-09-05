const qrcode = require('qrcode');

const qrString = '2@Z7iSvhRXjGRf/YGEhfJv6VbJRprdrefT8aNHhJg3O+Pv7c/WLuBdaGAs2iLkMwCpdzPbk8sCra+P6yghhwuIKmciXALgZOPKbIw=,3xZc/TW1i+oSmYM9k5MuDqLo9qAqFK44HUsoeiCIHlk=,KHoJNyYa37PG5Td2H2e5hVZR+VVfeoSsuAymzjkW/0k=,FVal9+2TU5+IqUYwWIUgb9HBCUfLDc1sqOg5OV3Zktw=,1';

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