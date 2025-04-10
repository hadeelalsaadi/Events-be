const db= require("../db/connection.js")

const postUser = ({username, email, password, avatar,registeredAt})=>{
    return db
    .query('INSERT INTO users (username, email, password, avatar,registeredAt) VALUES ($1,$2,$3,$4,$5) returning *;', [username, email, password, avatar,registeredAt])
    .then(({ rows }) => {
        return rows[0];
      })
    

}
module.exports= {postUser}