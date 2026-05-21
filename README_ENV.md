# Variables de Entorno

Este archivo documenta las variables consumibles por el backend de `pato-backend` y su función en el código.

## Variables disponibles

### `DATABASE_URL`
- Uso: Conexión de Prisma a la base de datos SQLite.
- Función: Define la URL de la base de datos que usa `PrismaService`.
- Ejemplo: `file:./dev.db`
- Archivo de uso: `src/prisma/prisma.service.ts`

### `JWT_SECRET`
- Uso: Firma y verificación de tokens de acceso JWT.
- Función: Se emplea en `AuthModule`, `JwtStrategy` y `AuthService` para validar y firmar el access token.
- Archivo de uso:
  - `src/auth/auth.module.ts`
  - `src/auth/strateggies/jwt.strateggy.ts`
  - `src/auth/auth.service.ts`

### `JWT_REFRESH_SECRET`
- Uso: Firma y verificación de refresh tokens JWT.
- Función: Se usa en `AuthService` para:
  - validar refresh tokens `validateRefreshToken`
  - generar refresh tokens `generateAuthTokens`
  - cerrar sesión `logout`
- Archivo de uso: `src/auth/auth.service.ts`

### `JWT_EXPIRES_IN`
- Uso: Tiempo de expiración del token de acceso JWT.
- Función: Configura la duración de validez del access token en `JwtModule.register`.
- Ejemplo: `15m`
- Archivo de uso: `src/auth/auth.module.ts`

### `PORT`
- Uso: Puerto en el que se levanta la aplicación NestJS.
- Función: Permite personalizar el puerto del servidor.
- Valor por defecto si no existe: `3000`
- Archivo de uso: `src/main.ts`

## Ejemplo de `.env`

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_secreto_de_acceso"
JWT_REFRESH_SECRET="tu_secreto_de_refresh"
JWT_EXPIRES_IN="15m"
PORT=3000
```

## Nota importante

El archivo `.env` actual contiene la variable `JWT_REFRESH_TOKEN`, pero el código del backend lee `JWT_REFRESH_SECRET`.

- Si quieres usar refresh tokens correctamente, asegúrate de definir `JWT_REFRESH_SECRET` en lugar de `JWT_REFRESH_TOKEN`.

## Resumen rápido

- `DATABASE_URL`: base de datos Prisma
- `JWT_SECRET`: firma/verifica access token
- `JWT_REFRESH_SECRET`: firma/verifica refresh token
- `JWT_EXPIRES_IN`: duración del access token
- `PORT`: puerto del servidor NestJS

## Llamadas para frontend

### Endpoints de autenticación REST
- `POST /auth/login`
  - Body: `{ nombre_usuario, contraseña }`
  - Crea `access_token` y `refresh_token` en cookies.
- `POST /auth/refresh`
  - No requiere body.
  - Lee `refresh_token` de cookies y renueva los tokens.
- `GET /auth/me`
  - Devuelve la sesión activa según el `access_token` en cookie.
- `POST /auth/logout`
  - Cierra sesión y borra las cookies.
- `POST /auth/oAuthLogin`
  - Body: `{ provider, provider_id }`
  - Inicia sesión con cuentas OAuth ya registradas.
- `POST /auth/register`
  - Body: `{ nombre_usuario, contraseña, contraseña_repetida }`
  - Registra un usuario local.
- `POST /auth/registerAuth`
  - Body: `{ username, provider, provider_id }`
  - Registra un usuario usando un proveedor OAuth.

### Endpoint GraphQL
- URL: `/graphql`
- El backend expone consultas y mutaciones desde GraphQL.
- Usa cookies para autenticación de las operaciones protegidas.

### Ejemplo de llamadas desde frontend
```js
const login = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre_usuario: 'usuario', contraseña: 'pass' }),
});

const gql = await fetch('http://localhost:3000/graphql', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `query Posts { posts { id_post title description } }`,
  }),
});
```

### Notas para el frontend
- Siempre envía `credentials: 'include'` para usar las cookies de acceso y refresh.
- La autenticación de GraphQL depende de la cookie `access_token`.
- Para producción debes ajustar `secure: true` en las cookies y configurar HTTPS.
