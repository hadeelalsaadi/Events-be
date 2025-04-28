const format = require("pg-format");
const db = require("../connection.js");

const seed = ({ eventsData, genresData,eventattendeesData, usersData }) => {
  return db
  .query(`DROP TABLE IF EXISTS event_attendees CASCADE;`)
  .then(() => db.query(`DROP TABLE IF EXISTS events CASCADE;`))
  .then(() => db.query(`DROP TABLE IF EXISTS users CASCADE;`))
  .then(() => db.query(`DROP TABLE IF EXISTS genres CASCADE;`))
    
  .then(()=>{
        const genresTablePromise = db.query(`
            CREATE TABLE genres(
              genre_id SERIAL PRIMARY KEY,
              name VARCHAR 
            );`);
      
            const usersTablePromise = db.query(`
            CREATE TABLE users(
                user_id SERIAL PRIMARY KEY,
                username VARCHAR,
                name VARCHAR, 
                email VARCHAR (50) ,
                password VARCHAR,
                user_role VARCHAR,
                avatar VARCHAR,
                
                registeredAt TIMESTAMP DEFAULT NOW()
            );`);
      
            return Promise.all([genresTablePromise, usersTablePromise]);
          })
          .then(() => {
            return db.query(`
                CREATE TABLE events (
                    event_id SERIAL PRIMARY KEY,
                    title VARCHAR NOT NULL,
                    description VARCHAR , 
                    url_img VARCHAR,
                    genre_id INT NOT NULL REFERENCES genres(genre_id),
                    max_attendees INT, 
                    location VARCHAR ,
                    start_time TIMESTAMP WITHOUT TIME ZONE,
                    end_time TIMESTAMP WITHOUT TIME ZONE,
                    timezone VARCHAR,
                    organizer_id INT  REFERENCES users(user_id)
                );`);
          })
          .then(() => {
            return db.query(`CREATE TABLE event_attendees (
              attendee_id SERIAL PRIMARY KEY,
              event_id INT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
              user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
            );`);
          })
          .then(() => {
            const insertGenre = format(
               "INSERT INTO genres (genre_id,name) VALUES %L;",
               genresData.map(({ genre_id, name}) => [
                 genre_id,
                 name
               ])
            );
            const insertUsers = format(
                "INSERT INTO users (user_id,username,name, email,password,user_role, avatar,registeredAt) VALUES %L;",
                usersData.map(({ user_id,username, name, email, password, user_role,avatar, registeredAt }) => [
                  user_id,
                  username, 
                  name,
                  email,
                  password,
                  user_role,
                  avatar,
                  registeredAt
                ])
              );

                 const insertgenreQuery = db.query(insertGenre);
                 const insertUsersQuery = db.query(insertUsers);
                 return Promise.all([insertgenreQuery, insertUsersQuery]);
            }) .then(() => {
              return db.query(`
                SELECT setval(
                  pg_get_serial_sequence('users', 'user_id'),
                  (SELECT MAX(user_id) FROM users)
                );
              `);
            })
            .then(() => {
                const insertEvent = format(
                  "INSERT INTO events (event_id,title,description,url_img, genre_id ,max_attendees, location,start_time,end_time, timeZone, organizer_id) VALUES %L;",
                  eventsData.map(
                    ({ event_id, title, description,url_img, genre_id,max_attendees, location, start, end, timeZone, organizer_id
                    }) => [
                        event_id,
                        title,
                        description,
                        url_img,
                        genre_id,
                        max_attendees,
                        location,
                        start, 
                        end, 
                        timeZone,
                        organizer_id
                    ]
                  )
                );
                return db.query(insertEvent);
              })
              .then(() => {
                return db.query(`
                  SELECT setval(
                    pg_get_serial_sequence('events', 'event_id'),
                    (SELECT MAX(event_id) FROM events)
                  );
                `);
              })
              .then(() => {
                const insertevent_attendees = format(
                  "INSERT INTO event_attendees (  attendee_id, event_id, user_id) VALUES %L;",
                  eventattendeesData.map(({attendee_id, event_id, user_id}) => [
                    attendee_id, event_id, user_id ])
                );
                return db.query(insertevent_attendees);
              }).then(() => {
                return db.query(`
                  SELECT setval(
                    pg_get_serial_sequence('event_attendees', 'attendee_id'),
                    (SELECT MAX(attendee_id) FROM event_attendees)
                  );
                `);
              });
};
          
          module.exports = seed;
          





