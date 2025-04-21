const db= require("../db/connection.js")

const addAttendee = ({event_id, user_id})=>{
    return db.query('INSERT INTO event_attendees(event_id, user_id) VALUES ($1,$2) RETURNING *;', [event_id,user_id])
    .then(({ rows }) => {

        return rows[0];
      })
    

}
module.exports= {addAttendee}