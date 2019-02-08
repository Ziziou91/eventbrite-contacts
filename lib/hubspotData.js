const KEYS = require('../.ignore/keys');
const request = require('request-promise');

const contactParser = (people) => {
    return people.flat().map(attendee => {
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
}

const postContactsToHubspot = (contacts) => {
    let options = {
        method: 'POST',
        uri: `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${KEYS.hubspot}`,
        body: contacts,
        json: true // Automatically stringifies the body to JSON
};
request(options).then(function (parsedBody) {
    console.log('success')
})
.catch(error => console.log(error))
}


module.exports = {
    contactParser, postContactsToHubspot
}