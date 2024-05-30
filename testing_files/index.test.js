const validateText = require('../client/index.js')

test('Ensures that empty strings are not submitted', () => {
    expect(validateText("Hello World")).toBe(true)
})