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

const getAllEvents = async (auth) => {
    return request(`https://www.eventbriteapi.com/v3/users/me/owned_events/?status=live,started&token=${auth}`, { json: true }, (body) => {
        return (body);
    })
    .catch(function(error){
        return error.message
    })

    // .catch(function(err){ 
    //     if (err.statusCode = '401') return "The OAuth token you provided was invalid."
    //  //console.log(err.statusCode)
    // });
}

const eventIDReducer = (events) => {
    return events.events.reduce((id, event) => {
        if (event.name.text.includes('Intro') || event.name.text.includes('Taster')) id.push(event.id)
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

const getEventbriteIDs = async (auth) => {
    const allEvents = await getAllEvents(auth)
    return eventIDReducer(allEvents)
}

const getAttendees = async (eventIDs) => {
    const allSignups = await getAllSignups(eventIDs)
    return filterOnlyAttendees(allSignups) 
}  

module.exports = {
    getAttendees, getEventbriteIDs
}