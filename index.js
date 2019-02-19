const {getAllEvents, getAllSignups, getITPAndTasterIds, filterOnlyAttendees} = require('./lib/eventbriteData.js')
const {contactParser, postContactsToHubspot} = require('./lib/hubspotData')

const sendAttendeesToHubspot = async () => {
    try {
        await getAllEvents()
                .then(getITPAndTasterIds)
                .then(getAllSignups)
                .then(filterOnlyAttendees)
                .then(contactParser)
                .then(postContactsToHubspot)
        }
    catch (error) {
        console.log(error)
    }
}
sendAttendeesToHubspot()






