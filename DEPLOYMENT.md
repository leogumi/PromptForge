# 🚀 Guía de Deployment - PromptForge

## Opción 1: Deploy Rápido con Railway.app (RECOMENDADO)

### ¿Por qué Railway?
- ✅ Deploy en 5 minutos
- ✅ PostgreSQL incluido gratis
- ✅ SSL automático
- ✅ $5/mes (gratis los primeros $5)
- ✅ Escalado automático

### Pasos:

1. **Crear cuenta**: https://railway.app
2. **Nuevo Proyecto** → "Deploy from GitHub"
3. **Conectar repositorio** de PromptForge
4. **Agregar PostgreSQL**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automáticamente configura DB_HOST, DB_USER, etc.

5. **Configurar Variables de Entorno**:
   ```
   JWT_SECRET=tu-secreto-super-seguro-cambialo
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_BASIC=price_...
   STRIPE_PRICE_PREMIUM=price_...
   STRIPE_PRICE_ENTERPRISE=price_...
   OPENAI_API_KEY=sk-... (opcional)
   ANTHROPIC_API_KEY=sk-ant-... (opcional)
   FRONTEND_URL=https://tu-app.up.railway.app
   ```

6. **Deploy**:
   - Railway automáticamente detecta Node.js
   - Build y deploy en ~2 minutos
   - URL pública: `https://tu-app.up.railway.app`

7. **Ejecutar Migraciones**:
   - En Railway dashboard → tu servicio → "Shell"
   - Ejecutar: `node database/migrate.js`

8. **Configurar Stripe Webhook**:
   - URL: `https://tu-app.up.railway.app/api/payments/webhook`
   - Copiar Webhook Secret a variables de entorno

**¡LISTO! Tu app está en producción** 🎉

---

## Opción 2: Vercel + Supabase (Gratis)

### Backend en Vercel

1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   cd backend
   vercel
   ```

2. **Crear `vercel.json`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

3. **Configurar Supabase (PostgreSQL gratis)**:
   - Ir a https://supabase.com
   - Crear proyecto
   - Copiar connection string
   - Agregar a Vercel env vars

### Frontend en Vercel

```bash
cd frontend
vercel
```

---

## Opción 3: Heroku (Fácil pero $7/mes)

```bash
# Login
heroku login

# Crear app
heroku create promptforge-prod

# Agregar PostgreSQL ($7/mes)
heroku addons:create heroku-postgresql:mini

# Variables de entorno
heroku config:set JWT_SECRET=tu-secreto
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set OPENAI_API_KEY=sk-...

# Deploy
git push heroku main

# Migraciones
heroku run node database/migrate.js

# Ver logs
heroku logs --tail
```

---

## Opción 4: DigitalOcean Droplet ($6/mes)

### 1. Crear Droplet
- Ubuntu 22.04 LTS
- 1GB RAM ($6/mes)
- Datacenter cerca de tu audiencia

### 2. Configurar servidor

```bash
# SSH al servidor
ssh root@tu-ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres createdb promptforge
sudo -u postgres psql
ALTER USER postgres PASSWORD 'tu-password-seguro';
\q

# Instalar Nginx
apt install -y nginx

# Instalar PM2
npm install -g pm2

# Clonar repositorio
cd /var/www
git clone https://github.com/tu-usuario/promptforge.git
cd promptforge/backend
npm install

# Configurar .env
nano .env
# (pegar todas las variables)

# Ejecutar migraciones
node ../database/migrate.js

# Iniciar con PM2
pm2 start server.js --name promptforge
pm2 startup
pm2 save
```

### 3. Configurar Nginx

```bash
nano /etc/nginx/sites-available/promptforge
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/promptforge /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Instalar SSL con Let's Encrypt
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tu-dominio.com
```

---

## Opción 5: Docker en cualquier servidor

```bash
# En tu servidor
git clone https://github.com/tu-usuario/promptforge.git
cd promptforge

# Crear .env
cp backend/.env.example .env
nano .env
# (configurar variables)

# Deploy con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ejecutar migraciones
docker-compose exec backend node /app/database/migrate.js
```

---

## 🔧 Configuración Post-Deployment

### 1. Configurar Dominio

**Opción A: Railway/Vercel (automático)**
- Ya tienen dominios: `tu-app.railway.app`
- Puedes agregar dominio custom gratis

**Opción B: Namecheap/GoDaddy**
```
Crear registro A:
@ → TU_IP_SERVIDOR

Crear registro CNAME:
www → tu-dominio.com
```

### 2. Configurar Stripe Webhooks

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://tu-dominio.com/api/payments/webhook`
3. Seleccionar eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Copiar Signing Secret
5. Agregar a variables de entorno: `STRIPE_WEBHOOK_SECRET`

### 3. Crear Productos en Stripe

```bash
# O usar Stripe Dashboard UI
stripe products create --name="Plan Básico"
stripe prices create --product=prod_xxx --amount=1900 --currency=usd --recurring[interval]=month

stripe products create --name="Plan Premium"
stripe prices create --product=prod_xxx --amount=4900 --currency=usd --recurring[interval]=month

stripe products create --name="Plan Enterprise"
stripe prices create --product=prod_xxx --amount=14900 --currency=usd --recurring[interval]=month
```

Copiar Price IDs a `.env`:
```
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

---

## 📊 Monitoreo

### Logs en Railway
```
Railway Dashboard → tu servicio → Observability → Logs
```

### Logs en Heroku
```bash
heroku logs --tail
```

### Logs en DigitalOcean
```bash
pm2 logs promptforge
```

---

## 🔄 Actualizaciones

### Railway/Vercel
```bash
git push origin main
# Auto-deploy ✅
```

### Heroku
```bash
git push heroku main
```

### DigitalOcean
```bash
ssh root@tu-ip
cd /var/www/promptforge
git pull
cd backend
npm install
pm2 restart promptforge
```

---

## ✅ Checklist Pre-Launch

- [ ] Base de datos PostgreSQL configurada
- [ ] Migraciones ejecutadas
- [ ] Variables de entorno configuradas
- [ ] Stripe configurado (modo live)
- [ ] Webhooks de Stripe funcionando
- [ ] API Keys de IA configuradas
- [ ] SSL/HTTPS activo
- [ ] Dominio apuntando correctamente
- [ ] Pruebas de registro/login
- [ ] Prueba de crear prompt
- [ ] Prueba de compra
- [ ] Prueba de suscripción
- [ ] Logs monitoreados

---

## 🎯 Costos Mensuales Estimados

### Opción Económica (Railway)
- Railway: $5/mes (incluye PostgreSQL)
- Stripe: 2.9% + $0.30 por transacción
- OpenAI API: ~$10-50/mes según uso
- **TOTAL: ~$20-60/mes**

### Opción Pro (DigitalOcean)
- Droplet: $6/mes
- Dominio: $12/año
- Stripe: 2.9% + $0.30
- OpenAI API: ~$50-200/mes
- **TOTAL: ~$60-210/mes**

---

## 🆘 Troubleshooting

### Error: Cannot connect to database
```bash
# Verificar que PostgreSQL esté corriendo
# Railway: automático
# Heroku: heroku pg:info
# DO: systemctl status postgresql
```

### Error: Stripe webhook failing
```bash
# Verificar que STRIPE_WEBHOOK_SECRET sea correcto
# Probar con Stripe CLI:
stripe listen --forward-to localhost:5000/api/payments/webhook
```

### Error: OpenAI API rate limit
```bash
# Implementar caché de respuestas
# Limitar requests por usuario
# Actualizar a tier de pago en OpenAI
```

---

**¿Problemas? Abrir issue en GitHub o contactar soporte@promptforge.com**
