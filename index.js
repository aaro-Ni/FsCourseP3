const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', (req, res) => {
    const data = req.body
    if (!data.name){
        return ''
    }
    return `{"name":${data.name},"number":${data.number}}`
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors()) 
app.use(express.static('build'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

//3.1
app.get('/persons', (req, res) => {
    res.json(persons)
  })

  //3.2
app.get('/info', (req, res) => {
    const amount = persons.length
    const date = new Date()
    res.send(`<div><div>The phonebook has info for ${amount}</div><div>${date}</div></div>`)
})

//3.3
app.get('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/persons', (req, res) => {
    const person = req.body
    if (!person.name){
        return res.status(400).json({ 
            error: 'name missing' 
          })
    }
    else if(!person.number){
        return res.status(400).json({
            error: "number missing"
        })
    }
    else if (persons.find(p => person.name === p.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    else{
    const id = Math.floor(Math.random()*10000)
    person.id = id
    persons = persons.concat(person)
    
    res.json(person)
    }  
    
    
})

const PORT = 8080 //process.env.PORT //|| 3001  - process.env.PORT ei jostain syystä toiminut. Palauttaa undefined.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})