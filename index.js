require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('data', (req)=>{
    return JSON.stringify(req.body)
})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :data`))

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
        `<p>${date}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person=>{
        person ? res.json(person) : res.status(404).end()
    }).catch(err => {
        console.log(err)
        res.status(400).send({error: 'the id format is incorrect'})
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()

})

// const personExists = (name) => {
//     let alreadyExists = false

//     persons.forEach(p => {
//         if(p.name === name){
//             alreadyExists = true
//         }
//     })
//     return alreadyExists
// }

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'Name or number not found'
        })
    }

    // if(personExists(body.name)){
    //     return res.status(400).json({
    //         error: "This person's name already exists, each new person must have a unique name"
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

