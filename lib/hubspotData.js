const request = require('request-promise');

const contactParser = (attendees) => {
    return attendees.flat().map(attendee => {
        let contact = {
            "email": attendee.profile.email,
            "properties": [
                {
                    "property": "firstname",
                    "value": attendee.profile.first_name
                },
                {
                    "property": "lastname",
                    "value": attendee.profile.last_name
                }]
        }

        if (attendee.profile.cell_phone) contact.properties.push(
            {
                "property": "phone",
                "value": attendee.profile.cell_phone
        });
        if (attendee.profile.addresses.bill) {
            if (attendee.profile.addresses.bill.hasOwnProperty('city')) {
                contact.properties.push({
                    "property": "city",
                    "value": attendee.profile.addresses.bill.city
                },
                {
                    "property": "zip",
                    "value": attendee.profile.addresses.bill.postal_code
                })
            }
        }
        if (attendee.ticket_class_name === 'Introduction to Programming') {
            contact.properties.push({
                "property" : "introduction_to_programming",
                "value" : "yes"
            })
        }
        if (attendee.ticket_class_name === 'Coding Taster Session') {
            contact.properties.push({
                "property" : "free_taster_session",
                "value" : "yes"
            })
        }
        return contact
    });
}

const postContactsToHubspot = (contacts, auth) => {
    let options = {
        method: 'POST',
        uri: `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${auth}`,
        body: contacts,
        json: true // Automatically stringifies the body to JSON
};
request(options).then(function (parsedBody) {
    console.log('success')
})
.catch(error => console.log(error))
}

const postAttendeesToHubspot = (attendees, auth) => {
    const contacts = contactParser(attendees)
    postContactsToHubspot(contacts, auth)
    console.log('contacts posted to hubspot')
}

module.exports = {
    postAttendeesToHubspot
}