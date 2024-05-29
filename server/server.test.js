const { sum, mult, io} = require('./server');


beforeAll(done => {
    done()
  })
  
afterAll(done => {
    io.close();
    done();
})

test('test add', function() 
{
    expect(sum(1, 2)).toBe(3);
});

test('test mult', function() 
{
    expect(mult(1, 2)).toBe(2);
});
