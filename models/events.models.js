const db= require("../db/connection.js")
const fetchEvents =()=>{
      
    return db.query(`SELECT *  FROM events;`)
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

const addEvent = ({title, description, url_img, genre_id, max_attendees,location,start, end, timeZone, organizer_id}) => {
 
    return db
      .query(
        "INSERT INTO events (title,description,url_img, genre_id ,max_attendees, location,start_time,end_time, timeZone, organizer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *;",

        [ title, description, url_img, genre_id, max_attendees,location,start, end, timeZone, organizer_id])
      .then(({ rows }) => {
        return rows[0];
      }).catch((err)=>{
         next(err)
      })
  };


const patchAnEvent= (event_id, {title, description, url_img, genre_id, max_attendees,location,start,end,timeZone,organizer_id})=>{
  return db 
  .query(
    `UPDATE  public.events
    SET title = $1, description =$2,url_img= $3, genre_id= $4, max_attendees= $5,location=$6, start_time = $7, end_time = $8, timezone = $9, organizer_id=$10
    WHERE event_id = $11 RETURNING *;`,
      [
        title, description, url_img, genre_id, max_attendees,location,start,end,timeZone,organizer_id, event_id
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
    console.log(data)
   
    if(data.rowCount===0)
      return Promise.reject({status: 404, msg: "Not found"})
    return
  })
 
}
module.exports= {fetchEvents,fetchEventById, addEvent, patchAnEvent,deleteAnEvent}