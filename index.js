const KEYS = require('../.ignore/keys')
const request = require('request-promise');

function getAllEvents() {
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

function getEventAttendees(ids) {
    return request(`https://www.eventbriteapi.com/v3/events/${ids[0]}/attendees/?token=${KEYS.eventbrite}`, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        return (body);
    });
} 

const getAttendees = async () => {
    try {
        let ITPIds = await getAllEvents().then(getITPIds).then(getEventAttendees)
        console.log(ITPIds)
        
    }
    catch (error) {
        console.log(error)
    }
}
getAttendees()

