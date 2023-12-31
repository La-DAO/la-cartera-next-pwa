# LaCartera

## English

This project is a decentralized application (dApp) that allows any person to start using digital assets as payment method for everyday use.

Developed during ETHOnline 2023 by members LaDAO.

## Still in development

To use it, there are still some manual steps that we need you to complete:
- Fund your Privy wallet with some MATIC, to deploy Safe (gasless deployment is in development)
- Deploy the XocSafe
- Fund XocSafe with XOC (you can mint some [here](https://xocolatl.finance/) or send a mail to gm@ladao.club

After that, you can start sending XOC without paying gas!

## Spanish

Este proyecto es una aplicación descentralizada que permite a cualquier persona empezar a utilizar activos digitales como método de pago para el día a día.

Desarrollado durante ETHOnline 2023 por miembros de La DAO.

**Conecta, Contribuye, Construye**

Bienvenido a La DAO, una comunidad de apasionados de las finanzas descentralizadas y la tecnología.

## ¡Empieza a colaborar!

#### Requisitos

- NodeJS v18.18.0 (LTS) o superior
- Git
- Sugerimos crear una cuenta en Supabase o PlanetScale, y obtener un string de conexión para tu propia Base de Datos. [Cómo obtener en Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres).
- En caso de requerir acceso a las base de datos de La DAO, contáctanos a través de Discord o Telegram.

##### **Flujo de colaboración**

Utilizamos los principios de Gitflow para el control de versiones durante el flujo de trabajo como desarrolladores.

En nuestras contribuciones, debemos considerar el modelo de creación de ramas propuesto en Gitflow, donde siempre mantendremos nuestra rama principal, `main`, así como una rama para aportar nuestras contribuciones: `dev`.

Para conocer más sobre este flujo de trabajo, puedes visitar este excelente [Tutorial de Gitflow](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow) creado por Atlassian.

### Configuración inicial:

Clona este repositorio

```bash
  git clone https://github.com/La-DAO/la-cartera-next-pwa
```

Cambia al directorio del proyecto

```bash
  cd la-cartera-next-pwa
```

Instala las dependencias

```bash
  bun install
```

_Utilizamos bun para este proyecto, puedes obtener más información en la [documentación oficial de Bun](https://bun.sh/docs/installation)_

### Contribuciones: cambia a la rama `dev` y crea tu rama

Ejecuta el siguiente comando en la consola

```bash
  git switch dev
```

La rama dev es donde mantenemos una copia de las últimas contribuciones. Por ello, es nuestro punto de inicio para contribuir.

Si deseas crear un nuevo feature o realizarás alguna otra contribución, siguiendo el modelo de trabajo Gitflow, deberás crear tu propia rama a partir de `dev`

```bash
  git checkout -b feat/<inserta-tu-feature>
```

Seamos descriptivos pero concisos con los nombres de las ramas, algunos ejemplos:

- feat/contacto-pagina
- feat/setup-auth
- feat/api-profile-routes

Para contribuciones, crea _commits_ constantemente para que los demás podamos mantener el contexto de tus contribuciones. Recomendamos seguir estas [mejores prácticas en tus commits](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages).

Una vez que tu aportación esté lista, puedes abrir un Pull Request hacia la rama `dev` y solicita revisión de otro contribuidor.

### Variables de ambiente

Para que la aplicación funcione en su totalidad, debes crear una copia del archivo `.env.example` y nombrarlo `.env`

En este nuevo archivo `.env`, es necesario modificar las siguientes variables de estado:

`DATABASE_URL`

Al copiar `.env.example`, existe un string sin autenticación (es decir, no tiene la contraseña correcta). Esto es por diseño, para evitar abusos de la base de datos de prueba. Sigue el tutorial indicado en Requerimientos.

### Inicia la aplicación

Corre el siguiente script para iniciar el servidor de NextJS

```bash
  bun run dev
```

La aplicación iniciará en `http://localhost:3000`

### Migración Base de Datos

Corre el siguiente script aplicar las migraciones a la base de datos, y así estar sincronizado con el schema (arquitectura de la base de datos: tablas, modelos, relaciones, etc.):

```bash
  npx prisma migrate dev
```

Ahora debes poder iniciar Prisma Studio, el explorador default de Prisma para la base de datos.

```bash
  npx prisma studio
```

Iniciará la aplicación de Prisma Studio en `http://localhost:5050`. Aquí podrás interactuar la base de datos mientras desarrollas.

Cuando realices un cambio en la base de datos, deberás seguir el flujo de Prisma:

1. Modificar el schema en el archivo `/prisma/schema.prisma`
2. Crear una migración
3. Continuar trabajando en el código
4. Repetir en caso de requerir otra modificación

Puedes utilizar [esta guía](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate) para conocer más del flujo de desarrolo de Prisma

## FAQ

#### ¿Cuál es el roadmap?

Este es un proyecto en construcción, y tenemos grandes planes para La DAO. Acércate a nuestros canales de comunicación para más información.

Actualizaremos este README conforme avancemos en el desarrollo.
