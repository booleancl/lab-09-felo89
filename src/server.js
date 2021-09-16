const express = require('express')

// refactorizar
const artistsController = require('./controllers/artists.controller')

const router = express.Router()

router.get('/api/v1/artists', artistsController.getAllArtists)
router.post('/api/v1/artists', artistsController.saveArtist)
router.put('/api/v1/artists/:id', artistsController.updateArtist)
router.delete('/api/v1/artists/:id', artistsController.removeArtist)

const app = express()
const port = 3000

app.use(express.json())
app.use(router)
app.listen(port, () => {
  console.log(`App server listening on port ${port}`)
})
