const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 


exports.handler = function(event, context, callback) { 
    console.log(event);
    const tableName = "teams"; 
    const params = { 
        TableName: tableName, 
        Item: { 
            teamId: event.teamId, 
            eventId: event.eventId,
            country: event.teamCountry,
            nomembers: event.nomembers,
            latitude: event.latitude,  
            longitude: event.longitude, 
            distance: event.distance
        }
    }; 

    dynamodb.put(params, function(err, data){ 
        if(err){ 
            callback(err, null);
        } else { 
            callback(null, data);
        }
    });
} 