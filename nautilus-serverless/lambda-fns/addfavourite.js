const AWS = require('aws-sdk'); 
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

exports.handler = function(event, context, callback){ 

    let teamId = 0; 
    let teamCountry = "temp"; 
    let nomembers = 0;
    let lat = "temp"; 
    let long = "temp";
    let distance = 0;

    if (event.body){ 
        let body = JSON.parse(event.body); 
        if (body.teamId){ 
            teamId = body.teamId;
        }

        if (body.teamCountry){ 
            teamCountry = body.teamCountry;
        }

        if (body.nomembers){ 
            nomembers = body.nomembers;
        }

        if (body.lat){ 
            lat = body.lat;
        }

        if (body.long){ 
            long = body.long;
        }

        if (body.distance){ 
            distance = body.distance;
        }
    }

    const favTeam = { 
        "teamId": teamId, 
        "country": teamCountry, 
        "nomembers": nomembers,
        "latitude": lat, 
        "longitude": long, 
        "distance": distance
    };

    const params = { 
        TableName: "users", 
        Key: { 
            userId: event['pathParameters']['userId'],
        }, 
        UpdateExpression: "SET #favourites = list_append(#favourites, :team)",
        ExpressionAttributeNames: { 
            "#favourites": "favourites"
        },
        ExpressionAttributeValues: { 
            ":team": [favTeam],
        },
    }; 

    dynamodb.update(params, function(err, data){ 
        if (err){ 
            var response = { 
                "statusCode": 500,
                "error": err.message
            }
            callback(null, response);
        } else { 
            var response = { 
                "statusCode": 200, 
                "body": "Success!",
                "headers": { 
                    "Access-Control-Allow-Origin": '*',
                }
            }
            callback(null, response);
        }
    })

}