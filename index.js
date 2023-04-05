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



const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return res.status(400).send({error: 'the id format is incorrect'})
    }else if(error.name === 'ValidationError'){
        return res.status(400).send({error: error.message})
    }
    next(error)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

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

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person=>{
        person ? res.json(person) : res.status(404).end()
    }).catch(err => {
        next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(result=>{
        res.status(204).end()
    }).catch(err => next(err))
})



app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or phone number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    
    person.save().then(savedPerson => {
        res.json(savedPerson)
    }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new:true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
        res.json(updatedPerson)
    }).catch(err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

