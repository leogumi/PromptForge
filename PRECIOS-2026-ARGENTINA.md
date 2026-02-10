# 💰 PRECIOS ACTUALIZADOS 2026 - ARGENTINA

## ✅ CONVERSIÓN CORRECTA USD → ARS

### Tipo de Cambio 2026
**1 USD = 1,200 ARS** (aproximado febrero 2026)

---

## 💳 PLANES DE SUSCRIPCIÓN

### Plan Básico
- **USD**: $19/mes
- **ARS**: $22,800/mes
- 50 prompts mensuales
- Venta en marketplace
- 15% comisión

### Plan Premium ⭐
- **USD**: $49/mes
- **ARS**: $58,800/mes
- Prompts ilimitados
- 5% comisión
- Analytics avanzados
- Badge premium

### Plan Enterprise
- **USD**: $149/mes
- **ARS**: $178,800/mes
- Todo de Premium
- 0% comisión
- API personalizada
- Soporte 24/7

---

## 🏪 MARKETPLACE

### Prompts en Venta
Los precios se convierten automáticamente:

**Ejemplos**:
- Prompt $5 USD = $6,000 ARS
- Prompt $10 USD = $12,000 ARS
- Prompt $20 USD = $24,000 ARS
- Prompt $50 USD = $60,000 ARS

**El código ya hace la conversión automática** usando la tasa: 1 USD = 1,200 ARS

---

## 📊 PROYECCIONES DE INGRESOS REALISTAS

### Con 50 Usuarios Activos (Arranque)
**Suscripciones**:
- 35 gratis: $0
- 10 básicos: $228,000 ARS
- 4 premium: $235,200 ARS
- 1 enterprise: $178,800 ARS

**Subtotal**: $642,000 ARS/mes (~$535 USD/mes)

**Marketplace** (20 ventas × $12,000 promedio):
- Ventas: $240,000 ARS
- Comisión 10%: $24,000 ARS

**Total Bruto**: $666,000 ARS/mes (~$555 USD/mes)
**Después de MP (5%)**: $632,700 ARS/mes (~$527 USD/mes)

### Con 200 Usuarios (Crecimiento)
**Suscripciones**:
- 120 gratis: $0
- 50 básicos: $1,140,000 ARS
- 25 premium: $1,470,000 ARS
- 5 enterprise: $894,000 ARS

**Subtotal**: $3,504,000 ARS/mes (~$2,920 USD/mes)

**Marketplace** (100 ventas × $12,000):
- Ventas: $1,200,000 ARS
- Comisión 10%: $120,000 ARS

**Total Bruto**: $3,624,000 ARS/mes (~$3,020 USD/mes)
**Después de MP (5%)**: $3,442,800 ARS/mes (~$2,869 USD/mes)

### Con 1,000 Usuarios (Escala)
**Suscripciones**:
- 550 gratis: $0
- 300 básicos: $6,840,000 ARS
- 130 premium: $7,644,000 ARS
- 20 enterprise: $3,576,000 ARS

**Subtotal**: $18,060,000 ARS/mes (~$15,050 USD/mes)

**Marketplace** (500 ventas × $12,000):
- Ventas: $6,000,000 ARS
- Comisión 10%: $600,000 ARS

**Total Bruto**: $18,660,000 ARS/mes (~$15,550 USD/mes)
**Después de MP (5%)**: $17,727,000 ARS/mes (~$14,772 USD/mes)

---

## 💡 ¿SON CAROS LOS PLANES?

### Comparación con el Mercado Argentino 2026

**Software/SaaS similar**:
- Canva Pro: ~$18,000 ARS/mes
- Notion Plus: ~$20,000 ARS/mes
- ChatGPT Plus: ~$24,000 ARS/mes
- Adobe Creative: ~$45,000 ARS/mes

**PromptForge Básico**: $22,800 ARS/mes ✅ Competitivo

### Poder Adquisitivo
Con salario promedio argentino ~$600,000 ARS/mes:
- Plan Básico = 3.8% del salario
- Plan Premium = 9.8% del salario
- Plan Enterprise = 29.8% del salario

**Para freelancers/empresas que monetizan con IA, es accesible** 💰

---

## 🎯 ESTRATEGIA DE PRECIOS

### Para Maximizar Conversiones

**1. Ofrecer Trial Extendido**
- 5 prompts gratis ✅ (ya implementado)
- Mostrar valor antes de cobrar
- Conversión típica: 10-20%

**2. Descuentos por Anual**
Si pagas 12 meses adelantado:
- Básico: $22,800 → $19,380/mes (15% off)
- Premium: $58,800 → $49,980/mes (15% off)
- Enterprise: $178,800 → $152,000/mes (15% off)

*Puedes implementar esto fácilmente*

**3. Pricing Psicológico**
- $22,800 en vez de $25,000
- $58,800 en vez de $60,000
- Parece más barato

**4. Cuotas Sin Interés**
Mercado Pago permite ofrecer:
- Plan Premium: 3 cuotas de $19,600
- Plan Enterprise: 6 cuotas de $29,800

*Aumenta conversión 30-40%*

---

## 🔄 ACTUALIZAR PRECIOS EN EL FUTURO

### Si el Dólar Sube/Baja

El código está en:
`backend/routes/payments-mercadopago.js`

```javascript
// Línea 19-41
const planPrices = {
  basic: {
    amount: 22800, // ← CAMBIAR AQUÍ
    title: 'Plan Básico - PromptForge',
    description: '50 prompts mensuales, venta en marketplace'
  },
  // ... resto de planes
}
```

### Cómo Decidir el Precio

**Fórmula simple**:
```
Precio ARS = Precio USD × Tasa Cambio × Factor Ajuste

Factor Ajuste = 1.0 a 1.2 (para redondear y compensar inflación)
```

**Ejemplo si dólar = 1,500 ARS**:
- Básico: $19 × 1,500 × 1.05 = $29,925 ≈ $29,900 ARS
- Premium: $49 × 1,500 × 1.05 = $77,175 ≈ $77,000 ARS

---

## 📱 MEDIOS DE PAGO Y CUOTAS

### Configuración Recomendada

**Plan Básico** ($22,800):
- Sin cuotas (pago único mensual)
- Todos los medios de pago

**Plan Premium** ($58,800):
- Hasta 3 cuotas sin interés
- O 6 cuotas con interés
- Aumenta conversión

**Plan Enterprise** ($178,800):
- Hasta 6 cuotas sin interés
- O 12 cuotas con interés
- Para empresas

### Implementar Cuotas

En `payments-mercadopago.js`, agregar:

```javascript
payment_methods: {
  excluded_payment_types: [],
  installments: 3, // ← 3 cuotas sin interés
  default_installments: 1
}
```

---

## 💰 RENTABILIDAD DEL NEGOCIO

### Costos Fijos Mensuales
- Railway: $5 USD ≈ $6,000 ARS
- Dominio: $1 USD ≈ $1,200 ARS
- **Total**: ~$7,200 ARS/mes

### Punto de Equilibrio
Con 1 suscripción Básica ya cubrís costos ✅

### Margen de Ganancia
- Costo infraestructura: ~$7,200 ARS
- Comisión MP: ~5% por transacción
- **Margen neto**: ~90% 🚀

### ROI
Si invertís 10 horas creando la plataforma:
- Valor tiempo: $200,000 ARS (aprox)
- Con 10 usuarios: Recuperás inversión en 1 mes
- Con 50 usuarios: ROI 300% mensual

---

## 🎁 ESTRATEGIAS DE LANZAMIENTO

### Mes 1: Precio Introductorio
- Básico: $18,000 (20% off)
- Premium: $47,000 (20% off)
- Enterprise: $143,000 (20% off)

**Limitado a primeros 100 usuarios**

### Mes 2-3: Precio Normal
- Precios completos
- Grandfathering para early adopters

### Mes 4+: Optimizar
- Analizar conversión por plan
- A/B testing de precios
- Ajustar según inflación

---

## 📊 MÉTRICAS CLAVE A MONITOREAR

### KPIs Importantes
1. **Conversión Free → Paid**: Objetivo 10-15%
2. **Churn mensual**: Objetivo <5%
3. **LTV (Lifetime Value)**: $200,000+ ARS
4. **CAC (Costo Adquisición)**: <$50,000 ARS
5. **MRR (Revenue Recurrente)**: Crecimiento 20%/mes

### Dashboard Sugerido
```
MRR Actual: $1,284,000 ARS
Crecimiento MoM: +25%
Usuarios activos: 100
Conversión: 12%
Churn: 3%
```

---

## ✅ RESUMEN EJECUTIVO

**Precios 2026 Correctos**:
- ✅ Básico: $22,800 ARS/mes
- ✅ Premium: $58,800 ARS/mes
- ✅ Enterprise: $178,800 ARS/mes

**Competitivos**: Sí, están en línea con el mercado ✅
**Rentables**: Sí, 90% de margen ✅
**Escalables**: Sí, sin límite ✅

**Todo el código ya tiene los precios correctos** 🎉

---

**¿Ajustar algo más? Los precios están listos para 2026** 💪
