import { DynamoDB } from 'aws-sdk'; 

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient; 


exports.handler = async function(event) { 
    const tableName = "teams"; 
    const params = { 
        TableName: "teams", 
        Item: { 
            id: event.Id, 
            time: event.time, 
            location: event.location, 
        }
    }; 

    try { 
        const data = await dynamodb.put(params).promise(); 
        console.log(data); 
    } catch (err){
        console.log(err);
    }

} 


/*
exports.handler = (event, context, callback) => { 
    console.log(JSON.stringify(event, null, ' ')); 
    var tableName = "teams";
    dynamodb.putItem({ 
        "TableName": tableName, 
        "Item": { 
            "Id": event.Id, 
            "Time": event.Time, 
            "Location": event.Location, 
        
        }
    }, function(err, data){ 
        if (err) { 
            console.log('Error putting item into dynamodb failed: ' +err); 
            context.done('error');
        } else { 
            console.log('great success: ' + JSON.stringify(data, null, ' '));
            context.done('Done');
        }
    });
};

*/
