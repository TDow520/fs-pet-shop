const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const bp = require('body-parser')
const { error } = require('console')

app.use(bp.json())

app.use(express.json());



app.get('/pets', function(req, res){
    fs.readFile('pets.json', 'utf8', function(error, data){
        if(error){
            console.error(error)
            return
        } else {
            let pets = JSON.parse(data)
            res.json(pets)
            // res.setHeader("Content-Type", 'application/json')
            // res.statusCode = 200
            // res.end(data)
        }
    })
    if(req.url !== '/pets'){
        next({
            status: 404,
            error: "Not Found"
        })
        // res.status(404).send("Not Found")
        return;
    }
})

app.get('/pets/:petIndex', function(req,res, next){
    let index = Number(req.params.petIndex)
    fs.readFile('pets.json', 'utf8', function(error, data){
        if(error){
            console.error(error)
            return
        }
        let pets = JSON.parse(data)
        if(!pets[index]){
            next({ 
                status: 404,
                error: 'Not Found'
            });
        } else {
            res.json(pets[index])
        }
    })
})

app.get('/boom', (req, res, next) => {
    next({ 
        status: 500,
        error: 'Internal Server Error'
    })
})

app.post('/pets', function(req, res, next){

    let age = Number(req.body.age);
    let name = req.body.name;
    let kind = req.body.kind;
    let newPet = {  
        "age": age,
        "kind": kind,
        "name": name
    }
    // console.log(newPet)
    // Reads the JSON file
    fs.readFile("pets.json", "utf8", function(error, data){
        let pets = JSON.parse(data)
        if(error){
            console.log(error)
        } else  {
            pets.push(newPet)
            console.log(pets)
            // Writes the data from newPet to the 
            fs.writeFile("pets.json", JSON.stringify(pets), function(error){
                if(error){
                    console.log(error)
                } else {
                    res.json(newPet)
                }
            })
        }
    })
    if(!age || !name || !kind || !Number.isFinite(age)){
        next({ 
            status: 404,
            error: 'Not Found'
        });
        // res.status(404).send("Not Found")   
    //     res.setHeader("Content-Type", 'text-plain')
    //     res.statusCode = 400
    //     res.end("Bad Request")
    //     return
    // }else {            
    }
    // res.end('Data received');
});


app.patch('/pets/:petIndex', function(req, res, next){
    let index = Number(req.params.petIndex)
    let age = Number(req.body.age);
    let name = req.body.name;
    let kind = req.body.kind;
    fs.readFile('pets.json', 'utf-8', function(error, data){
        if(error){
            console.error(error);
        }
        let pets = JSON.parse(data)
        let pet = pets[index]
        if(!pet){
            next({ 
                status: 404,
                error: 'Not Found'
            });
        } else {
            if(name){
                pet.name = name; 
            }
            if(age){
                pet.age = age;
            }
            if(kind){
                pet.kind = kind;
            }
            // res.json(pets[index])
            fs.writeFile("pets.json", JSON.stringify(pets), function(error){
                if(error){
                    console.log(error)
                } else {
                    res.json(pet)
                }
            })   
        }

    })
})

app.delete('/pets/:petIndex', function(req, res, next){
    let index = Number(req.params.petIndex)

    fs.readFile('pets.json', 'utf-8', function(error, data){
        if(error){
            console.error(error);
        }
        let pets = JSON.parse(data)
        if(!pets[index]){
            next({ 
                status: 404,
                error: 'Not Found'
            });
        } else {
            // res.json(pets[index])
            let pet = pets.splice(index)
            fs.writeFile("pets.json", JSON.stringify(pets), function(error){
                if(error){
                    console.log(error)
                } else {
                    console.log(pets)
                    res.json(pet)
                }
            })   
        }

    })
})

app.use((req, res, next) => {
    next({ 
        status: 404,
        error: 'Not Found'
    })
})

    
app.use((err, req, res, next) => {
    res.status(err.status).send(err.error)
})



app.listen(port, ()=>{
    console.log(`The server is runing on port: ${port}`)
})
