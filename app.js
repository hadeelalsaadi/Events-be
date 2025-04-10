const express = require("express");
const app = express();
const cors = require('cors');
const endpoints= require("./endpoints.json");
const { getAllEvents, getEventById, postAnEvent, updateAnEvent, removeAnEvent } = require("./controllers/events.controllers");
const { registerUser } = require("./controllers/users.controllers");

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









app.use((err,request, response,next)=>{
    console.log(err.stack)
    response.status(500).send({msg: "internal server Error"})
})



module.exports= app