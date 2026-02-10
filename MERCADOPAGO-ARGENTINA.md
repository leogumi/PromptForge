# 💳 GUÍA: MERCADO PAGO PARA ARGENTINA

## ✅ SÍ, PUEDES CREAR LA PLATAFORMA SIN STRIPE

Tu plataforma ahora soporta **2 sistemas de pago**:

1. **Stripe** - Para usuarios internacionales
2. **Mercado Pago** - Para Argentina y Latinoamérica ⭐

---

## 🇦🇷 MERCADO PAGO - MEJOR OPCIÓN PARA ARGENTINA

### Ventajas
- ✅ **Creado para Latinoamérica**
- ✅ Acepta todos los medios de pago argentinos
- ✅ Tarjetas de crédito/débito locales
- ✅ Transferencia bancaria
- ✅ Efectivo (Rapipago, Pago Fácil)
- ✅ Mercado Crédito
- ✅ Retiros en pesos (ARS)
- ✅ Sin costo de setup
- ✅ Soporte en español

### Costos
- **Comisión**: 4.99% + $2 ARS por transacción
- **Setup**: $0
- **Mensualidad**: $0
- **Retiros**: Gratis a cuenta bancaria

---

## 📋 PASO 1: CREAR CUENTA MERCADO PAGO

### 1.1 Registro

1. **Ir a**: https://www.mercadopago.com.ar
2. **Click en "Crear cuenta"**
3. **Completar datos**:
   - Email
   - Contraseña
   - CUIT/CUIL
   - Datos personales

4. **Verificar identidad**:
   - Foto DNI frente y dorso
   - Selfie con DNI
   - Aprobación en 24-48 horas

### 1.2 Activar Cuenta para Cobros

1. **Ir a**: https://www.mercadopago.com.ar/developers
2. **Click en "Tus integraciones"**
3. **Crear aplicación**:
   - Nombre: "PromptForge"
   - Descripción: "Plataforma de prompts de IA"
   - Click "Crear aplicación"

### 1.3 Obtener Credenciales

**En el panel de tu aplicación**:

1. **Credenciales de Prueba** (para desarrollo):
   ```
   Public Key: TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   Access Token: TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

2. **Credenciales de Producción** (para cobrar de verdad):
   ```
   Public Key: APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   Access Token: APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. **Copiar estas credenciales** ✏️

---

## 🔧 PASO 2: CONFIGURAR EN TU APLICACIÓN

### 2.1 Variables de Entorno

En tu archivo `.env`:

```env
# MercadoPago (Argentina/LATAM)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token-aqui
MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key-aqui

# URLs
BACKEND_URL=https://tu-app.railway.app
FRONTEND_URL=https://tu-frontend.com
```

### 2.2 Deploy en Railway

```bash
# En Railway → Variables
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
BACKEND_URL=https://tu-app-production.up.railway.app
FRONTEND_URL=https://tu-dominio.com
```

---

## 📊 PASO 3: CONFIGURAR PRECIOS

### Conversión USD → ARS

Los planes están en USD pero Mercado Pago cobra en ARS.

**Conversión 2026**:
- 1 USD = ~1,200 ARS

**Precios configurados**:

| Plan | USD/mes | ARS/mes |
|------|---------|---------|
| Básico | $19 | $22,800 |
| Premium | $49 | $58,800 |
| Enterprise | $149 | $178,800 |

**Estos precios ya están en el código** ✅

Si quieres cambiarlos, edita:
`backend/routes/payments-mercadopago.js` línea 27-42

---

## 🔔 PASO 4: CONFIGURAR WEBHOOKS

### ¿Qué son los Webhooks?

Mercado Pago te notifica cuando un pago se completa.

### Configuración:

1. **Ir a**: Panel de tu aplicación → "Webhooks"
2. **Agregar URL**:
   ```
   https://tu-app.railway.app/api/payments-mp/webhook
   ```
3. **Seleccionar eventos**:
   - ✅ `payment` - Notificación de pagos

4. **Guardar**

**IMPORTANTE**: La URL debe ser HTTPS (Railway lo da automáticamente)

---

## 🧪 PASO 5: PROBAR CON TARJETAS DE PRUEBA

### Antes de Producción

Mercado Pago ofrece **tarjetas de prueba** para probar:

**Tarjeta que funciona**:
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha venc: 11/25
Nombre: APRO (aprobar pago)
DNI: 12345678
```

**Tarjeta que falla**:
```
Número: 5031 4332 1540 6351
Nombre: OTRE (otro error)
```

**Más tarjetas**: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/integration-test/test-cards

### Cómo Probar

1. **Usar credenciales de TEST**
2. **Registrar usuario en tu app**
3. **Intentar suscribirse a un plan**
4. **Usar tarjeta de prueba**
5. **Verificar que se active el plan**

---

## 💰 PASO 6: ACTIVAR MODO PRODUCCIÓN

### Cuando Todo Funciona

1. **En Mercado Pago**:
   - Completar verificación de cuenta
   - Agregar cuenta bancaria
   - Activar modo producción

2. **En tu aplicación**:
   - Cambiar de credenciales TEST a APP_USR
   - Actualizar en Railway
   - Restart del servidor

3. **Probar con pago real** (poco monto primero)

---

## 🔄 CÓMO FUNCIONA EL FLUJO DE PAGO

### Suscripción a Plan

```
Usuario → Click "Suscribirse"
    ↓
Backend crea "preference" en Mercado Pago
    ↓
Usuario es redirigido a checkout de Mercado Pago
    ↓
Usuario paga con su método preferido
    ↓
Mercado Pago notifica a tu webhook
    ↓
Backend actualiza plan del usuario
    ↓
Usuario vuelve al dashboard con plan activo ✅
```

### Compra en Marketplace

```
Usuario → Click "Comprar Prompt"
    ↓
Backend crea preference con precio del prompt
    ↓
Usuario paga en Mercado Pago
    ↓
Webhook procesa la compra
    ↓
Se registra venta y comisión
    ↓
Usuario obtiene acceso al prompt ✅
```

---

## 💸 RETIROS DE DINERO

### Cómo Cobrar tus Ganancias

1. **Ir a**: Mercado Pago → "Dinero"
2. **Click "Transferir dinero"**
3. **Seleccionar cuenta bancaria**
4. **Confirmar monto**
5. **Recibir en 1-2 días hábiles**

### Sin Costo
- ✅ Transferencia a cuenta bancaria: GRATIS
- ✅ Mínimo para retirar: $1 ARS

---

## 📱 MEDIOS DE PAGO SOPORTADOS

### En Argentina

**Tarjetas de Crédito**:
- Visa
- Mastercard
- American Express
- Cabal
- Naranja
- Tarjeta Shopping

**Tarjetas de Débito**:
- Visa Débito
- Mastercard Débito
- Maestro

**Efectivo**:
- Rapipago
- Pago Fácil
- Cobro Express

**Transferencia**:
- Mercado Pago
- Mercado Crédito

### Cuotas (Opcional)

Puedes ofrecer **cuotas sin interés** o con interés:
- 3 cuotas sin interés
- 6 cuotas sin interés
- 12 cuotas con interés

*Esto se configura en el código si quieres*

---

## 🔐 SEGURIDAD

### Certificación PCI

- ✅ Mercado Pago es **PCI DSS Level 1** certificado
- ✅ Tú NO manejas datos de tarjetas
- ✅ Todo se procesa en Mercado Pago

### HTTPS Obligatorio

- ✅ Railway provee HTTPS automáticamente
- ✅ Necesario para webhooks

---

## 🌎 OTROS PAÍSES SOPORTADOS

Mercado Pago funciona en:
- 🇦🇷 Argentina
- 🇧🇷 Brasil
- 🇲🇽 México
- 🇨🇱 Chile
- 🇨🇴 Colombia
- 🇵🇪 Perú
- 🇺🇾 Uruguay

*Mismo código, solo cambia la URL del país*

---

## 🆘 TROUBLESHOOTING

### "Invalid credentials"
- Verificar que copiaste el Access Token completo
- Asegurarte de usar APP_USR (no TEST) en producción

### "Webhook not receiving notifications"
- Verificar URL es HTTPS
- Verificar URL es pública (no localhost)
- Verificar ruta es `/api/payments-mp/webhook`

### "Payment not approved"
- Si es tarjeta de prueba, usar las correctas
- Si es producción, verificar fondos del usuario

### "User not upgraded after payment"
- Revisar logs del webhook
- Verificar metadata llegó correctamente
- Verificar user_id es válido

---

## 📊 DASHBOARD Y REPORTES

### Ver tus Ventas

**En Mercado Pago**:
1. Ir a "Actividad"
2. Ver todas las transacciones
3. Filtrar por fecha, estado, monto
4. Descargar reportes en Excel

**En PromptForge**:
- Dashboard muestra tus ganancias
- Basado en la tabla `purchases`
- Analytics en tiempo real

---

## 💡 TIPS IMPORTANTES

### Para Maximizar Conversiones

1. **Ofrecer múltiples medios de pago**
   - Tarjeta + efectivo = +30% conversión

2. **Cuotas sin interés**
   - Plans más caros en 3-6 cuotas
   - Aumenta ticket promedio

3. **Mostrar logo de Mercado Pago**
   - Genera confianza
   - Usuario sabe que puede pagar con su cuenta MP

4. **Precios en ARS claros**
   - Mostrar precio en pesos
   - Usuario sabe exactamente cuánto paga

---

## 📈 COMPARACIÓN: MERCADO PAGO VS STRIPE

| Feature | Mercado Pago | Stripe |
|---------|-------------|--------|
| **Disponible en ARG** | ✅ Sí | ❌ No directamente |
| **Medios de pago ARG** | ✅ Todos | ⚠️ Solo tarjetas internacionales |
| **Efectivo** | ✅ Sí | ❌ No |
| **Cuotas** | ✅ Sí | ❌ No (ARG) |
| **Comisión** | 4.99% + $2 | 2.9% + $0.30 (USD) |
| **Setup** | ✅ Gratis | ✅ Gratis |
| **Documentación** | ✅ En español | ✅ En inglés |
| **Soporte** | ✅ Local | ⚠️ Internacional |

**Para Argentina**: Mercado Pago es superior ⭐

---

## ✅ CHECKLIST FINAL

### Desarrollo
- [ ] Cuenta Mercado Pago creada
- [ ] Aplicación creada en Developers
- [ ] Credenciales TEST copiadas
- [ ] Variables en `.env` configuradas
- [ ] Código deployado en Railway
- [ ] Webhook configurado
- [ ] Probado con tarjeta de prueba
- [ ] Suscripción funciona
- [ ] Compra en marketplace funciona

### Producción
- [ ] Cuenta verificada (DNI)
- [ ] Cuenta bancaria agregada
- [ ] Credenciales APP_USR en Railway
- [ ] Webhook actualizado
- [ ] Probado con pago real pequeño
- [ ] Todo funciona correctamente
- [ ] ¡Listo para vender! 🚀

---

## 🎓 RECURSOS

### Documentación Oficial
- **General**: https://www.mercadopago.com.ar/developers/es/docs
- **API Reference**: https://www.mercadopago.com.ar/developers/es/reference
- **Checkout Pro**: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing

### Videos Tutoriales
- Canal de YouTube: MercadoPagoDevs
- Curso gratuito de integración

### Soporte
- Email: developers@mercadopago.com
- Forum: https://www.mercadopago.com.ar/developers/es/support

---

## 💰 PROYECCIÓN DE INGRESOS (ARGENTINA)

### Escenario Conservador (100 usuarios argentinos)

**Suscripciones**:
- 20 básicos × $22,800 = $456,000/mes
- 8 premium × $58,800 = $470,400/mes
- 2 enterprise × $178,800 = $357,600/mes
- **Total suscripciones**: $1,284,000 ARS/mes (~$1,070 USD)

**Marketplace** (50 ventas/mes promedio $12,000 ARS):
- $600,000 en ventas
- Comisión 10% promedio = $60,000/mes

**Total mensual**: ~$1,344,000 ARS (~$1,120 USD)

**Después de comisiones MP** (5%):
- Ingreso neto: ~$1,276,800 ARS/mes (~$1,064 USD)

### Escenario Optimista (1000 usuarios)

- Suscripciones: ~$12,840,000 ARS/mes (~$10,700 USD)
- Marketplace: ~$600,000 ARS/mes (~$500 USD)
- **Total**: ~$13,440,000 ARS/mes (~$11,200 USD/mes)
- **Después MP**: ~$12,768,000 ARS/mes (~$10,640 USD/mes)

---

## 🎉 ¡LISTO PARA ARGENTINA!

Tu plataforma ahora puede:
- ✅ Aceptar pagos de usuarios argentinos
- ✅ Cobrar en pesos (ARS)
- ✅ Ofrecer todos los medios de pago locales
- ✅ Retirar ganancias a cuenta bancaria argentina

**No necesitas Stripe. Mercado Pago es mejor para tu mercado.** 🇦🇷

---

**¿Dudas? Todo está configurado y listo. Solo necesitas:**
1. Crear cuenta Mercado Pago
2. Copiar credenciales
3. Deploy
4. ¡Empezar a vender! 💰
