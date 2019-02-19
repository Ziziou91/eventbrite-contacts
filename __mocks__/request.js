const request = require('request-promise');


'use strict';
module.exports = {
    get: () => {
        return Promise.resolve({
            data: [
                {
                id: 0,
                name: 'Wash the dishes'
                },
                {
                id: 1,
                name: 'Make the bed'
                }
            ]
        });
    }
};

request.request = request;

module.exports = request;