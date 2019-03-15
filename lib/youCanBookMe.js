const request = require('request-promise');

const getAllCalendars = async auth => {
  try {
    return request(
      `https://api.youcanbook.me/v1/${auth.username}/profiles/`,
      {
        auth: {
          user: auth.username,
          pass: auth.password,
          sendImmediately: false
        },
        json: true
      },
      body => {
        return body;
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getBookings = async (calendarID, auth) => {
  try {
    return request(
      `https://api.youcanbook.me/v1/${
        auth.username
      }/profiles/${calendarID}/bookings`,
      {
        auth: {
          user: auth.username,
          pass: auth.password,
          sendImmediately: false
        },
        json: true
      },
      body => {
        return body;
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

//get all bookings
const getAllBookings = async (calendars, auth) => {
  const bookings = await calendars.reduce((total, calendar) => {
    total[calendar.title] = getBookings(calendar.id, auth);
    return total;
  }, {});
  let allResults = {};
  for (const result in bookings) {
    allResults[result] = await bookings[result];
  }
  return allResults;
};

/*{
    'calendar': []
}*/

const getYCBMBookings = async auth => {
  try {
    const calendars = await getAllCalendars(auth);
    const bookings = await getAllBookings(calendars, auth);
    return bookings;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getBookings,
  getAllBookings,
  getAllCalendars,
  getYCBMBookings
};
