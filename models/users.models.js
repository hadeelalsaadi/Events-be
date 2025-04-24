const db= require("../db/connection.js")

const postUser = ({username,name, email, password, role, avatar,registeredAt})=>{
    return db
    .query('INSERT INTO users (username,name, email, password,user_role, avatar,registeredAt) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *;', [username,name, email, password,role, avatar,registeredAt])
    .then(({ rows }) => {
        return rows[0];
      })
    

}

const fetchUserByUsername = (userName)=>{
  return db 
  .query('SELECT * FROM users WHERE users.username = $1', [userName])
  .then(({rows})=>{
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "user not found" });
    }
    return rows[0]

  })
}
module.exports= {postUser, fetchUserByUsername}