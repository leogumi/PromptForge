# 📁 Estructura del Proyecto PromptForge

```
promptforge-app/
│
├── 📂 backend/                    # API Backend (Node.js + Express)
│   ├── 📂 config/
│   │   └── database.js           # Configuración PostgreSQL
│   │
│   ├── 📂 middleware/
│   │   └── auth.js               # JWT Authentication
│   │
│   ├── 📂 routes/
│   │   ├── auth.js               # Registro, Login, Verificación
│   │   ├── prompts.js            # CRUD de Prompts
│   │   ├── marketplace.js        # Compra/Venta
│   │   ├── payments.js           # Stripe + Suscripciones
│   │   ├── ai.js                 # Generación con IA
│   │   └── users.js              # Perfil y Analytics
│   │
│   ├── server.js                 # Servidor principal
│   ├── package.json              # Dependencias
│   ├── .env.example              # Template de variables
│   └── .env                      # Variables (NO COMMITEAR)
│
├── 📂 database/
│   └── migrate.js                # Migraciones SQL
│
├── 📂 frontend/                   # React App (próximamente)
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 pages/
│   │   ├── 📂 hooks/
│   │   ├── 📂 services/
│   │   └── App.js
│   │
│   └── package.json
│
├── 📄 README.md                  # Documentación principal
├── 📄 DEPLOYMENT.md              # Guía de deployment
├── 📄 docker-compose.yml         # Docker orchestration
├── 📄 Dockerfile                 # Container config
└── 📄 setup.sh                   # Script de instalación
```

## 🗄️ Base de Datos

### Tablas

**users**
- Usuarios registrados
- Planes de suscripción
- Uso de prompts

**prompts**
- Prompts creados
- Contenido y metadata
- Estado de publicación

**purchases**
- Transacciones marketplace
- Comisiones calculadas
- Historia de ventas

**subscriptions**
- Suscripciones activas
- Integración Stripe
- Períodos de facturación

**reviews**
- Calificaciones
- Comentarios
- Ratings promedio

**templates**
- Plantillas predefinidas
- Variables configurables
- Premium vs Free

**analytics**
- Eventos de usuarios
- Métricas de uso
- Tracking

## 🔐 Autenticación

### Flow de Login
1. POST /api/auth/login → Token JWT
2. Cliente guarda token en localStorage
3. Todas las requests: Header `Authorization: Bearer <token>`
4. Backend verifica con middleware `authenticateToken`

### Flow de Registro
1. POST /api/auth/register → Usuario creado + Token
2. Plan default: 'free'
3. Límite: 5 prompts

## 💳 Sistema de Pagos

### Suscripciones (Stripe)
1. Cliente selecciona plan
2. POST /api/payments/create-subscription
3. Redirect a Stripe Checkout
4. Stripe procesa pago
5. Webhook actualiza base de datos
6. Plan activado

### Marketplace
1. Usuario compra prompt
2. POST /api/marketplace/purchase/:id
3. Se calcula comisión según plan vendedor
4. Se registra purchase
5. Buyer obtiene acceso al prompt

## 🤖 Generación con IA

### API Soportadas
- OpenAI GPT-4
- Anthropic Claude
- Fallback a template local

### Process
1. POST /api/ai/generate
2. Backend llama a API de IA
3. Genera prompt optimizado
4. Retorna al cliente
5. Cliente puede editar/guardar

## 📊 Analytics

### Métricas Disponibles
- Ingresos totales
- Prompts vendidos
- Rating promedio
- Prompts activos
- Gráficas mensuales

### Endpoint
GET /api/users/analytics

## 🔄 Flujo Completo de Usuario

### Nuevo Usuario
1. Registro → Plan Free
2. Crea hasta 5 prompts
3. Alcanza límite
4. Modal de upgrade
5. Suscribe a plan
6. Acceso completo

### Vendedor
1. Crea prompt
2. Publica en marketplace
3. Establece precio
4. Recibe ventas
5. Comisión según plan
6. Visualiza analytics

### Comprador
1. Navega marketplace
2. Compra prompt
3. Accede a contenido
4. Deja review
5. Usa prompt

## 🚀 Deploy Checklist

- [ ] Repositorio GitHub creado
- [ ] .env configurado (NO COMMITEAR)
- [ ] PostgreSQL database creada
- [ ] Migraciones ejecutadas
- [ ] Stripe configurado
- [ ] API Keys de IA obtenidas
- [ ] Deploy en Railway/Heroku/DO
- [ ] Dominio configurado
- [ ] SSL activo
- [ ] Webhooks Stripe configurados
- [ ] Pruebas end-to-end
- [ ] Monitoreo activo

## 📈 Escalamiento

### Fase 1: MVP (actual)
- Backend funcional
- Base de datos PostgreSQL
- Stripe integrado
- IA generación

### Fase 2: Producción
- Frontend React completo
- CDN para assets
- Redis para caché
- Email notifications
- Analytics avanzados

### Fase 3: Scale
- Load balancer
- Database replicas
- Microservicios
- Queue system (Bull)
- Multi-region

## 🛡️ Seguridad

### Implementado
✅ JWT con expiración
✅ Passwords hasheados (bcrypt)
✅ Rate limiting
✅ SQL injection protection
✅ CORS configurado
✅ Helmet.js headers
✅ Input validation

### Próximamente
- [ ] 2FA
- [ ] OAuth (Google, GitHub)
- [ ] API rate limiting por usuario
- [ ] Captcha
- [ ] IP blocking
- [ ] Audit logs

## 📞 Soporte

**Documentación**: README.md
**Deploy**: DEPLOYMENT.md
**Issues**: GitHub Issues
**Email**: soporte@promptforge.com

---

Creado con ❤️ para la comunidad de IA
