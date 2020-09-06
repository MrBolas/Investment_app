const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)


var house_id;


it('Gets all the Houses endpoint', async done => {
    const response = await request.get('http://localhost:3000/api/house/')

    expect(response.status).toBe(200)
    done()
})

it('Gets a specific House by id', async done => {
    const response = await request.get('http://localhost:3000/api/house/5f52831b773f074db4f929e0')
  
    expect(response.status).toBe(200)
    done()
})

it('Post new House endpoint', async done => {
    const response = await request.post('')
  
    expect(response.status).toBe(200)
    done()
})

it('Puts changes to House endpoint', async done => {
    const response = await request.put('')
  
    expect(response.status).toBe(200)
    done()
})
