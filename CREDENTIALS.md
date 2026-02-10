# 🔑 CREDENCIALES NECESARIAS - Template

Completa este archivo con tus credenciales y luego cópialas a `.env`

---

## 📋 CHECKLIST DE CREDENCIALES

- [ ] MercadoPago Access Token
- [ ] MercadoPago Public Key
- [ ] JWT Secret (genera uno aleatorio)
- [ ] OpenAI API Key (opcional)
- [ ] URLs de tu aplicación

---

## 💳 MERCADOPAGO

### Modo TEST (para probar)
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-
MERCADOPAGO_PUBLIC_KEY=TEST-
```

**Cómo obtener**:
1. https://www.mercadopago.com.ar/developers
2. Tu aplicación → Credenciales
3. Modo Test → Copiar tokens

### Modo PRODUCCIÓN (para cobrar de verdad)
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-
MERCADOPAGO_PUBLIC_KEY=APP_USR-
```

**Cómo obtener**:
1. Verificar cuenta MercadoPago (DNI + cuenta bancaria)
2. Developers → Credenciales
3. Modo Producción → Copiar tokens

---

## 🔐 JWT SECRET

```env
JWT_SECRET=
```

**Generar uno aleatorio**:
```bash
# Opción 1: Online
https://randomkeygen.com/ → CodeIgniter Encryption Keys

# Opción 2: Terminal
openssl rand -base64 32

# Opción 3: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Ejemplo**: `a8f5f167f44f4964e6c998dee827110c03748ac3ce8928b4eef0568b4b2f3f5d`

---

## 🤖 API DE IA (Opcional)

### OpenAI
```env
OPENAI_API_KEY=sk-
```

**Cómo obtener**:
1. https://platform.openai.com/api-keys
2. Create new secret key
3. Copiar (solo se muestra una vez)

**Costo**: ~$0.002 por request GPT-4

### Anthropic Claude
```env
ANTHROPIC_API_KEY=sk-ant-
```

**Cómo obtener**:
1. https://console.anthropic.com/
2. API Keys → Create Key
3. Copiar

**Costo**: ~$0.003 por request Claude

### Sin API de IA
Si no tienes API key, el sistema usa templates locales (funcional pero menos potente).

---

## 🌐 URLs

### Desarrollo Local
```env
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Producción (Railway)
```env
BACKEND_URL=https://promptforge-production.up.railway.app
FRONTEND_URL=https://tu-dominio.com
```

**Obtener URL Railway**:
1. Deploy tu app en Railway
2. Settings → Networking → Generate Domain
3. Copiar URL

---

## 📄 ARCHIVO .ENV COMPLETO

### Template para copiar

```env
# ==================================
# PROMPTFORGE - VARIABLES DE ENTORNO
# ==================================

# Entorno
NODE_ENV=production
PORT=5000

# Base de datos (Railway lo configura automáticamente)
# No necesitas agregar estas si usas Railway
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=5432

# JWT Secret (CAMBIAR ESTO)
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c03748ac3ce8928b4eef0568b4b2f3f5d

# ==================================
# MERCADOPAGO (ARGENTINA)
# ==================================

# Modo TEST (para probar)
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aqui
MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui

# Cuando estés listo para producción, reemplaza con:
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
# MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key

# ==================================
# STRIPE (OPCIONAL - SOLO INTERNACIONAL)
# ==================================

# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# STRIPE_PRICE_BASIC=price_...
# STRIPE_PRICE_PREMIUM=price_...
# STRIPE_PRICE_ENTERPRISE=price_...

# ==================================
# AI APIs (OPCIONAL)
# ==================================

# OpenAI (recomendado)
OPENAI_API_KEY=

# O Anthropic Claude
ANTHROPIC_API_KEY=

# Si no tienes ninguna API key, déjalo vacío
# El sistema usará templates locales

# ==================================
# URLs
# ==================================

# Desarrollo local
# BACKEND_URL=http://localhost:5000
# FRONTEND_URL=http://localhost:3000

# Producción (Railway)
BACKEND_URL=https://tu-app-production.up.railway.app
FRONTEND_URL=https://tu-dominio.com

# ==================================
# OTRAS CONFIGURACIONES
# ==================================

# Email (opcional - para notificaciones)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=tu-email@gmail.com
# SMTP_PASSWORD=tu-app-password

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## ✅ VERIFICACIÓN

### Antes de Deploy, verifica:

- [ ] `MERCADOPAGO_ACCESS_TOKEN` copiado completo
- [ ] `MERCADOPAGO_PUBLIC_KEY` copiado completo
- [ ] `JWT_SECRET` es aleatorio y seguro (min 32 caracteres)
- [ ] `BACKEND_URL` es tu URL de Railway
- [ ] No hay espacios extras al pegar
- [ ] Guardaste el archivo como `.env`
- [ ] `.env` está en `.gitignore` (NO commitear a Git)

---

## 🔒 SEGURIDAD

### ⚠️ MUY IMPORTANTE

**NUNCA**:
- ❌ Commitear .env a Git
- ❌ Compartir credenciales públicamente
- ❌ Usar el mismo JWT_SECRET que el ejemplo
- ❌ Exponer API keys en frontend

**SIEMPRE**:
- ✅ Mantener .env en .gitignore
- ✅ Usar JWT_SECRET único y aleatorio
- ✅ Rotar credenciales regularmente
- ✅ Usar modo TEST antes de producción

---

## 📝 GUARDAR CREDENCIALES

### Recomendado: Password Manager

Guarda todas tus credenciales en:
- 1Password
- LastPass
- Bitwarden
- KeePass

**Backup**: Exporta y guarda en lugar seguro.

---

## 🆘 ¿PROBLEMAS?

### "Invalid credentials"
- Verificar que copiaste el token completo
- Asegurarte de no tener espacios al inicio/final
- Confirmar que estás usando el modo correcto (TEST vs PRODUCCIÓN)

### "JWT Secret error"
- Debe tener al menos 32 caracteres
- Debe ser aleatorio
- No usar el ejemplo directamente

### "Cannot connect to database"
- Si usas Railway, no necesitas configurar DB_*
- Railway lo hace automáticamente
- Solo asegúrate de tener PostgreSQL agregado

---

## ✅ PRÓXIMOS PASOS

1. Completa este template con tus credenciales
2. Copia todo a `backend/.env`
3. Ve a `DEPLOYMENT-CHECKLIST.md`
4. ¡Deploy! 🚀

---

**¿Listo? Siguiente archivo: `DEPLOYMENT-CHECKLIST.md`**
