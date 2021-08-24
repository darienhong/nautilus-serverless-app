const AWS = require('aws-sdk'); 
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

exports.handler = function(event, context, callback){

    let scanningParameters = { 
        TableName: 'events', 
        Limit: 100
    }; 

    dynamodb.scan(scanningParameters, function(err, data){ 
        if(err){ 
            var response = { 
                "statusCode": 500, 
                "error": err.message
            }
            callback(response, null);
        } else { 
            var response = { 
                "statusCode": 200, 
                "body": JSON.stringify(data.Items), 
                "headers": { 
                    "Access-Control-Allow-Origin": '*',
                }
            }
            callback(null, response); 
        }
    }); 
}