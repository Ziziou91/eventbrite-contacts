const KEYS = require('../.ignore/keys');
const request = require('request-promise');

const getAllEvents = async (auth) => {
    try {
    return request(`https://www.eventbriteapi.com/v3/users/me/owned_events/?status=live,started&token=${auth}`, { json: true }, (body) => {
        return (body);
    })
    }
    catch (error) {
        throw new Error(error)
    }
}

const eventIDReducer = (events) => {
    return events.events.reduce((id, event) => {
        if (event.name.text.includes('Intro') || event.name.text.includes('Taster')) id.push(event.id)
        return id
    },[])
} 

const getAllSignups = async (ids) => {
    try {
    const liveEvents = ids.map(id => request(`https://www.eventbriteapi.com/v3/events/${id}/attendees/?token=${KEYS.eventbrite}`, { json: true }, (err, res, body) => {
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

const filterOnlyAttendees = (data) => {
    
    return data.reduce((total, events) => {
        total.push(events.attendees.reduce((subTotal, event) => {
            
            if (event.status === 'Attending') subTotal.push(event)
            return subTotal
        },[]))
        return total
    },[])
}

const getEventbriteIDs = async (auth) => {
        const allEvents = await getAllEvents(auth)
        if('error' in allEvents) {
            throw new Error(allEvents);
        }
        return eventIDReducer(allEvents)
}

const getAttendees = async (eventIDs) => {
    const allSignups = await getAllSignups(eventIDs)
    return filterOnlyAttendees(allSignups) 
}  

module.exports = {
    getAttendees, getEventbriteIDs, getAllEvents
}