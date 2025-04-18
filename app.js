const express = require("express");
const { google } = require('googleapis');
const app = express();
const cors = require('cors');
const endpoints= require("./endpoints.json");
const { getAllEvents, getEventById, postAnEvent, updateAnEvent, removeAnEvent } = require("./controllers/events.controllers");
const { registerUser, getUserByUsername } = require("./controllers/users.controllers");
const { fetchEventById } = require("./models/events.models");


//*****************************************************Google Calender integration *******************************************


// Define the scope of access for the Google Calendar API. which is the level of permission an app or service has to interact with a user's Google Calendar data
const scopes = ['https://www.googleapis.com/auth/calendar'];

// Now we integrate OAuth2 Authentication into our Project. This enables our application to interact securely with Google services.
//Configure the OAuth 2 client using the credentials that we have stored in the .env file.
const oauth2Client = new google.auth.OAuth2
(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)
 //Now we have created Route to Authenticate the Users, 
 //they'll be redirected to Google's authentication page where it will ask for specific permissions to our application.
 app.get('/auth', (req, res) => {
    const url = oauth2Client.generateAuthUrl
    ({
        access_type: 'offline',// this line means access user's data even when he is not using the app. otherwise token get expired. 
        scope: scopes
    });
    res.redirect(url);
    }
);
//our Redirect URL, getting the refresh tokens from the Query and storing them as credentials in the oauth2Client
app.get("/auth/redirect", (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("Missing authorization code");
    }
    handleAuthRedirect(code)
    .then(message=>res.send(message))
    .catch(error=>res.status(500).send(error.message))
    }

);
const handleAuthRedirect =(code)=>{
    return oauth2Client.getToken(code).then(response=>{
        oauth2Client.setCredentials(response.tokens)
        return 'Authentication successful! Please return to the console.'
    }).catch(err=>{
        console.error('Failed to get tokens:', err);
      throw new Error('Authentication failed.');
    })

}
// initializing the google calender API client 
const calender= google.calendar({
    version: 'v3',
    auth: oauth2Client
})
//create a Route for the event to to be stored in Google's service
app.get('/create-event/:event_id',async(req, res)=>{
    const { event_id } = req.params;
    try {
      const event = await fetchEventById(event_id);
      console.log('Fetched event from DB:', event);
  
      const googleEvent = {
        summary: event.title,
        location: event.location,
        description: event.description,
        start: {
          dateTime: event.start_time,
          timeZone: event.timezone
        },
        end: {
          dateTime: event.end_time,
          timeZone: event.timezone
        }
      };
  
      // Now insert the event in user's calender 
      calender.events.insert({
        calendarId: 'primary',
        resource: googleEvent
      },(err, response) => {
        if (err) {
          console.error('Calendar error:', err);
          return res.status(500).send('Failed to create event');
        }
        res.send(`✅ Event created: <a href="${response.data.htmlLink}" target="_blank">View it on Google Calendar</a>`);
      });
  
    } catch (err) {
      console.error('Error occurred:', err);
      const status = err.status || 500;
      const message = err.msg || 'Something went wrong';
      res.status(status).send(message);
    }
  });



//****************************************************************************************************************************** */

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


app.use((err,request, response,next)=>{
    console.log(err.stack)
    response.status(500).send({msg: "internal server Error"})
})



module.exports= app