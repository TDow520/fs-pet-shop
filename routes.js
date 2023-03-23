const fs = require('fs')
const petRegExp = /^\/pets\/(.*)$/;



routes = {
    '/pets': function(req, res) {
        fs.readFile('pets.json', 'utf8', function(error, data){
            if(error){
                console.error(error)
                return
            } else {
                res.setHeader("Content-Type", 'application/json')
                res.statusCode = 200
                res.end(data)
            }
        })
    },
    '/pets/0': function(req, res){
        fs.readFile('pets.json', 'utf8', function(error, data){
            if(error){
                console.error(error)
                return
            }
            let pets = JSON.parse(data)
            let pet = JSON.stringify(pets[0])
            res.setHeader("Content-Type", 'application/json')
            res.statusCode = 200
            res.end(pet)
        })
    },
    '/pets/1': function(req, res){
        fs.readFile('pets.json', 'utf8', function(error, data){
            if(error){
                console.error(error)
                return
            } 
            let pets = JSON.parse(data)
            let pet = JSON.stringify(pets[1])
            res.setHeader("Content-Type", 'application/json')
            res.statusCode = 200
            res.end(pet)
        })
    },
    '/pets/2': function(req, res){
        res.setHeader("Content-Type", 'text/plain')
        res.statusCode = 404
        res.end("Not Found")
    },
    '/pets/-1': function(req, res){
        res.setHeader("Content-Type", 'text/plain')
        res.statusCode = 404
        res.end("Not Found")
    },
    
};

module.exports = routes;