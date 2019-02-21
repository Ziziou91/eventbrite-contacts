const {getAllEvents, getAllSignups, getITPAndTasterIds, filterOnlyAttendees} = require('../lib/eventbriteData.js')
const {sendAttendeesToHubspot} = require('../index.js')
const { expect } = require("chai");
const KEYS = require('../.ignore/keys');
const request = require('request-promise');


describe('getAllEvents', function (){
    this.timeout(3000);
    it('should return an object with an events array containing all live Northcoders events', async () => {
        let p = await getAllEvents(KEYS.eventbrite)
        expect(p.events).to.be.an('array'); 
    })
})

describe('sendAttendeesToHubspot', function () {
    this.timeout(3000);
    it('should return an array containing all attendees', async () => {
        let p = await sendAttendeesToHubspot(KEYS)
        expect(p).to.be.an('array')
    })
    it('should return an error message when given an invalid OAuth key', async () => {
        let error = await sendAttendeesToHubspot('test')
        expect(error.statusCode).to.equal(401)
    })
})
