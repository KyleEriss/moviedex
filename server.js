require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

console.log(process.env.API_TOKEN)

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/movie', function handleGetGenre(req, res) {
  let response = MOVIEDEX;
  let paramAvgVote = req.query.avg_vote;
  let avgVoteNumber = parseInt(paramAvgVote);

  // filter movie by genre if name query param is present
  if (req.query.genre) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }

  // filter movie by country if country query param is present
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }

  // filter movie by avg_vote if avg_vote query param is present
  if (req.query.avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    )
  }

  res.json(response)
})



const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})