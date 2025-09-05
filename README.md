# WhatsApp API

API REST para WhatsApp.

## Uso

```bash
npm install
npm start
```

## Endpoints

- `GET /status` - Estado del bot
- `GET /messages` - Mensajes recibidos  
- `POST /send` - Enviar mensaje

```javascript
fetch('/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ number: '1234567890', message: 'Hola' })
});
```