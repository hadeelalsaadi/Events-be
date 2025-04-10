const db= require("../db/connection.js")
const fetchEvents =()=>{
      
    return db.query(`SELECT title, url_img, location, date 
        FROM events;`)
    
       .then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({status:404, msg: "Not found"})
        }
     return rows
    })

}

const fetchEventById =(event_id)=>{

    return db.query(`SELECT *
        FROM events
         WHERE events.event_id = $1;`,[event_id])
    
    .then(({rows})=>{
        
        if(rows.length===0){
            return Promise.reject({status:404, msg: "Not found"})
        }
       
        return rows[0]
    })


}

const addEvent = ({title, description, url_img, genre_id, max_attendees, date, location, organizer_id}) => {
 
    return db
      .query(
        "INSERT INTO events (title, description, url_img, genre_id, max_attendees, date, location, organizer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *;",

        [ title, description, url_img, genre_id, max_attendees, date,  location, organizer_id])
      .then(({ rows }) => {
        return rows[0];
      }).catch((err)=>{
        console.log(err)
      })
  };


const patchAnEvent= (event_id, {title, description, url_img, genre_id, max_attendees, date,timeZone, location, organizer_id})=>{
  return db 
  .query(
    `UPDATE  public.events
    SET title = $1, description =$2,url_img= $3, genre_id= $4, max_attendees= $5, date= $6,timeZone=$7,location=$8, organizer_id=$9 
    WHERE event_id = $10 RETURNING *;`,
      [
        title, description, url_img, genre_id, max_attendees, date,timeZone, location, organizer_id, event_id
      ]
  ).then(({ rows }) => {
    
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "event not found" });
    }
    rows[0].location = JSON.parse(rows[0].location);
    return rows[0];
  });

}



const deleteAnEvent =(event_id)=>{
  return db
  .query('DELETE FROM events WHERE event_id =$1;',[event_id])
  .then((data)=>{
   
    if(data.rowCount===0)
      return Promise.reject({status: 404, msg: "Not found"})
  })
 
}
module.exports= {fetchEvents,fetchEventById, addEvent, patchAnEvent,deleteAnEvent}