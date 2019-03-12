const request = require('request-promise');

const contactParser = attendees => {
  return attendees.flat().reduce((total, attendee) => {
    const emailValidator = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
    if (
      'email' in attendee.profile &&
      emailValidator.test(attendee.profile.email)
    ) {
      let ticketArr = attendee.ticket_class_name.split(' ');
      let eventAttended = ticketArr.includes('Introduction')
        ? 'introduction_to_programming'
        : 'free_taster_session';
      let contact = {
        email: attendee.profile.email,
        properties: [
          {
            property: 'firstname',
            value: attendee.profile.first_name
          },
          {
            property: 'lastname',
            value: attendee.profile.last_name
          },
          {
            property: eventAttended,
            value: 'true'
          }
        ]
      };
      if (attendee.profile.cell_phone)
        contact.properties.push({
          property: 'phone',
          value: attendee.profile.cell_phone
        });
      if (attendee.profile.addresses.bill) {
        if (attendee.profile.addresses.bill.hasOwnProperty('city')) {
          contact.properties.push(
            {
              property: 'city',
              value: attendee.profile.addresses.bill.city
            },
            {
              property: 'zip',
              value: attendee.profile.addresses.bill.postal_code
            }
          );
        }
      }
      total.push(contact);
    }
    return total;
  }, []);
};

const postContactsToHubspot = (contacts, auth) => {
  let options = {
    method: 'POST',
    uri: `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${auth}`,
    body: contacts,
    json: true // Automatically stringifies the body to JSON
  };
  request(options)
    .then(function(parsedBody) {
      console.log('contacts posted to hubspot');
    })
    .catch(error => console.log(error));
};

const postAttendeesToHubspot = (attendees, auth) => {
  const contacts = contactParser(attendees);
  postContactsToHubspot(contacts, auth);
};

module.exports = {
  postAttendeesToHubspot,
  contactParser
};
