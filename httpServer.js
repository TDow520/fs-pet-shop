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


// //ChatGPT Refactored version
// const fs = require('fs');
// const http = require('http');

// const port = 8000;
// const petRegExp = /^\/pets\/(.*)$/;

// function handleGetPets(req, res) {
//   fs.readFile('pets.json', 'utf8', (error, data) => {
//     if (error) {
//       console.error(error);
//       res.statusCode = 500;
//       res.end();
//       return;
//     }
    
//     let pets = JSON.parse(data);
//     let responseJson;
    
//     if (req.url === '/pets') {
//       responseJson = pets;
//     } else {
//       let index = Number(req.url.match(petRegExp)[1]);
//       if (index < 0 || index >= pets.length || !Number.isFinite(index)) {
//         res.statusCode = 404;
//         res.end('Not found');
//         return;
//       }
//       responseJson = pets[index];
//     }
    
//     res.setHeader('Content-Type', 'application/json');
//     res.statusCode = 200;
//     res.end(JSON.stringify(responseJson));
//   });
// }

// function handlePostPet(req, res) {
//   let body = '';

//   req.on('data', chunk => {
//     body += chunk.toString();
//   });

//   req.on('end', () => {
//     const data = JSON.parse(body);
//     let age = Number(data['age']);
//     let name = data['name'];
//     let kind = data['kind'];
    
//     if (!age || !name || !kind || !Number.isFinite(age)) {
//       res.statusCode = 400;
//       res.end('Bad request');
//       return;
//     }
    
//     fs.readFile('pets.json', 'utf8', (error, data) => {
//       if (error) {
//         console.error(error);
//         res.statusCode = 500;
//         res.end();
//         return;
//       }
    
//       let pets = JSON.parse(data);
//       let newPet = {
//         age: age,
//         name: name,
//         kind: kind
//       };
//       pets.push(newPet);
    
//       fs.writeFile('pets.json', JSON.stringify(pets), error => {
//         if (error) {
//           console.error(error);
//           res.statusCode = 500;
//           res.end();
//           return;
//         }
        
//         res.statusCode = 200;
//         res.end('Pet added');
//       });
//     });
//   });
// }

// function handleRequest(req, res) {
//   if (req.method === 'GET') {
//     handleGetPets(req, res);
//   } else if (req.method === 'POST' && req.url === '/pets') {
//     handlePostPet(req, res);
//   } else {
//     res.statusCode = 404;
//     res.end('Not found');
//   }
// }

// const server = http.createServer(handleRequest);

// server.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });
