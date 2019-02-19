const {sum} = require('./eventbriteCalls.js')
const request = require('request-promise');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});