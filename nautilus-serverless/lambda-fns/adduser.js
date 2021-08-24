const AWS = require('aws-sdk'); 
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

exports.handler = function(event, context, callback){ 
    let email = "temp"; 
    let phone = "temp";
    let username = "temp"

    if (event.body){ 
        let body = JSON.parse(event.body); 
        if (body.email){ 
            email = body.email;
        }

        if (body.phone){ 
            phone = body.phone;
        }

        if (body.username){ 
            username = body.username;
        }
    }
    const params = { 
        TableName: "users", 
        Item: { 
            userId: username,  
            email: email, 
            phone: phone, 
            favourites: [],
        }
    }; 

    dynamodb.put(params, function(err, data){ 
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
    });

}