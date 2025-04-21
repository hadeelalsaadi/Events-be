const { response } = require("../app.js")
const { addAttendee } = require("../models/event_attendees.models.js")


const userSignUp =(request, response,next)=>{
    const details = request.body
    
    addAttendee(details).then((attendee)=>{
        return response.status(201).send({attendee:attendee})
    })
    .catch((err)=>{
        console.log(err)
        next(err)
    })


}
module.exports ={userSignUp}