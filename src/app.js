const express = require('express')

// refactorizar con destructuring
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
