require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('data', (req, res) => {
  const data = req.body
  if (!data.name){
    return ''}
  return `{"name":${data.name},"number":${data.number}}`
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors()) 
app.use(express.static('build'))

//let persons = [
//{
//      id: 1,
//    name: "Arto Hellas",
//  number: "040-123456"
//},
// {
//  id: 2,
//  name: "Ada Lovelace",
//   number: "39-44-5323523"
// },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//    {
//        id: 4,
//        name: "Mary Poppendick",
//        number: "39-23-6423122"
//     }
// ]

//3.1
app.get('/api/persons', (req, res) => {
  //res.json(persons)
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

  //3.2
app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const amount = persons.length
    const date = new Date()
    res.send(`<div><div>The phonebook has info for ${amount}</div><div>${date}</div></div>`)
  })
})

//3.3
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person =>{
      if (person){
        res.json(person)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  //ei tarkastusta nimen yksikäsitteisyydelle
  const person = new Person ({
    name: body.name,
    number: body.number
})
  person.save().then((savedPerson) => res.json(savedPerson)).catch(error => next(error))   
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
}

  Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      if (updatedPerson){
        res.json(updatedPerson)
      }
      else{       
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === "ValidationError"){
    return res.status(400).json({error: error.message})
  }
  
  next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT || 8080 //process.env.PORT //|| 3001 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})