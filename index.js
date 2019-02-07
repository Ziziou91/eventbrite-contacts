const request = require('request-promise');
const {getAllEvents, attendeesLiveEvents} = require('./lib/getEventbriteData.js')
const KEYS = require('./.ignore/keys');


const getITPIds = (events) => {
    return events.events.reduce((id, event) => {
        if (event.name.text.includes('Intro')) id.push(event.id)
        return id
    },[])
}

const eventbriteAttendeeParser = (data) => {
    return data.reduce((total, events) => {
        total.push(events.attendees.reduce((subTotal, event) => {
            
            if (event.status === 'Attending') subTotal.push(event.profile)
            return subTotal
        },[]))
        return total
    },[])
}

const sendAttendeesToHubspot = async () => {
    try {
        let result = await getAllEvents().then(getITPIds).then(attendeesLiveEvents).then(eventbriteAttendeeParser)
        let apps = result.flat().map(attendee => {
            let contact = {
                "email": attendee.email,
                "properties": [
                    {
                        "property": "firstname",
                        "value": attendee.first_name
                    },
                    {
                        "property": "lastname",
                        "value": attendee.last_name
                    }]
            }
            if (attendee.cell_phone) contact.properties.push(
                {
                    "property": "phone",
                    "value": attendee.cell_phone
            });
            if (attendee.addresses.bill) {
                if (attendee.addresses.bill.hasOwnProperty('city')) {
                contact.properties.push(
                {
                    "property": "city",
                    "value": attendee.addresses.bill.city
                },
                {
                    "property": "zip",
                    "value": attendee.addresses.bill.postal_code
                }
            )
            }
        }
            return contact
        });
        let options = {
                method: 'POST',
                uri: `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${KEYS.hubspot}`,
                body: apps,
                json: true // Automatically stringifies the body to JSON
        };
        request(options).then(function (parsedBody) {
            console.log('success')
        })
        .catch(error => console.log(error))
        }
    catch (error) {
        console.log(error)
    }
}
console.log(sendAttendeesToHubspot())






