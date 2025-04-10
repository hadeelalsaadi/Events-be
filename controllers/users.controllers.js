const { response } = require("../app.js")
const { postUser } = require("../models/users.models.js")

const registerUser= (request, response,next)=>{
    const newUser= request.body
    postUser(newUser).then((user)=>{
       return response.status(201).send({ user: user })
    })


}
module.exports= {registerUser}