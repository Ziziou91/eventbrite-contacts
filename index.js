const { getEventbriteIDs, getAttendees } = require('./lib/eventbriteData.js');
const {
  postAttendeesToHubspot,
  eventbriteContactParser,
  ycbmContactParser,
  postEngagementToHubspot
} = require('./lib/hubspotData');
const { getYCBMBookings } = require('./lib/youCanBookMe');
const KEYS = require('./.ignore/keys');

const sendAttendeesToHubspot = async (
  auth,
  eventNames = ['taster', 'introduction']
) => {
  try {
    const eventIDs = await getEventbriteIDs(auth.eventbrite, eventNames);
    const attendees = await getAttendees(eventIDs, auth.eventbrite);
    //console.log(attendees)
    postAttendeesToHubspot(attendees, eventbriteContactParser, auth.hubspot);
    return attendees;
  } catch (error) {
    console.log(error);
    return error;
  }
};

sendAttendeesToHubspot(KEYS);
//sendYCBMBookingsHubspot(KEYS);

module.exports = {
  sendAttendeesToHubspot
};
