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
    postAttendeesToHubspot(attendees, eventbriteContactParser, auth.hubspot);
    return attendees;
  } catch (error) {
    return error;
  }
};

const sendYCBMBookingsHubspot = async auth => {
  try {
    const bookings = await getYCBMBookings(auth.ycbm);
    console.log(bookings);
    postAttendeesToHubspot(bookings, ycbmContactParser, auth.hubspot);
  } catch (error) {
    console.log(error);
    return error;
  }
};

// const sendTasksToHubspot = async auth => {
//   try {

//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

//sendAttendeesToHubspot(KEYS);
sendYCBMBookingsHubspot(KEYS);

module.exports = {
  sendAttendeesToHubspot
};
