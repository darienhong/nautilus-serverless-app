const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = function (event, context, callback) {
    console.log(event);
    const tableName = "teams";
    const params = {
        TableName: tableName,
        IndexName: 'distance-index',
        KeyConditionExpression: 'eventId = :eventId and distance > :d',
        ExpressionAttributeValues: { 
            ':eventId': event['pathParameters']['eventId'],
            ':d': 0,
        },
        ScanIndexForward: true, 
        Limit: 5
    };

    dynamodb.query(params, function (err, data) {
        if (err) {
            var response = {
                "statusCode": 500,
                "error": err.message
            }
            callback(null, response);
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
    })
};