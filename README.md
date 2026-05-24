# Pato Backend

API backend para la aplicacion Pato. Esta construido con NestJS, GraphQL, Apollo, Prisma y SQLite.

## Descripcion

Este backend ofrece:
- Autenticacion JWT con access token y refresh token en cookies.
- Registro y login de usuarios normales y OAuth.
- Gestion de publicaciones, comentarios, reacciones y archivos.
- Mensajeria privada entre usuarios.
- Seguimiento de usuarios (follow/unfollow).
- Mascota vinculada a cada usuario.
- Insignias administrables con permisos de administrador.
- GraphQL con suscripciones en tiempo real.

## Estructura principal

Modulos principales:
- `AuthModule`: login, refresh, logout, registro y OAuth.
- `UsersModule`: perfiles, lista de amigos y follow/unfollow.
- `PostsModule`: feed, busqueda, creacion, edicion, eliminacion y reacciones.
- `CommentsModule`: comentarios anidados, reacciones y actualizacion.
- `MessagesModule`: mensajes directos con suscripciones.
- `BadgesModule`: creacion / edicion / eliminacion de insignias (admin).
- `PetModule`: estado de mascota del usuario.
- `FilesModule`: subida de archivos con almacenamiento en disco.
- `PrismaModule`: acceso a la base de datos SQLite.

## Requisitos

- Node.js
- npm
- SQLite (no requiere servidor externo)

## Variables de entorno

El proyecto usa `@nestjs/config` y requiere al menos:

- `JWT_SECRET`: clave secreta para tokens JWT.
- `JWT_REFRESH_SECRET`: clave para refresh tokens JWT.
- `PORT` (opcional, por defecto `3000`).

## Instalacion

```bash
npm install
npx prisma generate
npx prisma db push
```

## Ejecucion

```bash
npm run start
```

Modo desarrollo con recarga automatica:

```bash
npm run start:dev
```

Produccion:

```bash
npm run start:prod
```

## Scripts disponibles

- `npm run build`: compila la aplicacion Nest.
- `npm run format`: formatea el codigo con Prettier.
- `npm run lint`: ejecuta ESLint con correccion automotica.
- `npm run test`: ejecuta pruebas con Jest.
- `npm run test:watch`: ejecuta pruebas en modo watch.
- `npm run test:cov`: genera cobertura de pruebas.

## API REST

### Autenticacion

- `POST /auth/login`
  - Body: `{ nombre_usuario, contraseña }`
  - Guarda cookies `access_token` y `refresh_token`.

- `POST /auth/refresh`
  - Renueva ambos tokens usando `refresh_token`.

- `POST /auth/logout`
  - Elimina cookies de sesion.

- `POST /auth/oAuthLogin`
  - Login con proveedor OAuth.

- `POST /auth/register`
  - Registro de usuario con contraseña.

- `POST /auth/registerAuth`
  - Registro de usuario usando proveedor OAuth.

### Archivos

- `POST /files/upload`
  - Subida de archivos con campo `files`.
  - Guarda archivos en `./uploads`.

## API GraphQL

Endpoint principal: `http://localhost:3000/graphql`

### Consultas

- `searchPosts(filter: SearchPostInput)`: busqueda de publicaciones.
- `posts`: feed de publicaciones.
- `findFriends`: usuarios seguidos.
- `findOneUser(id_user: Int)`: perfil de usuario.
- `getComment`: obtener todos los comentarios.
- `getCommentsByParent(comment_id: Int)`: comentarios hijos.
- `getMessages(input: SearchMessageDto)`: mensajes entre usuarios.
- `getBadges`: lista de insignias.
- `getPet`: mascota del usuario autenticado.

### Mutaciones protegidas

Requieren JWT valido en GraphQL:

- `createPost(input: CreatePostInput)`
- `deletePost(post: DeletePost)`
- `addReaction(input: AddReaction)`
- `updatePost(input: UpdatePostInput)`
- `createComment(input: CreateCommentInput)`
- `deleteComment(comment_id: Int)`
- `addReactions(input: AddReactions)`
- `updateMessage(input: UpdateMessage)`
- `createMessage(input: CreateMessage)`
- `removeMessage(input: DeleteMessage)`
- `toggleFollow(id_user: Int)`

### Mutaciones de administrador

- `createBadge(input: CreateBadgeDto)`
- `updateBadge(input: UpdateBadge)`
- `deleteRole(id: Int)`

### Suscripciones en tiempo real

- `addedReaction`: nueva reaccion a publicacion.
- `toogledFollow`: cambio en follow/unfollow.
- `newMessage`: mensaje creado.
- `deleteMessage`: mensaje eliminado.
- `updatedMessage`: mensaje actualizado.

## Base de datos

Modelo de datos principal en `prisma/schema.prisma`:

- `Usuario`
- `Post`
- `Comentario`
- `Mensaje`
- `Mascota`
- `Insignia`
- `Follow`
- `AuthAcount`
- `PostReactions`
- `ComentarioReactions`
- `Files_Post`, `Files_Comment`, `Files_Mensaje`

## Observaciones importantes

- El endpoint GraphQL se genera automaticamente en `src/schema.gql`.
- Las cookies `access_token` y `refresh_token` se configuran con `httpOnly` y `sameSite: none` para que el frontend de otro origen pueda usarlas.
- En desarrollo el flag `secure` esta en `false`; en produccion debe activarse.
- `OptionalJwtAuthGuard` permite peticiones anonimas al feed para que el contenido publico pueda consultarse sin sesion.

## Notas de uso

- Use `POST /files/upload` con `multipart/form-data` y campo `files`.
- Para GraphQL, primero autentique con `/auth/login` y use las cookies generadas.
- El backend esta diseñado para funcionar con SQLite local y no requiere servidor de bases de datos adicional.
