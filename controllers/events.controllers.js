
const { response } = require("../app.js")
const {fetchEvents, fetchEventById, addEvent, patchAnEvent, deleteAnEvent}= require("../models/events.models.js")

const getAllEvents = (request,respons,next)=>{
    return fetchEvents()
    .then((events)=>{
     respons.status(200).send({events})
   
    }).catch((err)=>{
     next(err)
    })
   
   }


const getEventById = (request,respons,next)=>{
    const {event_id} = request.params
    return fetchEventById(event_id).then((event)=>{
        respons.status(200).send({event})

    }).catch((err)=>{
        next(err)
       })
    

}

const postAnEvent= (request,response,next)=>{
    const newEvent = request.body
    addEvent(newEvent)
    .then((event) => {
      response.status(201).send({ event: event });
    })
    .catch((err) => {
      next(err);
    });
}


const updateAnEvent = (request, response, next)=>{
  const newDetails = request.body
  const { event_id } = request.params;
  patchAnEvent(event_id, newDetails).then((event)=>{

    response.status(200).send({ event: event });
  })
  .catch((err) => {
    next(err);
  });
  
}
const removeAnEvent =(request, response, next)=>{
  const { event_id } = request.params;
  deleteAnEvent(event_id).then((data)=>{
    return response.status(204).send(data)

  })
  .catch((err)=>{
    next(err)
})
}


   module.exports= {getAllEvents,getEventById, postAnEvent, updateAnEvent,removeAnEvent}