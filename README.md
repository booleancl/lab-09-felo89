# Javascript-lab08

## Módulo 3: Prueba Unitarias
  Conocer y manejar los conceptos básicos de pruebas unitarias de software

### Unidad 4: Trabajar con el Framework de pruebas y las utilidades

Trabajar con el Framework de pruebas y las utilidades | Comprende las diferencias de los distintos entornos de Javascript y utiliza NodeJS y librerías para realizar pruebas de software | Ecosistema NodeJS para pruebas. Fixtures para sequelize en Backend. | 3 | 3												

👀 Instrucciones 👀 

Pre-requisitos

- Postman
- DB Browser for SQLite

Conozcamos el proyecto que vamos a probar

Vamos a instalar dependencias del proyecto, montar base de datos y poblar base de datos con información de prueba (fixtures )
  `npm install`
  `npm run sequelize db:migrate`
  `npm run sequelize db:seed:all`

Debemos poner mucha atención en los 2 últimos comandos. Con ellos definiremos un estado inicial del sistema.
Cuando implementamos metodologías ágiles es vital contar con información que permita poder mantener estados replicables del sistema para que los desarrolladores puedan realizar intervenciones con seguridad.

Podremos hacer uso de esta información para realizar pruebas de software y simplificar el proceso de generar distintos estados para simular escenarios, como lo hicimos anteriormente con las pruebas unitarias.

Antes de entrar en las pruebas, primero discutiremos como inicializar un estado del sistema.
### Fixtures

Según Wikipedia:
"Un fixture es un dispositivo de sujeción, posicionamiento, localización y/o soporte, ya sea al inicio, durante y/o al final de una operación de ensamble, maquinado, soldadura, inspección o algún otro proceso industrial"

y en Informática

"Es un estado del sistema que permite que lo configuremos con un comportamiento repetible en el tiempo. De esta manera podemos realizar cambios que nos permitan validar si estos afectarán a las funcionalidades ya existentes y evitar que salgan a producción errores inesperados"

### Interactuar con el sistema existente

Vamos a correr el comando `npm start` e interactuar con los endpoints a través de Postman

Debemos analizar las respuestas y comprender el concepto de Fixtures realizando pruebas manuales entendiendo que significa preparar el sistema

  - GET `/api/v1/artists`
  - POST `/api/v1/artists`
  - PUT `/api/v1/artists/:id`
  - DELETE `/api/v1/artists/:id`

Al probar este último Endopoint vemos que tiene un comportamiento inesperado.
Solucionar el problema en el endpoint para eliminar artista

Podemos debatir sobre los niveles de prueba y entender porque las pruebas de integración son tan importantes.

### Pruebas de Integración

Las pruebas de Integración se abstraen más del código y se centran más en los requerimientos de negocio sin considerar secciones específicas del código. Por lo tanto no tendremos que generar esas dificiles construcciones de mocks para que nos permita corroborar si los endpoints cumplen con los requerimientos del negocio.
Si bien ganamos en simplicidad de código, debemos sortear algunos obstáculos aplicando los conceptos ya conocidos sobre pruebas de software, como el principio FIRST, AAA y funciones como `beforeEach`, `afterEach`.

En este caso específico los obstáculos son:
  - Interactuar con la BBDD (Base de datos)
  - Levantar el servidor Express
  - Realizar peticiones a las rutas definidas

Vamos a sortear todas estas problemáticas utilizando el poder de varias librerías

## Integrar el Framework de pruebas y utilidades

1. Instalar jest, jest-cli y supertest

  `npm i jest jest-cli supertest --save-dev`

2. Agregar el script "jest" en la sección scripts

  ```json
    "scripts": {
      ...
      "jest": "jest --runInBand"
      ...
    },
  ```
3. Correr el siguiente comando y analizaremos cada una de las preguntas que nos irá haciendo

  `npm run jest -- --init`

4. Modificar el archivo `src/config/config.json`

```javascript
  ...
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "test.database.sqlite3",
    "dialect": "sqlite",
    "logging": false
  },
  ...
```

antes de seguir avanzando agreguemos a `.gitignore` el archivo `test.database.sqlite3`

5. Crear una carpeta en la raíz del repositorio llamada `tests` y en su interior crearemos un archivo llamado `artists.test.js` con el siguiente contenido:

```javascript
const server = require('../src/server')

describe('Artists Endpoint',() => {
  it('works', () => {
    expect(true).toEqual(true)
  })
})
```

6. Ahora ejecutaremos el comando `npm run test`

Al ejecutar esto veremos un error. Esto nos dará pie a discutir un tema muy importante respecto del código que escribimos.

### Las fronteras de las pruebas de integración

Cuando queremos ejecutar pruebas de integración debemos preguntarnos cuáles son las dependencias que tiene el sistema bajo las pruebas.
En este caso es una aplicación Backend que tiene como objetivo responder a ciertos endpoints. Para poner en producción la aplicación ejecutaremos la función derivada de la librería Express `app.listen()`. 
¿Debemos ejecutar esto en nuestras pruebas?
¿Existirá alguna forma de realizar peticiones a la aplicación sin dejarla corriendo de forma constante?

Las pruebas de integración tiene como objetivo ejecutar el código fuente haciendo interactuar las unidades básicas del sistema. Es nuestro deber como programadores conocer cuales son los componentes que lo conforman y entender el proceso relacionado a su ejecución en producción en función de los requerimientos de negocio.

En nuestro caso es necesario dividir las responsabilidades del código contenido en el archivo `server.js` de manera de seperar las configuración de la Aplicación y su ejecución.

Crearemos un archivo dentro de la carpeta `src` llamado `app.js` con el siguiente contenido desde el archivo `server.js`


```javascript
const express = require('express')

// refactorizar
const artistsController = require('./controllers/artists.controller')

const router = express.Router()

router.get('/api/v1/artists', artistsController.getAllArtists)
router.post('/api/v1/artists', artistsController.saveArtist)
router.put('/api/v1/artists/:id', artistsController.updateArtist)
router.delete('/api/v1/artists/:id', artistsController.removeArtist)

const app = express()
app.use(express.json())
app.use(router)

module.exports = app
```

y el archivo `server.js` debe quedar así:

```javascript
const app = require('./app')
const port = 3000

app.listen(port, () => {
  console.log(`App server listening on port ${port}`)
})

```

y finalmente vamos a cambiar nuestra prueba para solo requerir `app`.

```javascript
const app = require('../src/app')

describe('Artists Endpoint',() => {
  it('works', () => {
    expect(true).toEqual(true)
  })
})
```

### Crear una prueba que interactue con la Base de datos

Para poder interactuar con la base de datos utilizaremos Sequelize. El método más importante será el siguiente:

```javascript
const Models = require('../src/models')

await Models.sequelize.sync({ force: true })
```
Esto es equivalente al comando `npm run sequelize db:migrate`. Por lo tanto con él prodremos crear la base de datos con las tablas actualizadas a la última versión.

En las pruebas de Integración vamos a trabajar con la siguiente API
https://sequelize.org/master/class/lib/model.js~Model.html

Ahora analicemos el siguiente código y luego lo agregaremos a nuestro archivo `artists.test.js`

```javascript
const supertest = require('supertest')

const app = require('../src/app')
const Models = require('../src/models')

// Crea tu propios fixtures con tus artistas favoritos
const artistsFixtures = [
  {
    id: 1,
    name: 'Luis Alberto Spinetta',
    description: 'Guitarrista, Cantante y Compositor Argentino considerado como uno de los más innovadores debido a su uso de elementos del Jazz en música popular',
    code: 'L_A_SPINETTA_GUITAR',
    image: 'https://res.cloudinary.com/boolean-spa/image/upload/v1627536010/boolean-fullstack-js/L_A_SPINETTA_GUITAR_jpg_dwboej.png'
  },
  {
    id: 2,
    name: 'Chet Baker',
    description: 'Fue un trompetista, cantante y músico de jazz estadounidense. Exponente del estilo cool. Baker fue apodado popularmente como el James Dean del jazz dado a su aspecto bien parecido',
    code: 'CHET_BAKER_TRUMPET',
    image: 'https://res.cloudinary.com/boolean-spa/image/upload/v1627536010/boolean-fullstack-js/CHET_BAKER_TRUMPET_ssbyt5.jpg'
  },
  {
    id: 3,
    name: 'Tom Misch',
    description: 'Thomas Abraham Misch es un músico y productor inglés. Comenzó a lanzar música en SoundCloud en 2012 y lanzó su álbum de estudio debut Geography en 2018',
    code: 'TOM_MISCH_GUITAR',
    image: 'https://res.cloudinary.com/boolean-spa/image/upload/v1627536009/boolean-fullstack-js/TOM_MISCH_GUITAR_r456nt.jpg'
  }
]

describe('/api/artists', () => {

  // Configurar que pasara al inicio de la batería de pruebas y al finalizar

  beforeEach(async () => {
    // Creamos la base de datos vacía con las tablas necesarias
    await Models.sequelize.sync({ force: true })
  })

  afterAll(async () => {
    // En toda base de datos es importante cerrar la conexión
    await Models.sequelize.close()
  })

  it('returns an list of artists', async () => {
    await Models.Artist.bulkCreate(artistsFixtures)
    
    const response = await supertest(app)
      .get('/api/v1/artists')
      .expect(200)
    expect(response.body).toMatchObject(artistsFixtures)
  })

  it('returns 500 when the database throws error', async () => {
    // Podemos ser ingeniosos y generar un escenario que haga fallar a la base de datos
    await Models.Artist.drop()

    const response = await supertest(app)
      .get('/api/v1/artists')
      .expect(500)
    expect(response.body).toMatchObject({ message: 'SQLITE_ERROR: no such table: Artists' })
  })
})
```


Seguiremos escribiendo las demás pruebas. Para la prueba del endpoint POST podemos utilizar el siguienete ejemplo:

```javascript
const newArtist = {
  name: "Herbie Hancock",
  description: "Es un pianista, tecladista y compositor estadounidense de jazz. A excepción del free jazz, ha tocado prácticamente todos los estilos jazzísticos surgidos tras el bebop: hard bop, fusión, jazz modal, jazz funk, jazz electrónico, etc.",
  code: "HERBIE_HANCOCK_KEYBOARD",
  image: "https://res.cloudinary.com/boolean-spa/image/upload/v1627537633/boolean-fullstack-js/HERBIE_HANCOCK_KEYBOARD_n6b2fv.jpg"
}
```

¡ÉXITO!
