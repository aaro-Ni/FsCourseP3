const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
else if (process.argv.length === 4){
    process.exit(1)
}
else {
const password = process.argv[2]

const url = `mongodb+srv://AaroNiFullstack:${password}@cluster0.rj4hpfi.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })


const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    console.log("Phonebook:")
    Person
  .find({})
  .then(persons => {
    persons.forEach(person => {console.log(`${person.name} ${person.number}`)})
    mongoose.connection.close()
})
}
else{
const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  
  person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}}
