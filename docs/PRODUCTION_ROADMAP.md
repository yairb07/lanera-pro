# LaneraPro: plan de paso a produccion

Este proyecto ya funciona como prototipo visual. Para usarlo en un trabajo real hay que sacarlo de `localStorage`, agregar backend, base de datos, autenticacion real, permisos, auditoria y validaciones de negocio.

## Estado actual verificado

- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm audit`: hay vulnerabilidades pendientes en `xlsx`, `jspdf`, `jspdf-autotable`, `dompurify` y `brace-expansion`.
- La app sigue usando datos locales del navegador. Eso solo debe quedar como modo demo temporal.
- Ya existe un backend inicial en `server/` con Express, PostgreSQL, CORS, Helmet, cookies httpOnly y rutas de autenticacion.

## Arquitectura recomendada

- Frontend: React + Vite, manteniendo la PWA movil.
- Backend: API Node.js con autenticacion por sesion/JWT.
- Base de datos: PostgreSQL.
- Archivos de diseno e imagenes: almacenamiento privado compatible S3 o Supabase Storage.
- Autenticacion: contrasenas hasheadas con Argon2 o bcrypt, cookies seguras o tokens de corta duracion.
- Auditoria: tabla `audit_logs` para registrar cambios sensibles.

## Modulos que deben migrar a base de datos

- Usuarios y roles: reemplazar `MOCK_USERS`.
- Empleados: dejar de tener arrays fijos en `EmployeesView`.
- Pedidos: guardar pedidos y eventos de historial en tablas.
- Produccion: registrar produccion y descontar stock en una transaccion de base de datos.
- Kardex: unificarlo con el inventario real de conos.
- Finanzas: generar ingresos y egresos desde pedidos, pagos y produccion real.
- Seguridad: guardar camaras y accesos desde backend, no desde estado local.

## Reglas minimas de seguridad

- Nunca guardar contrasenas, roles confiables ni permisos en `localStorage`.
- Validar permisos en backend para cada accion administrativa.
- No permitir stock negativo.
- Registrar auditoria para cambios de pedidos, stock, pagos, usuarios y camaras.
- Usar HTTPS en produccion.
- Configurar CORS solo para el dominio real.
- Usar variables de entorno para URLs, claves y secretos.
- No subir secretos al repositorio.

## Prioridad de migracion

1. Crear backend y conectar PostgreSQL usando el esquema de `database/schema.sql`.
2. Reemplazar login mock por autenticacion real.
3. Crear endpoints protegidos para pedidos, empleados, prendas, conos y produccion.
4. Migrar `useAppData` para leer/escribir por API.
5. Unificar Kardex y Produccion para que descuente el mismo stock.
6. Cambiar Finanzas para calcular desde transacciones reales.
7. Reemplazar `xlsx` por una alternativa mantenida o mover exportacion al backend.
8. Agregar pruebas de reglas criticas: login, roles, stock, pedidos, pagos.

## Pendientes antes de publicar

- Corregir textos con codificacion rota.
- Revisar todos los formularios con validacion fuerte.
- Reemplazar `alert()` por modales/toasts controlados.
- Agregar confirmacion a acciones destructivas.
- Dividir el bundle grande con imports dinamicos.
- Probar en movil real: login, sidebar, tablas, modales, exportaciones y PWA.
