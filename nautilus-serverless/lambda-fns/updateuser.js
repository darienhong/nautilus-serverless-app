const AWS = require('aws-sdk'); 
const dynamodb = AWS.DynamoDB.DocumentClient({ region: 'us-east-1'});

exports.handler = function(event, context, callback) { 
    console.log(event);
    const tableName = "user"; 
    const params = { 
        TableName: tableName, 
        Key: event.userId,
        Item: { 
            teamId: event.teamId, 
            name: event.teamName,
            time: event.time, 
            location: event.location, 
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