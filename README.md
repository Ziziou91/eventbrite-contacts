Application to creates contacts in Hubspot CRM from a list of orders placed on Eventbrite

Currently call Eventrbite to get the id's of all live ITP events, gets the details of all attendees and then submits these people to Eventbrite

requires a keys.js file in a .ignore file with the following code:

module.exports = {
    "eventbrite" : "TOKEN",
    "hubspot" : "TOKEN"
}

npm install
node index.js