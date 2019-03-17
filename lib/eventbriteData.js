const request = require('request-promise');

const getAllEvents = async auth => {
  try {
    return request(
      `https://www.eventbriteapi.com/v3/users/me/owned_events/?status=live,started&token=${auth}`,
      { json: true },
      body => {
        return body;
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const eventIDReducer = (eventNames, events) => {
  return events.events.reduce((id, event) => {
    if (
      eventNames.some(eventName =>
        event.name.text.toLowerCase().includes(eventName)
      )
    )
      id.push(event.id);
    return id;
  }, []);
};

const getAllSignups = async (ids, auth) => {
  try {
    const liveEvents = ids.map(id =>
      request(
        `https://www.eventbriteapi.com/v3/events/${id}/attendees/?token=${auth}`,
        { json: true },
        (err, res, body) => {
          return body;
        }
      )
    );
    return Promise.all(liveEvents).then(values => values);
  } catch (error) {
    throw new Error(error);
  }
};

const filterOnlyAttendees = data => {
  return data.reduce((total, events) => {
    total.push(
      events.attendees.reduce((subTotal, event) => {
        if (event.status === 'Attending') subTotal.push(event);
        return subTotal;
      }, [])
    );
    return total;
  }, []);
};

const getEventbriteIDs = async (auth, eventNames) => {
  const allEvents = await getAllEvents(auth);
  if ('error' in allEvents) {
    throw new Error(allEvents);
  }
  return eventIDReducer(eventNames, allEvents);
};

const getAttendees = async (eventIDs, auth) => {
  const allSignups = await getAllSignups(eventIDs, auth);
  return filterOnlyAttendees(allSignups);
};

module.exports = {
  getAttendees,
  getEventbriteIDs,
  getAllEvents,
  getAllSignups,
  eventIDReducer
};
