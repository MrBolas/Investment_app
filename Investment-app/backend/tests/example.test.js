
//  Blocking Jest test
// This test fails because 1 !== 2
it('Example test', () => {
    expect(1).toBe(1)
  })

//  Non-Blocking Jest test  
it('Async Example test', async done => {
    // Do your async tests here
    
    done()
    })