const express = require('express')

// refactorizar
const { getAllArtists, saveArtist, updateArtist, removeArtist } = require('./controllers/artists.controller')

const router = express.Router()

router.get('/api/v1/artists', getAllArtists)
router.post('/api/v1/artists', saveArtist)
router.put('/api/v1/artists/:id', updateArtist)
router.delete('/api/v1/artists/:id', removeArtist)

const app = express()
app.use(express.json())
app.use(router)

module.exports = app