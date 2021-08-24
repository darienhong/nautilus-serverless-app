const AWS = require('aws-sdk'); 
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

exports.handler = function(event, context, callback){ 
    const params = { 
        TableName: "events", 
        Item: { 
            eventId: event.eventId, 
            eventName: event.eventName, 
            noteams: event.noteams, 
            organizer: event.organizer,
        }
    }; 

    dynamodb.put(params, function(err, data){ 
        if (err){ 
            callback(err, null);
        } else { 
            callback(null, data);
        }
    })

}