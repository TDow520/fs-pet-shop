const fs = require('fs');
const http = require('http');
// const routes = require('./routes')
const port = 8000;
const petRegExp = /^\/pets\/(.*)$/;


const handleRequest = function(req, res){
    // if(req.method == "GET" && routes[req.url] !== undefined){
    if(req.method == "GET"){
        
            if(!petRegExp.test(req.url)){
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
            } else{
                fs.readFile('pets.json', 'utf8', function(error, data){
                    if(error){
                        console.error(error)
                        return
                    }
                    let pets = JSON.parse(data)
                    let index = Number(req.url.match(petRegExp)[1])
                    console.log(index)
                    if(
                        index < 0 || 
                        index >= pets.length || 
                        !Number.isFinite(index) || 
                        req.url == '/pets/'
                        ){
                        res.setHeader('Content-Type', 'text-plain')
                        res.statusCode = 404
                        res.end("not found")
                    } else {
                        res.setHeader("Content-Type", 'application/json')
                        res.statusCode = 200
                        res.end(JSON.stringify(pets[index]))
                    }
                })
            // {
            //     let index = req.url.match(petRegExp)
            //     console.log(index[0])
            //     // routes[req.url](req, res);
            // }
        
            }
        
    } else {
        let body = ''
        req.on('data', chunk=>{
            body += chunk.toString()
        })
        let age
        let name
        let kind
        req.on('end', () => {
            const data = JSON.parse(body); 
            age = Number(data['age']);
            kind = data['kind'];
            name = data['name'];
            let newPet = {  
                            "age": age,
                            "kind": kind,
                            "name": name
                        }
            if(!age || !name || !kind || !Number.isFinite(age)){
                res.setHeader("Content-Type", 'text-plain')
                res.statusCode = 400
                res.end("Bad Request")
                return
            }else {            
                fs.readFile("pets.json", "utf8", function(error, data){
                    let pets = JSON.parse(data)
                    if(error){
                        console.log(error)
                    } else  {
                        pets.push(newPet)
                        console.log(pets)
        
                        fs.writeFile("pets.json", JSON.stringify(pets), function(error){
                            if(error){
                                console.log(error)
                            } else {
                                console.log("write complete")
                            }
                        })
                    }
                });
            }
    
            res.end('Data received');
        });
    }
}

const server = http.createServer(handleRequest)


server.listen(port, function(){
    console.log("Listening on port", port)
})