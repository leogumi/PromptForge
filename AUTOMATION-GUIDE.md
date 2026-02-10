# 🤖 GUÍA COMPLETA: Automatizaciones con IA - n8n, Make, Zapier

## 🎯 Nueva Funcionalidad Agregada

PromptForge ahora incluye **generación automática de workflows** para las principales plataformas de automatización, con prompts de IA integrados.

---

## 📋 ¿Qué Puedes Hacer?

### Generar Workflows Completos para:
- ✅ **n8n** - Workflows open source auto-hospedados
- ✅ **Make** (Integromat) - Escenarios visuales no-code
- ✅ **Zapier** - Zaps simples y rápidos

### Con Prompts AI Integrados:
- 🤖 Extracción de información de emails
- 🤖 Clasificación automática de contenido
- 🤖 Generación de respuestas personalizadas
- 🤖 Análisis y scoring de datos
- 🤖 Resúmenes automáticos
- 🤖 Traducción y transformación de texto

---

## 🚀 CASOS DE USO INCLUIDOS

### 1. **Ventas y CRM**
```
Email → AI extrae info → Crea contacto en CRM → Notifica Slack
```
**Ejemplo**: Emails de clientes se procesan automáticamente, extrayendo nombre, empresa, necesidad, y creando el contacto en HubSpot/Salesforce.

### 2. **Marketing y Contenido**
```
Artículo RSS → AI genera posts → Publica en redes sociales
```
**Ejemplo**: Blog posts se convierten automáticamente en hilos de Twitter, posts de LinkedIn y captions de Instagram.

### 3. **Soporte al Cliente**
```
Ticket → AI categoriza y responde → Actualiza Zendesk → Notifica equipo
```
**Ejemplo**: Tickets de soporte se categorizan por urgencia y tipo, con respuestas AI preliminares.

### 4. **Finanzas**
```
Factura en Email → AI extrae datos → Actualiza QuickBooks → Guarda PDF
```
**Ejemplo**: Facturas se procesan automáticamente, extrayendo monto, fecha, proveedor.

### 5. **Recursos Humanos**
```
Aplicación → AI analiza CV → Score candidato → Agenda entrevista
```
**Ejemplo**: CVs se analizan automáticamente y los mejores candidatos se priorizan.

---

## 🛠️ CÓMO USAR

### Paso 1: Seleccionar Plataforma

En la sección **Automatizaciones** de PromptForge:

1. **n8n** - Si tienes servidor propio o usas n8n cloud
2. **Make** - Si prefieres interfaz visual sin código
3. **Zapier** - Si quieres la opción más simple

### Paso 2: Configurar el Workflow

**Campos obligatorios**:
- ✏️ **Nombre**: Descriptivo y claro
- 📝 **Descripción**: Qué hace el workflow paso por paso
- 🎯 **Caso de uso**: Categoría (ventas, marketing, etc.)
- ⚡ **Trigger**: Qué inicia el workflow
- 🎬 **Acciones**: Qué hace al final

**Ejemplo de configuración**:
```
Nombre: Email a CRM con IA
Caso de uso: Ventas
Descripción: Cuando llega un email a ventas@empresa.com, 
extraer nombre, empresa y necesidad con IA, crear contacto 
en HubSpot y notificar a Slack
Trigger: Email Entrante
Acciones: CRM, Slack
```

### Paso 3: Personalizar Prompts AI (Opcional)

En el campo **"Prompts AI Personalizados"** puedes especificar exactamente qué debe hacer la IA:

**Ejemplo**:
```
Analiza este email y extrae:
1. Nombre completo del contacto
2. Empresa donde trabaja
3. Cargo/posición
4. Necesidad o problema que menciona
5. Nivel de urgencia (bajo, medio, alto)
6. Siguiente acción recomendada

Formato de salida: JSON con estas propiedades
```

### Paso 4: Generar el Workflow

Click en **"⚡ Generar Workflow"**

El sistema creará automáticamente:
- 📄 JSON completo del workflow
- 📋 Instrucciones paso a paso
- 🔧 Configuración de nodos/módulos
- 🤖 Prompts AI optimizados

### Paso 5: Implementar

Sigue las instrucciones específicas según la plataforma.

---

## 📚 GUÍA POR PLATAFORMA

### n8n - Workflows Auto-Hospedados

**Ventajas**:
- ✅ Open source y gratis
- ✅ Control total de tus datos
- ✅ Ilimitadas ejecuciones
- ✅ Más flexible y potente

**Implementación**:

1. **Instalar n8n** (si no lo tienes):
   ```bash
   # Opción 1: Docker
   docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
   
   # Opción 2: npm
   npm install n8n -g
   n8n start
   ```

2. **Importar workflow**:
   - Abrir n8n en `http://localhost:5678`
   - Click en **"Workflows"** → **"Import from JSON"**
   - Pegar el JSON generado por PromptForge
   - Click **"Import"**

3. **Configurar credenciales**:
   - OpenAI API: Settings → Credentials → Add OpenAI
   - Otros servicios: Agregar según necesites (Gmail, Slack, etc.)

4. **Activar workflow**:
   - Click en **"Active"** toggle arriba derecha
   - Probar con datos de ejemplo

**n8n Cloud (Alternativa más fácil)**:
- https://n8n.cloud - $20/mes
- Sin instalación, todo en la nube
- Mismo proceso de importación

---

### Make (Integromat) - Escenarios Visuales

**Ventajas**:
- ✅ Interfaz muy visual
- ✅ Sin código necesario
- ✅ Miles de integraciones
- ✅ Plan gratis generoso

**Implementación**:

1. **Crear cuenta**: https://make.com (gratis hasta 1000 ops/mes)

2. **Crear escenario**:
   - Dashboard → **"Create a new scenario"**
   - Agregar módulos manualmente siguiendo el JSON

3. **Configurar módulos**:
   - **Trigger**: Seleccionar el primer módulo según el JSON
   - **OpenAI**: Agregar módulo OpenAI, pegar el prompt
   - **Acciones**: Agregar módulos finales

4. **Conectar módulos**:
   - Arrastrar líneas entre módulos
   - Mapear datos entre pasos

5. **Probar y activar**:
   - Click en **"Run once"**
   - Si funciona, activar con el toggle

**Ejemplo visual**:
```
[Email] → [OpenAI] → [HubSpot] → [Slack]
  ↓          ↓           ↓          ↓
Recibe   Analiza     Crea      Notifica
email    contenido  contacto   equipo
```

---

### Zapier - Zaps Simples

**Ventajas**:
- ✅ Más fácil de todas
- ✅ Setup en minutos
- ✅ Integraciones premium (Salesforce, etc.)
- ✅ Muy confiable

**Implementación**:

1. **Crear cuenta**: https://zapier.com (gratis 100 tasks/mes)

2. **Crear Zap**:
   - Dashboard → **"Create Zap"**
   - Seguir el asistente

3. **Configurar pasos**:
   
   **Paso 1 - Trigger**:
   - Seleccionar app del trigger (Gmail, Webhook, etc.)
   - Configurar evento
   - Probar y obtener datos de ejemplo

   **Paso 2 - AI Processing**:
   - Agregar paso OpenAI
   - Método: "Conversation"
   - Pegar el prompt de PromptForge
   - Mapear datos del trigger

   **Paso 3+ - Acciones**:
   - Agregar cada acción final
   - Mapear datos del paso AI
   - Configurar destinos

4. **Probar y publicar**:
   - Click **"Test & Review"**
   - Si todo funciona, **"Publish"**

---

## 🎓 EJEMPLOS COMPLETOS

### Ejemplo 1: Email a CRM con Resumen AI

**Workflow n8n**:
```json
{
  "name": "Email to CRM with AI Summary",
  "nodes": [
    {
      "name": "Email Trigger",
      "type": "n8n-nodes-base.emailReadImap",
      "parameters": {
        "mailbox": "INBOX",
        "format": "simple"
      }
    },
    {
      "name": "Extract Info with AI",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "model": "gpt-4",
        "prompt": "Extract from this email:\n1. Contact name\n2. Company\n3. Email\n4. Main request\n5. Urgency (low/medium/high)\n\nEmail: {{$json['text']}}\n\nRespond in JSON format."
      }
    },
    {
      "name": "Create Contact",
      "type": "n8n-nodes-base.hubspot",
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "email": "={{$json['email']}}",
        "properties": {
          "firstname": "={{$json['name']}}",
          "company": "={{$json['company']}}"
        }
      }
    },
    {
      "name": "Notify Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#sales",
        "text": "New lead: {{$json['name']}} from {{$json['company']}}"
      }
    }
  ]
}
```

**Beneficio**: Emails de ventas se procesan en segundos, no en horas.

---

### Ejemplo 2: Generador de Contenido Social

**Workflow Make**:
```json
{
  "name": "Blog to Social Media",
  "flow": [
    {
      "id": 1,
      "module": "rss",
      "mapper": {
        "url": "https://miblog.com/feed"
      }
    },
    {
      "id": 2,
      "module": "openai",
      "mapper": {
        "prompt": "Convert this blog post into:\n1. Twitter thread (10 tweets)\n2. LinkedIn post\n3. Instagram caption\n\nBlog: {{1.title}} - {{1.content}}",
        "model": "gpt-4"
      }
    },
    {
      "id": 3,
      "module": "twitter",
      "mapper": {
        "status": "{{2.twitter_thread}}"
      }
    },
    {
      "id": 4,
      "module": "linkedin",
      "mapper": {
        "post": "{{2.linkedin_post}}"
      }
    }
  ]
}
```

**Beneficio**: 1 artículo → 12+ posts automáticamente.

---

### Ejemplo 3: Clasificador de Tickets de Soporte

**Workflow Zapier**:
```
Trigger: Zendesk - New Ticket
↓
Action: OpenAI - Analyze ticket
  Prompt: "Categorize this support ticket:
          Category: (bug/feature/question/complaint)
          Priority: (1-5)
          Sentiment: (positive/neutral/negative)
          Suggested response: (brief)"
↓
Action: Zendesk - Update Ticket
  Set category, priority, add comment
↓
Action: Slack - Notify if priority > 3
```

**Beneficio**: Tickets clasificados instantáneamente, equipo enfoca en urgentes.

---

## 💰 COSTOS

### n8n
- **Self-hosted**: GRATIS (solo costo de servidor ~$5-10/mes)
- **n8n Cloud**: $20/mes (2500 ejecuciones)

### Make
- **Gratis**: 1,000 operaciones/mes
- **Core**: $9/mes (10,000 ops)
- **Pro**: $16/mes (10,000 ops + features)

### Zapier
- **Gratis**: 100 tasks/mes
- **Starter**: $20/mes (750 tasks)
- **Professional**: $49/mes (2,000 tasks)

### OpenAI API (para todos)
- **Costo por uso**: ~$0.002 por request GPT-4
- **Ejemplo**: 1000 ejecuciones = ~$2-5/mes

**Total estimado**: $10-30/mes para automatizar todo tu negocio 🚀

---

## 🎯 MEJORES PRÁCTICAS

### 1. Empieza Simple
No intentes automatizar todo de una vez. Comienza con:
- ✅ 1 workflow sencillo
- ✅ 2-3 pasos máximo
- ✅ Caso de uso claro

### 2. Prueba con Datos Reales
- Usa ejemplos de emails/formularios reales
- Verifica que la IA extrae correctamente
- Ajusta prompts según resultados

### 3. Monitorea Errores
- Configura notificaciones de fallos
- Revisa logs regularmente
- Itera y mejora

### 4. Documenta Todo
- Guarda descripción del workflow
- Anota credenciales usadas
- Explica lógica de negocio

### 5. Escala Gradualmente
```
Semana 1: 1 workflow básico
Semana 2: Añadir pasos
Semana 3: Workflow adicional
Mes 2: 5+ workflows corriendo
```

---

## 🆘 TROUBLESHOOTING

### "OpenAI API error"
- Verificar API key es válida
- Confirmar tienes créditos
- Revisar formato del prompt

### "Workflow no se activa"
- n8n: Verificar que está en modo "Active"
- Make: Verificar schedule o webhook
- Zapier: Confirmar que está "On"

### "Datos no se pasan entre pasos"
- n8n: Verificar conexiones entre nodos
- Make: Revisar mapeo de campos
- Zapier: Usar "Test" para ver datos

### "IA genera respuestas incorrectas"
- Hacer prompt más específico
- Agregar ejemplos en el prompt
- Usar formato de salida estructurado (JSON)

---

## 📈 ROI de Automatizaciones

**Antes**:
- 2 horas/día procesando emails manualmente
- 1 hora/día categorizando tickets
- 3 horas/semana creando contenido social

**Después** (con workflows AI):
- ⚡ Emails procesados en segundos
- ⚡ Tickets categorizados automáticamente
- ⚡ Contenido generado 24/7

**Tiempo ahorrado**: ~20 horas/semana = $2,000-4,000/mes en valor

**Costo**: ~$30/mes

**ROI**: 6,600% 🚀

---

## 🎓 RECURSOS ADICIONALES

### Documentación Oficial
- **n8n**: https://docs.n8n.io/
- **Make**: https://www.make.com/en/help
- **Zapier**: https://zapier.com/help

### Comunidades
- **n8n Forum**: https://community.n8n.io/
- **Make Community**: https://community.make.com/
- **Zapier Community**: https://community.zapier.com/

### Tutoriales en PromptForge
- Video: "Tu primer workflow AI en 10 minutos"
- Guía: "50 casos de uso de automatización"
- Templates: Biblioteca de workflows listos

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Preparación
- [ ] Cuenta en plataforma elegida (n8n/Make/Zapier)
- [ ] OpenAI API key
- [ ] Credenciales de apps a integrar
- [ ] Datos de prueba listos

### Creación
- [ ] Workflow generado en PromptForge
- [ ] JSON descargado
- [ ] Importado en plataforma
- [ ] Credenciales configuradas

### Testing
- [ ] Probado con datos de ejemplo
- [ ] AI genera resultados correctos
- [ ] Acciones finales funcionan
- [ ] Notificaciones configuradas

### Producción
- [ ] Workflow activado
- [ ] Monitoreo configurado
- [ ] Documentación guardada
- [ ] Equipo entrenado

---

**¿Listo para automatizar todo con IA? 🤖**

**Siguiente paso**: Ve a la sección Automatizaciones en PromptForge y genera tu primer workflow ahora mismo!
