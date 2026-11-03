# DealRoom

Plataforma multi-tenant de deal rooms personalizados para inmobiliarias de alto ticket. Mini-directorio + wizard de pre-calificación + portal personalizado por prospecto + tracking de calor.

## Arquitectura

- **Supabase** = base de datos del producto (clientes, inmuebles, deal_rooms, eventos)
- **Next.js (Vercel)** = mini-directorio público, admin, wizard, deal room, API routes
- **GHL** = CRM del cliente (contactos, pipeline, nurturing) [integración en fase siguiente]

Cada cliente inmobiliaria es un tenant, con su branding y su catálogo. Se accede por ruta: `/{slug-del-cliente}`.

## Rutas

| Ruta | Qué es |
|---|---|
| `/{cliente}` | Mini-directorio público con el catálogo |
| `/{cliente}/inmueble/{id}` | Ficha individual de un inmueble |
| `/{cliente}/wizard` | Step wizard de pre-calificación |
| `/{cliente}/d/{token}` | Deal room personalizado (resultados del match) |
| `/{cliente}/admin` | Admin para gestionar inmuebles (protegido con contraseña) |

Cliente de prueba ya cargado: **demo** (broker Mauricio Guati, Terreno Mixcoac).

## Variables de entorno (en Vercel)

En Vercel → Project → Settings → Environment Variables, agrega estas 3:

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | `https://qjqphfrcyyetuddyizpo.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | La secreta: Supabase → proyecto dealroom → Settings → API → `service_role` |
| `ADMIN_PASSWORD` | La que tú elijas, para entrar al admin |

Importante: la `service_role` es secreta. Solo vive en el server de Next.js, nunca se expone al browser.

## Deploy

Mismo repo `portal-dealroom`, mismo Vercel. Al hacer push de estos archivos a GitHub, Vercel redeploya solo. Solo asegúrate de tener las 3 variables de entorno configuradas.

## Flujo del prospecto

1. Entra a `/{cliente}` → ve el catálogo
2. Click en "Encuentra tu propiedad" → wizard de 7 pasos
3. Al terminar → ve su deal room personalizado AL INSTANTE (`/{cliente}/d/{token}`)
4. Cada acción (abrir, usar calculadora, descargar PDF, agendar, WhatsApp) se registra como evento → sube el score de intención del prospecto

## Tracking de calor

Cada evento suma al `score` del deal room:
- Abrir portal: +10
- Ver inmueble: +5
- Usar calculadora: +20
- Descargar PDF: +15
- Click WhatsApp: +25
- Agendar visita: +40

Esto se guarda en Supabase (tabla `eventos` + `score` del deal_room). La integración para empujar el score a GHL y disparar tareas al broker es el siguiente paso.

## Pendiente (fase siguiente)

- Push del score/señales a GHL (actualizar contacto, disparar tarea al broker, mandar email de respaldo con el link del deal room)
- Crear contacto en GHL al completar el wizard
- Dashboard de calor para el broker
- Agente IA WhatsApp (n8n)
- Subdominios por cliente (inmobiliariaX.dealroom.mx)
