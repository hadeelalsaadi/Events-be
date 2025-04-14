const { response } = require("../app.js")
const { postUser, fetchUserByUsername } = require("../models/users.models.js")

const registerUser= (request, response,next)=>{
    const newUser= request.body
    postUser(newUser).then((user)=>{
       return response.status(201).send({ user: user })
    })
    .catch((err)=>{
        next(err)
    })


}
const getUserByUsername =(request, response,next)=>{
    const userName= request.params.username
    console.log(userName)

    
    fetchUserByUsername(userName).then((user)=>{
        return response.status(200).send({user: user})
    }).catch((err)=>{
        next(err)
    })
    
}
module.exports= {registerUser, getUserByUsername}