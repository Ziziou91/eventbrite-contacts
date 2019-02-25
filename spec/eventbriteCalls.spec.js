const {getAllEvents, getAllSignups, getITPAndTasterIds, filterOnlyAttendees, eventIDReducer} = require('../lib/eventbriteData.js')
const { expect } = require("chai");
const {validEventIDs} = require('./mocks/mocks')
const KEYS = require('../.ignore/keys');


describe('getAllEvents', function (){
    this.timeout(6000);
    it('should return an object with an events array containing all live Northcoders events', async () => {
        let p = await getAllEvents(KEYS.eventbrite)
        expect(p.events).to.be.an('array'); 
    })
})
describe('getAllSignups', function () {
    this.timeout(4000)
    it('should return an array containing all attendees to specified events', async () => {
        let result = await getAllSignups(validEventIDs, KEYS.eventbrite)
        expect(result).to.be.an('array'); 
    })
    it('returns an empty array when given no ids', async () => {
        let result = await getAllSignups([], KEYS.eventbrite)
        expect(result).to.eql([])
    })
})
describe.only('eventIDReducer', function() {
    
})
