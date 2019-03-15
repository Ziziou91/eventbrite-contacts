const request = require('request-promise');

const ycbmContactParser = bookings => {
  const parsedBookings = [];

  for (let calendar in bookings) {
    parsedBookings.push(
      bookings[calendar].map(booking => {
        const attendee = booking.title.split(' ');
        let lastName = '';
        if (attendee.length === 3) {
          lastName = attendee[1];
        }
        const firstName = attendee[0];
        const email = attendee[attendee.length - 1];
        let contact = {
          email: email,
          properties: [
            {
              property: 'firstname',
              value: firstName
            },
            {
              property: 'lastname',
              value: lastName
            }
          ]
        };
        if (calendar.includes('Challenge'))
          contact.properties.push({
            property: 'northcoders_interview_date_string',
            value: booking.startsAt
          });
        else
          contact.properties.push({
            property: 'campus_tour',
            value: `${calendar} - ${booking.startsAt}`
          });
        return contact;
      })
    );
  }
  return parsedBookings.flat();
};

const eventbriteContactParser = attendees => {
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
  const options = {
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

const taskCreator = (contacts, auth) => {
  contacts.forEach(contact => {
    if (
      contact.properties.some(property => {
        return property['property'] === 'campus_tour';
      })
    ) {
      let engagement = createFollowUpEngagement(contact);
      postEngagementToHubspot(engagement, auth);
    }
  });
};

const createFollowUpEngagement = contact => {
  const valueArray = contact.properties[2].value.split(' ');
  const location = valueArray.includes('Leeds') ? 'Leeds' : 'Manchester';
  return {
    body: `Contact ${contact.properties[0].value} ${
      contact.properties[1].value
    } after campus tour in ${location}`,
    subject: `Campus Tour follow-up ${contact.properties[0].value} ${
      contact.properties[1].value
    }`,
    status: 'NOT_STARTED',
    forObjectType: 'CONTACT'
  };
};

const postEngagementToHubspot = (engagement, auth) => {
  const body = {
    engagement: {
      active: true,
      ownerId: 30676982,
      type: 'TASK'
    },
    associations: {},
    metadata: engagement
  };

  let options = {
    method: 'POST',
    uri: `https://api.hubapi.com/engagements/v1/engagements?hapikey=${auth}`,
    body: body,
    json: true
  };
  request(options)
    .then(function(parsedBody) {
      console.log('engagement posted to hubspot');
    })
    .catch(error => console.log(error));
};

const postAttendeesToHubspot = (attendees, parser, auth) => {
  const contacts = parser(attendees);
  taskCreator(contacts, auth);
  postContactsToHubspot(contacts, auth);
};

module.exports = {
  postAttendeesToHubspot,
  postEngagementToHubspot,
  eventbriteContactParser,
  ycbmContactParser
};
