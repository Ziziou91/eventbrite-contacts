const { expect } = require('chai');
const { eventAttendees } = require('./mocks/mocks');
const KEYS = require('../.ignore/keys');
const { eventbriteContactParser } = require('../lib/hubspotData.js');
const { sendAttendeesToHubspot } = require('../index.js');

describe('eventbriteContactParser', function() {
  const result = eventbriteContactParser(eventAttendees);
  it('should return an array of people objects', () => {
    expect(result).to.be.an('array');
    expect(result.every(person => typeof person === 'object')).to.equal(true);
  });
  it('every attendee object includes a valid email address', () => {
    const validateEmail = email => {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(email.toLowerCase());
    };
    expect(result.every(person => validateEmail(person.email))).to.equal(true);
  });
  it('every attendee object includes a first name, last name and phone number', () => {
    expect(
      result.every(person =>
        person.properties.some(property => property.property === 'firstname')
      )
    ).to.equal(true);
    expect(
      result.every(person =>
        person.properties.some(property => property.property === 'lastname')
      )
    ).to.equal(true);
    expect(
      result.every(person =>
        person.properties.some(property => property.property === 'phone')
      )
    ).to.equal(true);
  });
  it('every attendee object includes a taster session or itp property', () => {
    expect(
      result.every(person =>
        person.properties.some(
          property =>
            property.property === 'free_taster_session' ||
            property.property === 'introduction_to_programming'
        )
      )
    ).to.equal(true);
  });
  it('returns an empty array when passed an empty array', () => {
    expect(eventbriteContactParser([])).to.eql([]);
  });
});
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
