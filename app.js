const express = require("express");

const app = express();
const cors = require('cors');
const endpoints= require("./endpoints.json");
const { getAllEvents, getEventById, postAnEvent, updateAnEvent, removeAnEvent } = require("./controllers/events.controllers");
const { registerUser, getUserByUsername } = require("./controllers/users.controllers");

const { userSignUp } = require("./controllers/event_attendees.contrroller");

app.use(cors());
app.use(express.json());
app.get("/api", (requet, response)=>{
    response.status(200).send({endpoints: endpoints})
})
app.get("/api/events", getAllEvents)
app.get("/api/events/:event_id",getEventById)
app.post("/api/events",postAnEvent)
app.patch("/api/events/:event_id", updateAnEvent)
app.delete("/api/events/:event_id", removeAnEvent)
app.post("/api/users", registerUser )
app.get("/api/users/:username", getUserByUsername)
app.post("/api/event_attendees", userSignUp )

app.all("/api/*",(request,response, next)=>{
  return response.status(404).send({msg: "invalid input"})
  
})


app.use((err,request, response,next)=>{
  if(err.status && err.msg){
      response.status(err.status).send({msg: err.msg})
  }
  next(err)
})


app.use((err,request, response,next)=>{
  
  if(err.code=== "22P02" || err.code === "23503" || err.code === "23502" || err.code==='42601'){
      response.status(400).send({msg: "bad request"})
  }
  next(err)
})


app.use((err,request, response,next)=>{
    console.log(err.stack)
    response.status(500).send({msg: "internal server Error"})
})



module.exports= app