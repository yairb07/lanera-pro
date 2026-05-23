# LaneraPro

Sistema de gestion textil para pedidos B2B, produccion, empleados, prendas, inventario Kardex, finanzas y monitoreo.

## Estado del proyecto

La aplicacion actual funciona como prototipo avanzado en React + Vite. Ya compila y pasa lint, pero la persistencia principal sigue siendo local al navegador. Para produccion debe conectarse a backend y base de datos.

## Scripts

```bash
npm run dev
npm run server
npm run lint
npm run build
npm run preview
npm run hash:password -- "una-contrasena-segura"
```

## Configuracion

Copia `.env.example` a `.env.local` y ajusta la URL de la API:

```bash
VITE_API_URL=http://localhost:4000/api
```

## Produccion

La ruta recomendada esta documentada en `docs/PRODUCTION_ROADMAP.md`.

El esquema inicial de base de datos PostgreSQL esta en `database/schema.sql`.

Si usas Vercel + Neon, la integracion suele crear `POSTGRES_URL`. El backend acepta `DATABASE_URL` o `POSTGRES_URL`.

Antes de publicar hay que completar:

- Backend con autenticacion real.
- PostgreSQL como fuente de datos.
- Migracion fuera de `localStorage`.
- Permisos validados en servidor.
- Auditoria de acciones sensibles.
- Correccion de dependencias vulnerables reportadas por `npm audit`.
