const {getEventbriteIDs, getAttendees} = require('./lib/eventbriteData.js')
const {postAttendeesToHubspot} = require('./lib/hubspotData')
const KEYS = require('./.ignore/keys');

const sendAttendeesToHubspot = async (auth) => {
    try {
        const eventIDs = await getEventbriteIDs(auth.eventbrite)
        const attendees = await getAttendees(eventIDs)
        postAttendeesToHubspot(attendees, auth.hubspot)
        }
    catch (error) {
        console.log(error)
    }
}
sendAttendeesToHubspot(KEYS)