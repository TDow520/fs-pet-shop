let fs = require("fs")
let subcommand = process.argv[2]
let index
let age
let kind
let name


switch(subcommand){
    case 'read':{
        index = process.argv[3]
        fs.readFile("pets.json", "utf8", function(error, data){
            let pets = JSON.parse(data)
            if(error){
                console.log(error)
            } else if(index > pets.length || index < pets.length) {
                console.log(`Usage: node pets.js read INDEX`)
            }else if(index == undefined){
                console.log(pets)
            } else {
                console.log(pets[index])
            }
        });
    break;
    }
    case 'create':
        age = process.argv[3];
        kind = process.argv[4];
        name = process.argv[5];
        let newPet = {  
                        "age": Number(age),
                        "kind": kind,
                        "name": name
                    }
        if(name == undefined){
            console.log("Usage: node pets.js create AGE KIND NAME")
            return
        }

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
    break;


    case 'update':
        index = process.argv[3];
        age = process.argv[4];
        kind = process.argv[5];
        name = process.argv[6];
        if(name == undefined){
            console.log("Usage: node pets.js update INDEX AGE KIND NAME")
            return
        }

        fs.readFile("pets.json", "utf8", function(error, data){
            if(error){
                console.log(error)
            } else {
                let pets = JSON.parse(data)
                pets[index] =
                {
                    'age': Number(age),
                    'kind':kind,
                    'name':name
                }
                fs.writeFile('pets.json', JSON.stringify(pets), function(error){
                    if(error){
                        console.log(error)
                    } else {
                        console.log('Updated')
                    }
                })
                console.log(pets)
            }
        });
    break;

    case 'destroy':
        index = process.argv[3];
        if(index == undefined){
            console.log("Usage: node pets.js destroy INDEX")
            return
        }
        fs.readFile("pets.json", "utf8", function(error, data){
            if(error){
                console.log(error)
            } else {
                let pets = JSON.parse(data)
                pets.splice(index, 1)
                
                fs.writeFile('pets.json', JSON.stringify(pets), function(error){
                    if(error){
                        console.log(error)
                    } else {
                        console.log(`Deleted index:${index}`)
                    }
                })
                console.log(pets)
            }
        });
    break;

        
    default:
        console.log(`Usage: node pets.js [read | create | update | destroy]`)
        // process.exit(1)

}