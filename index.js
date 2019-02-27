const {getEventbriteIDs, getAttendees} = require('./lib/eventbriteData.js')
const {postAttendeesToHubspot} = require('./lib/hubspotData')
const KEYS = require('./.ignore/keys');

const sendAttendeesToHubspot = async (auth, eventNames = ['taster', 'introduction']) => {
    try {
        const eventIDs = await getEventbriteIDs(auth.eventbrite, eventNames)
        const attendees = await getAttendees(eventIDs, auth.eventbrite)
        postAttendeesToHubspot(attendees, auth.hubspot)
        return attendees
        }
    catch (error) {
        return (error);
    }
}
sendAttendeesToHubspot(KEYS)

module.exports = {
    sendAttendeesToHubspot
}