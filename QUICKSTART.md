# ⚡ INICIO RÁPIDO - PromptForge

## 🎯 Para empezar YA (5 minutos)

### Opción A: Deploy Instantáneo (Railway - RECOMENDADO)

1. **Click aquí**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

2. **Conecta tu GitHub** y selecciona este repo

3. **Agrega PostgreSQL**:
   - Click "New" → "Database" → "PostgreSQL"

4. **Configura 3 variables mínimas**:
   ```
   JWT_SECRET=mi-secreto-super-seguro-123
   STRIPE_SECRET_KEY=sk_test_... (obtener de stripe.com)
   OPENAI_API_KEY=sk-... (opcional, obtener de openai.com)
   ```

5. **Deploy automático** → ¡Listo! 🎉

Tu app estará en: `https://promptforge-production.up.railway.app`

---

### Opción B: Local (Desarrollo)

```bash
# 1. Clonar
git clone <tu-repo>
cd promptforge-app

# 2. Ejecutar script automático
chmod +x setup.sh
./setup.sh

# 3. Editar .env (IMPORTANTE)
cd backend
nano .env

# 4. Iniciar
npm start
```

Tu API estará en: `http://localhost:5000`

---

## 🔑 Credenciales Necesarias

### 1. Stripe (OBLIGATORIO para pagos)

**Modo Test (desarrollo)**:
1. Ir a: https://dashboard.stripe.com/register
2. Obtener:
   - Secret Key: `sk_test_...`
   - Publishable Key: `pk_test_...`
3. Pegar en `.env`

**Modo Live (producción)**:
1. Activar cuenta Stripe
2. Usar keys `sk_live_...` y `pk_live_...`

### 2. OpenAI (OPCIONAL pero recomendado)

1. Ir a: https://platform.openai.com/api-keys
2. Crear nueva key
3. Agregar a `.env`: `OPENAI_API_KEY=sk-...`

**O usar Anthropic Claude**:
1. Ir a: https://console.anthropic.com/
2. Crear API key
3. Agregar: `ANTHROPIC_API_KEY=sk-ant-...`

**Sin API de IA**: El sistema usa templates locales (funcional pero menos potente)

---

## 🧪 Probar que Funciona

### 1. Health Check
```bash
curl http://localhost:5000/health
# Debería retornar: {"status":"ok","timestamp":"..."}
```

### 2. Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### 3. Crear Prompt
```bash
# Usar el token del paso anterior
curl -X POST http://localhost:5000/api/prompts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -d '{
    "title": "Mi primer prompt",
    "content": "Eres un asistente útil...",
    "category": "Marketing"
  }'
```

---

## 🎨 Frontend (HTML)

El archivo `prompt-platform.html` que creamos antes puede usarse como frontend temporal:

1. Abre `prompt-platform.html` en el navegador
2. Edita la línea 1050 para apuntar a tu API:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   // o en producción:
   const API_URL = 'https://tu-app.railway.app/api';
   ```

---

## 📱 Crear App Móvil (Próximamente)

```bash
# Instalar Expo
npm install -g expo-cli

# Crear app React Native
npx create-expo-app promptforge-mobile
cd promptforge-mobile

# Iniciar
npm start
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar PostgreSQL está corriendo:
psql -U postgres -c "SELECT 1"

# Si no está instalado:
# Mac: brew install postgresql
# Ubuntu: apt install postgresql
# Windows: https://www.postgresql.org/download/
```

### Error: "EADDRINUSE 5000"
```bash
# Puerto 5000 ocupado, cambiar en .env:
PORT=5001
```

### Error: "Stripe key invalid"
```bash
# Verificar que copiaste la key correcta de Stripe dashboard
# Debe empezar con sk_test_ o sk_live_
```

---

## 🚀 Deploy a Producción

### Railway (Más Fácil)
```bash
# Ya está hecho si usaste el botón de arriba ✅
```

### Heroku
```bash
heroku create mi-promptforge
heroku addons:create heroku-postgresql:mini
git push heroku main
```

### DigitalOcean
```bash
# Ver DEPLOYMENT.md para instrucciones completas
```

---

## 📊 Configurar Stripe Productos

### Dashboard Stripe → Products

**Crear 3 productos**:

1. **Básico - $19/mes**
   - Precio recurrente: $19 USD mensual
   - Copiar Price ID → `.env`: `STRIPE_PRICE_BASIC=price_...`

2. **Premium - $49/mes**
   - Precio recurrente: $49 USD mensual
   - Copiar Price ID → `.env`: `STRIPE_PRICE_PREMIUM=price_...`

3. **Enterprise - $149/mes**
   - Precio recurrente: $149 USD mensual
   - Copiar Price ID → `.env`: `STRIPE_PRICE_ENTERPRISE=price_...`

---

## ✅ Checklist Pre-Launch

Antes de abrir al público:

- [ ] Backend deployado y funcionando
- [ ] Base de datos con migraciones
- [ ] Stripe en modo LIVE (no test)
- [ ] Webhooks configurados
- [ ] Dominio personalizado (opcional)
- [ ] SSL activo (automático en Railway/Vercel)
- [ ] Probado registro de usuario
- [ ] Probado creación de prompt
- [ ] Probado compra en marketplace
- [ ] Probado suscripción a plan

---

## 🎓 Tutoriales Útiles

1. **Configurar Stripe**: https://stripe.com/docs/development
2. **PostgreSQL básico**: https://www.postgresql.org/docs/current/tutorial.html
3. **JWT explicado**: https://jwt.io/introduction
4. **Deploy Node.js**: https://nodejs.dev/en/learn/

---

## 💬 ¿Necesitas Ayuda?

- **Documentación completa**: Ver `README.md`
- **Guía de deploy**: Ver `DEPLOYMENT.md`
- **Estructura del código**: Ver `STRUCTURE.md`
- **Issues**: Abrir en GitHub
- **Email**: soporte@promptforge.com

---

## 🎉 ¡Felicidades!

Ahora tienes una plataforma completa de prompts lista para monetizar.

**Próximos pasos**:
1. Personalizar diseño
2. Agregar más templates
3. Marketing y adquisición
4. ¡Hacer dinero! 💰

---

**¿Preguntas? ¡Pregúntame lo que necesites!**
