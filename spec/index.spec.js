const { sendAttendeesToHubspot } = require('../index.js');
const { expect } = require('chai');
const KEYS = require('../.ignore/keys');

describe('sendAttendeesToHubspot', function() {
  this.timeout(5000);
  it('should return an array containing all attendees', async () => {
    let p = await sendAttendeesToHubspot(KEYS);
    expect(p).to.be.an('array');
  });
  it('should return an error message when given an invalid OAuth key', async () => {
    let error = await sendAttendeesToHubspot('test');
    expect(error.statusCode).to.equal(401);
  });
});
