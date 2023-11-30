const supertest = require("supertest")
const { createServer } = require("../../config/createServer")

const app = createServer()

describe('/events route', () => { 

    describe('/sort', () => { 

        describe('given the sort option is SOONEST', () => { 
            
            it('should return sorted events based on eventDate', async() => { 

                const res = await supertest(app).post("/events/sort")

                
                
            })
        })
       
        describe('given the sort option is EVENT_AZ', () => { 
            
            it('should return sorted events based on eventDate', () => { 


            })
        })
       
     })
 })