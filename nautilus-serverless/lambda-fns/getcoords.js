const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = function (event, context, callback) {
    console.log(event);
    const tableName = "coordinates";
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'teamId = :teamId and #ts > :d',
        ExpressionAttributeValues: { 
            ':teamId': parseInt(event['pathParameters']['teamId']),
            ':d': "2021-08-11T00:00:00",
        },
        ExpressionAttributeNames: { 
            '#ts': "timestamp",
        },
        ScanIndexForward: true, 
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