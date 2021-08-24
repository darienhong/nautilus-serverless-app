const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 


exports.handler = function(event, context, callback) { 
    console.log(event);
    const tableName = "events"; 
    const params = { 
        TableName: tableName, 
        Key: { 
            eventId: event['pathParameters']['eventId']
        }
    }; 

    dynamodb.get(params, function(err, data){ 
        if (err){ 
            var response = { 
                "statusCode": 500,
                "error": err.message
            }
            callback(response, null);
        } else { 
            var response = { 
                "statusCode": 200, 
                "body": JSON.stringify(data.Item),
                "headers": { 
                    "Access-Control-Allow-Origin": '*',
                }
                
            }
            callback(null, response);
        }
    })
} 