# ✅ CHECKLIST DE DEPLOYMENT - PromptForge

## 📦 ARCHIVOS INCLUIDOS

```
promptforge-final/
├── backend/                    # API Backend completo
│   ├── config/                # Configuración DB
│   ├── middleware/            # JWT Auth
│   ├── routes/               # 8 rutas de API
│   │   ├── auth.js          # ✅ Autenticación
│   │   ├── prompts.js       # ✅ CRUD Prompts
│   │   ├── marketplace.js   # ✅ Compra/Venta
│   │   ├── payments.js      # ✅ Stripe (Internacional)
│   │   ├── payments-mercadopago.js # ✅ MercadoPago (Argentina)
│   │   ├── ai.js            # ✅ Generación con IA
│   │   ├── automations.js   # ✅ n8n/Make/Zapier
│   │   └── users.js         # ✅ Perfil y Analytics
│   ├── server.js            # Servidor principal
│   ├── package.json         # Dependencias
│   └── .env.example         # Template de variables
│
├── database/
│   └── migrate.js           # ✅ Migraciones SQL (9 tablas)
│
├── frontend/
│   └── package.json         # Setup React (opcional)
│
├── 📄 README.md             # Documentación principal
├── 📄 QUICKSTART.md         # Inicio rápido
├── 📄 DEPLOYMENT.md         # Guía de deploy
├── 📄 MERCADOPAGO-ARGENTINA.md  # Guía MercadoPago
├── 📄 PRECIOS-2026-ARGENTINA.md # Precios actualizados
├── 📄 AUTOMATION-GUIDE.md   # Guía automatizaciones
├── 📄 STRUCTURE.md          # Estructura del proyecto
├── 📄 docker-compose.yml    # Deploy con Docker
├── 📄 Dockerfile            # Container config
└── 📄 setup.sh              # Script de instalación
```

---

## 🚀 DEPLOYMENT EN 3 PASOS

### PASO 1: SUBIR A GITHUB (5 minutos)

```bash
# 1. Descomprimir el archivo
cd promptforge-final

# 2. Inicializar Git
git init
git add .
git commit -m "Initial commit - PromptForge ready for production"

# 3. Crear repo en GitHub
# Ir a: https://github.com/new
# Nombre: promptforge
# Private/Public: Tu elección

# 4. Conectar y subir
git remote add origin https://github.com/TU-USUARIO/promptforge.git
git branch -M main
git push -u origin main
```

✅ **Código en GitHub**

---

### PASO 2: CREAR CUENTA MERCADOPAGO (15 minutos)

```bash
# 1. Registro
https://www.mercadopago.com.ar/registration

# 2. Verificar identidad (DNI)
# Sube foto DNI frente/dorso + selfie
# Aprobación: 24-48 horas

# 3. Crear aplicación
https://www.mercadopago.com.ar/developers
→ "Tus integraciones"
→ "Crear aplicación"
→ Nombre: "PromptForge"

# 4. Copiar credenciales
MODO TEST (para probar):
- Public Key: TEST-xxxxxxxx
- Access Token: TEST-xxxxxxxx

MODO PRODUCCIÓN (para cobrar):
- Public Key: APP_USR-xxxxxxxx
- Access Token: APP_USR-xxxxxxxx
```

✅ **Mercado Pago configurado**

---

### PASO 3: DEPLOY EN RAILWAY (10 minutos)

```bash
# 1. Crear cuenta Railway
https://railway.app
→ "Login with GitHub"

# 2. Nuevo proyecto
→ "New Project"
→ "Deploy from GitHub repo"
→ Seleccionar "promptforge"

# 3. Agregar PostgreSQL
→ Click "New"
→ "Database"
→ "Add PostgreSQL"
✅ Railway conecta automáticamente

# 4. Configurar Variables de Entorno
→ Click en tu servicio
→ "Variables"
→ "RAW Editor"
→ Pegar lo siguiente:
```

```env
# === CONFIGURACIÓN ESENCIAL ===

NODE_ENV=production
PORT=5000

# JWT Secret (genera uno aleatorio)
JWT_SECRET=tu-secreto-super-seguro-cambiar-esto-123456789

# === MERCADOPAGO (ARGENTINA) ===
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aqui
MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui

# === AI (OPCIONAL) ===
# Opción 1: OpenAI
OPENAI_API_KEY=

# Opción 2: Anthropic Claude
ANTHROPIC_API_KEY=

# === URLs ===
BACKEND_URL=https://promptforge-production.up.railway.app
FRONTEND_URL=https://tu-dominio.com
```

```bash
# 5. Deploy automático
Railway detecta Node.js
Build: ~2 minutos
Deploy: Automático ✅

# 6. Obtener URL pública
→ Settings
→ "Networking"
→ "Generate Domain"
→ Copiar URL: https://promptforge-production.up.railway.app
```

✅ **App en producción**

---

## 🔧 CONFIGURACIÓN POST-DEPLOY

### A. Ejecutar Migraciones de Base de Datos

```bash
# Opción 1: Desde Railway Shell
1. Railway Dashboard → Tu servicio
2. "Deployments" → Click en el último deploy
3. "View Logs"
4. Buscar el ícono de terminal (arriba derecha)
5. Ejecutar:
   cd ../database && node migrate.js

# Opción 2: Build command personalizado
1. Settings → "Build & Deploy"
2. "Custom Start Command":
   npm run migrate && npm start
```

✅ **Base de datos creada con 9 tablas**

### B. Configurar Webhook de MercadoPago

```bash
# 1. Ir a MercadoPago Developers
https://www.mercadopago.com.ar/developers

# 2. Tu aplicación → "Webhooks"

# 3. Agregar endpoint
URL: https://TU-URL-RAILWAY.up.railway.app/api/payments-mp/webhook

# 4. Eventos:
✅ payment

# 5. Guardar
```

✅ **Webhooks configurados**

### C. Probar que Funciona

```bash
# Test 1: Health check
curl https://tu-url-railway.up.railway.app/health

# Debe retornar:
{"status":"ok","timestamp":"2026-02-03T..."}

# Test 2: Registrar usuario
curl -X POST https://tu-url-railway.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123",
    "username": "testuser"
  }'

# Debe retornar token JWT
```

✅ **API funcionando**

---

## 💳 TESTING CON MERCADOPAGO

### Tarjetas de Prueba (Modo TEST)

```bash
# Tarjeta que APRUEBA
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: APRO
DNI: 12345678

# Tarjeta que RECHAZA
Número: 5031 4332 1540 6351
Nombre: OTRE

# Más tarjetas:
https://www.mercadopago.com.ar/developers/es/docs/checkout-api/integration-test/test-cards
```

### Flujo de Prueba

```bash
1. Abrir frontend (prompt-platform.html)
2. Registrar usuario
3. Intentar suscribirse a Plan Básico
4. Usar tarjeta de prueba
5. Completar pago
6. Volver a la app
7. Verificar que plan se activó ✅
```

---

## 🎨 FRONTEND

### Opción 1: HTML Standalone (Más Rápido)

```bash
# 1. Editar prompt-platform.html
Línea ~50: const API_URL = 'https://TU-URL-RAILWAY.up.railway.app/api';

# 2. Subir a hosting
- Netlify (gratis): https://netlify.com
- Vercel (gratis): https://vercel.com
- GitHub Pages (gratis): https://pages.github.com

# 3. Arrastrar archivo HTML
✅ Frontend publicado
```

### Opción 2: React App (Más Profesional)

```bash
cd frontend
npm install
npm start

# Para producción:
npm run build
# Deploy carpeta build/ en Netlify/Vercel
```

---

## 🔐 SEGURIDAD PRE-LAUNCH

### Checklist de Seguridad

- [ ] JWT_SECRET es aleatorio y seguro (min 32 caracteres)
- [ ] No hay API keys en el código (solo en .env)
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo (100 req/15min)
- [ ] Helmet.js protegiendo headers
- [ ] HTTPS activo (Railway lo da automáticamente)
- [ ] Variables de entorno NO commiteadas a Git
- [ ] .gitignore incluye .env

---

## 💰 MODO PRODUCCIÓN (Cuando estés listo)

### Activar Cobros Reales

```bash
# 1. Verificar cuenta MercadoPago
→ Completar datos fiscales
→ Agregar cuenta bancaria
→ Verificar identidad

# 2. Cambiar a credenciales de PRODUCCIÓN
Railway → Variables:
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx (ya no TEST)
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx

# 3. Actualizar webhook
URL debe apuntar a producción (no localhost)

# 4. Probar con pago real pequeño
Hacer una compra de $100 ARS para verificar
```

✅ **Modo producción activo**

---

## 📊 MONITOREO

### Logs en Railway

```bash
# Ver logs en tiempo real
Railway Dashboard → Tu servicio → Logs

# Buscar errores:
- "Error"
- "Failed"
- "Cannot"
```

### Métricas Importantes

```bash
# En Railway Dashboard:
- CPU usage: <50%
- Memory: <500MB
- Response time: <500ms
- Uptime: >99%
```

---

## 🐛 TROUBLESHOOTING COMÚN

### "Cannot connect to database"
```bash
✓ Verificar PostgreSQL está running en Railway
✓ Variables DB_* están configuradas (Railway las crea auto)
✓ Migraciones ejecutadas
```

### "Invalid MercadoPago credentials"
```bash
✓ Copiar token completo (empieza con TEST- o APP_USR-)
✓ No tener espacios al pegar
✓ Estar en el modo correcto (TEST vs PRODUCCIÓN)
```

### "Webhook not working"
```bash
✓ URL es HTTPS (no HTTP)
✓ URL es pública (no localhost)
✓ Ruta exacta: /api/payments-mp/webhook
✓ No hay firewall bloqueando
```

### "AI generation fails"
```bash
✓ Si no tienes API key, sistema usa templates locales
✓ Templates funcionan sin IA (menos potente pero funcional)
✓ Para IA completa: agregar OPENAI_API_KEY o ANTHROPIC_API_KEY
```

---

## 📈 DESPUÉS DEL LAUNCH

### Semana 1: Monitoreo Intensivo
- [ ] Revisar logs diariamente
- [ ] Verificar pagos se procesan correctamente
- [ ] Responder feedback de usuarios
- [ ] Arreglar bugs críticos

### Semana 2-4: Optimización
- [ ] Analizar métricas de conversión
- [ ] A/B testing de precios
- [ ] Mejorar UX según feedback
- [ ] Agregar features solicitadas

### Mes 2+: Crecimiento
- [ ] Marketing y adquisición
- [ ] Automatizar procesos
- [ ] Contratar ayuda si es necesario
- [ ] Escalar infraestructura

---

## 💡 TIPS PRO

### 1. Empieza en Modo TEST
- Usa credenciales TEST primero
- Prueba TODO antes de producción
- Cuando funcione 100%, cambia a PRODUCCIÓN

### 2. Documenta Todo
- Guarda credenciales en lugar seguro (1Password, LastPass)
- Anota cambios que hagas
- Mantén README actualizado

### 3. Backups Automáticos
- Railway hace backups de PostgreSQL automáticamente
- Exporta tu código regularmente
- Guarda versiones anteriores

### 4. Comunidad
- Discord/Telegram de usuarios
- Email para soporte
- Recolecta feedback constantemente

---

## ✅ CHECKLIST FINAL DE LANZAMIENTO

### Pre-Launch
- [ ] Código en GitHub
- [ ] MercadoPago verificado
- [ ] Railway deployado
- [ ] Base de datos migrada
- [ ] Webhooks configurados
- [ ] Frontend publicado
- [ ] Probado end-to-end
- [ ] Modo TEST funciona perfecto

### Launch Day
- [ ] Cambiar a credenciales PRODUCCIÓN
- [ ] Hacer compra de prueba real
- [ ] Verificar pago se acredita
- [ ] Anunciar en redes sociales
- [ ] Enviar emails a beta users
- [ ] Monitorear logs activamente

### Post-Launch
- [ ] Responder consultas <24h
- [ ] Arreglar bugs <48h
- [ ] Agregar features solicitadas
- [ ] Iterar basado en feedback
- [ ] Escalar según demanda

---

## 🎉 ¡LISTO PARA LANZAR!

**Tienes TODO lo necesario**:
- ✅ Backend completo y probado
- ✅ Base de datos configurada
- ✅ Pagos con MercadoPago
- ✅ Automatizaciones incluidas
- ✅ Frontend funcional
- ✅ Documentación completa
- ✅ Precios correctos 2026

**Tiempo estimado para tener todo online**:
- GitHub: 5 minutos
- MercadoPago: 15 minutos
- Railway: 10 minutos
- Testing: 10 minutos
- **TOTAL: ~40 minutos** ⚡

---

## 📞 ÚLTIMA VERIFICACIÓN

```bash
✓ Código descargado: promptforge-final/
✓ Git inicializado
✓ GitHub repo creado
✓ MercadoPago cuenta creada
✓ Railway cuenta creada
✓ Variables de entorno listas
✓ Frontend preparado

→ LISTO PARA DEPLOY 🚀
```

---

**¿Alguna duda antes de lanzar? ¡Estás a minutos de tener tu plataforma online!** 💪
