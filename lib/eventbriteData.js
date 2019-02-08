const KEYS = require('../.ignore/keys');
const request = require('request-promise');

const getAllSignups = async (ids) => {
    try {
    let liveEvents = ids.map(async (id) => await request(`https://www.eventbriteapi.com/v3/events/${id}/attendees/?token=${KEYS.eventbrite}`, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            return (body);
        })
    );
    let allAttendees = []
    for (const result of liveEvents) {
        allAttendees.push(await result);
    }
    return(allAttendees);
    }
    catch (error) {
        console.log(error)
    }
}

const getAllEvents = () => {
    return request(`https://www.eventbriteapi.com/v3/users/me/owned_events/?status=live,started&token=${KEYS.eventbrite}`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        return (body);
    });
}

const getITPIds = (events) => {
    return events.events.reduce((id, event) => {
        if (event.name.text.includes('Intro')) id.push(event.id)
        return id
    },[])
}

const filterOnlyAttendees = (data) => {
    return data.reduce((total, events) => {
        total.push(events.attendees.reduce((subTotal, event) => {
            
            if (event.status === 'Attending') subTotal.push(event.profile)
            return subTotal
        },[]))
        return total
    },[])
}

module.exports = {
    getAllSignups, getAllEvents, getITPIds, filterOnlyAttendees
}