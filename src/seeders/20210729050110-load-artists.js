
const tableName = 'Artists'
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

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(tableName, null, { truncate: true })
    await queryInterface.bulkInsert(tableName, artistsFixtures, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(tableName, null, { truncate: true })
  }
}
