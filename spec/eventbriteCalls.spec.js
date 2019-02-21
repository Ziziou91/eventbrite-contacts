const {getAllEvents, getAllSignups, getITPAndTasterIds, filterOnlyAttendees} = require('../lib/eventbriteData.js')
const { expect } = require("chai");
const KEYS = require('../.ignore/keys');
const request = require('request-promise');


describe('getAllEvents', function (){
    this.timeout(3000);
    // it('should return an object with an events array containing all live Northcoders events', async () => {
    //     const p = await getAllEvents(KEYS.eventbrite)
    //     expect(p.events).to.be.an('array'); 
    // })
    it('should return an error message when given an invalid OAuth token ', async () => {
        const errorMessage = '401 - {"status_code":401,"error_description":"The OAuth token you provided was invalid.","error":"INVALID_AUTH"}'
        const p = await getAllEvents()
        console.log(typeof p)
        expect(p).to.equal(errorMessage); 
    })
})