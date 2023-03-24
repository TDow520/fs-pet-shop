const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')


app.get('/', function(req,res){
    res.send('hi')
})

app.get('/pets', function(req, res){
    if(req.url === '/pets'){
        res.status(404).send("Not Found")
        return;
    }
    fs.readFile('pets.json', 'utf8', function(error, data){
        if(error){
            console.error(error)
            return
        } else {
            res.status(200).send(data)
            // res.setHeader("Content-Type", 'application/json')
            // res.statusCode = 200
            // res.end(data)
        }
    })
})

app.get('/pets/:petIndex', function(req,res){
    let index = Number(req.params.petIndex)
    fs.readFile('pets.json', 'utf8', function(error, data){
        if(error){
            console.error(error)
            return
        }
        let pets = JSON.parse(data)
        if(index < 0 || index >= pets.length || !Number.isFinite(index)){
            res.status(404).send("Not Found")
            // res.setHeader('Content-Type', 'text-plain')
            // res.statusCode = 404
            // res.end("not found")
        } else {
            res.status(200).send(pets[index])
        }
    })
})

app.listen(port, ()=>{
    console.log(`The server is runing on port: ${port}`)
})
