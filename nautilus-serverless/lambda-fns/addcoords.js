const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 


exports.handler = function(event, context, callback) { 
    console.log(event);
    const tableName = "coordinates"; 
    const params = { 
        TableName: tableName, 
        Item: { 
            teamId: event.teamId, 
            timestamp: event.timestamp,
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