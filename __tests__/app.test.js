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
    test("Get-200 response with  events  title , imag, location and date ",()=>{
        return request(app)
        .get("/api/events")
        .expect(200)
        .then(({body})=>{
            
            expect(body.events.length).toBe(13)
            body.events.forEach((event)=>{
                expect(typeof event.title).toBe("string")
                expect(typeof event.url_img ).toBe("string")
                expect(typeof event.location).toBe("string")
                expect(typeof event.date).toBe("string")
                
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
                expect(body.event.title).toBe("Total actuating emulation")
                expect(body.event.description).toBe("Fugit quidem abscido deorsum voveo corrupti alo deinde vix congregatio. Thermae bellicus decipio sumo cunctatio aufero volaticus soleo uredo. Cenaculum desipio aegre.")
                expect(body.event.url_img ).toBe("https://picsum.photos/seed/nd6eiD/640/480")
            
                expect(body.event.date).toBe("2026-01-27T00:00:00.000Z")
                
                expect(body.event.organizer_id).toBe(3)
            
            })
          
        })
    
})



describe("POST /api/events", () => {
    test("POST: 201 - adds a new event to the list", () => {
         const newEvent = { 
            title: "Innovative Sustainable Technology Summit",
            description:"Join industry leaders and innovators for a day of exploration and collaboration on emerging sustainable technologies. Network with experts, attend hands-on workshops", 
            url_img: "https://picsum.photos/seed/techEco22/640/480", genre_id: 3,
            max_attendees: 200,
            date:"2025-09-15T23:00:00.000Z",
            location:'{"name":"Greenfield Convention Center","address":"2145 Innovation Boulevard","city":"Austin","state":"Texas","country":"United States","zipCode":"78701"}',
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
         expect(typeof body.event.event_id).toBe("number");
        });
    });
})

describe("PATCH  /api/events/:event_id ",()=>{
    test("PATCH: 200 response with ok when user update an event details ",()=>{
        return request(app)
        .patch("/api/events/2")
        .send({
            title: "Triple-buffered client-driven architecture",
            description: "Cubitum curriculum libero annus. Tondeo delibero titulus absens. Vicissitudo non basium supellex cras sordeo adamo.",
            url_img: "https://picsum.photos/seed/Kt7x4/640/480",
            genre_id: 1,
            max_attendees: 334,
            date: "2026-02-08",
            timeZone: "Pacific/Wake",
            location: {
                
                    name: "Kuhn, Welch and Sons 2021",
                    address: "8830 Phoenix Meadow",
                    city: "Everettview",
                    state: "Oregon",
                    country: "Iceland",
                    zipCode: "97401"
                  
            },
            organizer_id: 4
        })
        .expect(200)
        .then(({ body }) => {
            
          expect(body.event.location).toEqual({
            name: "Kuhn, Welch and Sons 2021",
            address: "8830 Phoenix Meadow",
            city: "Everettview",
            state: "Oregon",
            country: "Iceland",
            zipCode: "97401"
          });
          expect(body.event.date).toBe("2026-02-08T00:00:00.000Z");
        })
         


        })
})

describe("DELETE  /api/events/:event_id", () => {
    test("DELETE: 204, delets event and responds with the correct status when given the delete query", () => {
      return request(app)
      .delete("/api/events/1").expect(204);
    });
})

