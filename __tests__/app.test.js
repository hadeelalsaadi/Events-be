const request = require("supertest")
const app = require("../app.js")
const db = require("../db/connection.js")
const seed = require("../db/seed/seed.js")
const data = require("../db/data/testing_db/index.js")
const endpoints= require("../endpoints.json")
 
beforeEach(()=>{ 
      return seed(data);
    });

 afterAll(()=>{ 
     return db.end()
})
describe("/api",()=>{
    test("Get-200-respond with an object gives all availabe endpoints details",()=>{ 
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body})=>{
            expect(body.endpoints).toEqual(endpoints)
    
        })
    })
})
describe("/api/events",()=>{
    test.only("Get-200 response with  events list  ",()=>{
        return request(app)
        .get("/api/events")
        .expect(200)
        .then(({body})=>{
            expect(body.events.length).toBe(13)
            body.events.forEach((event)=>{
               
                expect(typeof event.title).toBe("string")
                expect(typeof event.description).toBe("string")
                expect(typeof event.url_img ).toBe("string")
                expect(typeof event.genre_id).toBe("number")
                expect(typeof event.max_attendees).toBe("number")
                expect(typeof event.location).toBe("string")
                expect(typeof event.timezone).toBe("string")
                expect(typeof event.organizer_id).toBe("number")
                expect( typeof event.start_time).toBe("string")
                
                
            })
          
        })
    })

    })


describe("/api/events/:event_id",()=>{
    test("Get-200 response with  an event's all details ",()=>{
        return request(app)
        .get("/api/events/3")
        .expect(200)
        .then(({body})=>{
                expect(body.event.title).toBe("Exclusive secondary success")
                expect(body.event.description).toBe("Cogito vomer fugit. Abscido deorsum voveo corrupti alo deinde vix congregatio. Thermae bellicus decipio sumo cunctatio aufero volaticus soleo uredo.")
                expect(body.event.url_img ).toBe("https://loremflickr.com/640/480?lock=2404073856072746")
                expect(body.event.genre_id).toBe(1)
                expect(body.event.max_attendees).toBe(261)
                expect(typeof body.event.location).toBe("string")
                expect(typeof body.event.start_time).toBe("string")
                expect(typeof body.event.end_time).toBe("string")
                expect(body.event.timezone).toBe("Atlantic/Reykjavik")
                expect(body.event.organizer_id).toBe(1)
            
            })
          
        })
    
})



describe("POST /api/events", () => {
    test("POST: 201 - adds a new event to the list", () => {
         const newEvent = { 
            title: "Neon Dreams Symposium",
            description: "Verto stella cursus. Absconditus vacuus articulus temeritas callide varietas tricesimus tardus. Arbitro versus defleo corrumpo celebrer coerceo argentum triumphus.",
            url_img: "https://loremflickr.com/640/480?lock=7482940235823759",
            genre_id: 3,
            max_attendees: 420,
            location: {
              name: "Klein - Jakubowski Hall",
              address: "1892 Pine Loop",
              city: "Maple Hollow",
              state: "Montana",
              country: "Saint Kitts and Nevis",
              zipCode: "59301"
            },
            start: "2025-05-02T18:00:00.000Z",
            end: "2025-05-03T02:30:00.000Z",
            timeZone: "Europe/Oslo",
            organizer_id: 2
          
            
        }
      
      return request(app)
        .post("/api/events")
        .send(newEvent)
        .expect(201)
        .then(({ body }) => {
          expect(body.event).toHaveProperty('title');
          expect(body.event).toHaveProperty('description');
          expect(body.event).toHaveProperty('max_attendees');
          expect(body.event).toHaveProperty('genre_id');
          expect(body.event).toHaveProperty('location');
          expect(body.event).toHaveProperty('start_time');
          expect(body.event).toHaveProperty('end_time');
          expect(body.event).toHaveProperty('max_attendees');
          expect(body.event).toHaveProperty('timezone');
          expect(body.event).toHaveProperty('organizer_id');

         expect(typeof body.event.event_id).toBe("number");
        });
    });
})

describe("PATCH  /api/events/:event_id ",()=>{
    test("PATCH: 200 response with ok when user update an event details ",()=>{
        const updatedEvent= {
            title: "Synthwave Soirée",
            description: "Delibero sursum vesper paulatim amiculum. Vulgus deporto tracto crux solutio blandior defleo. Capitulus subito suffragium utor comprehendo cenaculum stella.",
            url_img: "https://loremflickr.com/640/480?lock=6834290512837642",
            genre_id: 4,
            max_attendees: 180,
            location: {
              name: "Rowe - Reichel Arena",
              address: "5128 Lavender Ridge",
              city: "Crystal Bay",
              state: "Nevada",
              country: "Turks and Caicos Islands",
              zipCode: "88901"
            },
            start: "2025-06-10T19:30:00.000Z",
            end: "2025-06-11T01:00:00.000Z",
            timeZone: "Asia/Tokyo",
            organizer_id: 3
          }
        return request(app)
        .patch("/api/events/2")
        .send(updatedEvent)
        .expect(200)
        .then(({ body }) => {  
            expect(body.event.title).toBe('Synthwave Soirée')
            expect(body.event.description).toBe('Delibero sursum vesper paulatim amiculum. Vulgus deporto tracto crux solutio blandior defleo. Capitulus subito suffragium utor comprehendo cenaculum stella.')
            expect(body.event.url_img).toBe('https://loremflickr.com/640/480?lock=6834290512837642')
            expect(body.event.genre_id).toBe(4)
            expect(body.event.max_attendees).toBe(180)
            expect(body.event.location).toEqual({
                name: 'Rowe - Reichel Arena',
                address: '5128 Lavender Ridge',
                city: 'Crystal Bay',
                state: 'Nevada',
                country: 'Turks and Caicos Islands',
                zipCode: '88901'
              });
            expect(body.event.start_time).toBe('2025-06-10T18:30:00.000Z')
            expect(body.event.end_time).toBe('2025-06-11T00:00:00.000Z')
            expect(body.event.timezone).toBe('Asia/Tokyo')
            expect(body.event.organizer_id).toBe(3)
            

        
        })
         


        })
})

describe("DELETE  /api/events/:event_id", () => {
    test("DELETE: 204, delets event and responds with the correct status when given the delete query", () => {
      return request(app)
      .delete("/api/events/1").expect(204);
    });
})

describe("POST /api/users",()=>{
    test("POST- 201 response with the new registered user",()=>{
       const newUser= {
        username: "Barrushi abdulhameed",
        email: "Barruso@hotmail.com",
        password: "123456789",
        role:"member",
        avatar: "https://avatars.githubusercontent.com/u/12133322",
        registeredAt: "2025-03-06T18:39:02.158Z"
    }
        return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .then(({body})=>{
            expect(body.user).toHaveProperty("username")
            expect(body.user).toHaveProperty("email")
            expect(body.user).toHaveProperty("password")
            expect(body.user).toHaveProperty("user_role")
            expect(body.user).toHaveProperty("avatar")
            expect(body.user).toHaveProperty("registeredat")
            expect(typeof body.user.user_id).toBe("number")



        })

    })
})
describe("Get /api/users/:username",()=>{
    test("GET - response with user's detials when requested by username",()=>{
        return request(app)
        .get("/api/users/michaelbrown")
       .expect(200)
       .then(({body})=>{
        expect(body.user.user_id).toBe(4)
        expect(body.user.name).toBe("Michael Brown")
        expect(body.user.email).toBe("michael.b@example.com")
        expect(body.user.password).toBe("mike_pass_202")
        expect(body.user.user_role).toBe("member")
        expect(body.user.avatar).toBe("https://example.com/avatars/michaelb.png")
        expect(body.user).toHaveProperty("registeredat")
       })

    })
})
describe("POST /api/event_attendees",()=>{
    test("Post- 201 response when user sign up for an event ",()=>{
        return request(app)
        .post("/api/event_attendees")
        .send({event_id: 2, user_id: 4})
        .expect(201)
        .then(({body})=>{
            expect(body.attendee.event_id).toBe(2)
            expect(body.attendee.user_id).toBe(4)
            expect(typeof body.attendee.attendee_id).toBe('number')

        })
    })
   

})

