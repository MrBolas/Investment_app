const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)


var house_id;


it('Gets all the Houses endpoint', async done => {
    const response = await request.get('')

    expect(response.status).toBe(200)
    done()
})

it('Gets a specific House by id', async done => {
    const response = await request.get('api/house/5f35723e956e651d64e279e5')
  
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
