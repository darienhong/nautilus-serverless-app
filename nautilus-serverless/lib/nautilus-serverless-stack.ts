import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit'; 
import * as dynamodb from '@aws-cdk/aws-dynamodb'; 
import * as lambda from '@aws-cdk/aws-lambda'; 
import * as apigateway from '@aws-cdk/aws-apigateway'; 
import * as amplify from '@aws-cdk/aws-amplify';


export class NautilusServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creation of the source control repository 
    const sourceRepo = new codecommit.Repository(this, "SourceRepo", 
    { 
      repositoryName: "nautilus-serverless-application", 
      description: "CodeCommit repository that will be used as the source repository for the react app and cdk app",

    });

    const amplifyApp = new amplify.App(this, "react-app", { 
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({ 
        repository: sourceRepo,
      }),
    });

    const masterBranch = amplifyApp.addBranch("master");

    const userTable = new dynamodb.Table(this, 'UserTable', { 
      tableName: 'users', 
      partitionKey: {
        name: 'userId', 
        type: dynamodb.AttributeType.STRING 
      }, 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    
    const eventTable = new dynamodb.Table(this, 'EventTable', { 
      tableName: 'events', 
      partitionKey: { 
        name: 'eventId', 
        type: dynamodb.AttributeType.STRING
      }, 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const teamTable = new dynamodb.Table(this, 'TeamTable', { 
      tableName: 'teams', 
      partitionKey: { 
        name: 'teamId', 
        type: dynamodb.AttributeType.NUMBER
      }, 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    teamTable.addGlobalSecondaryIndex({ 
      indexName: 'eventId-index', 
      partitionKey: { 
        name: 'eventId', 
        type: dynamodb.AttributeType.STRING
      }
    });

    teamTable.addGlobalSecondaryIndex({ 
      indexName: 'distance-index', 
      partitionKey: { 
        name: 'eventId', 
        type: dynamodb.AttributeType.STRING
      }, 
      sortKey: { 
        name: 'distance', 
        type: dynamodb.AttributeType.NUMBER
      }
    });

    const coordinatesTable = new dynamodb.Table(this, 'CoordTable', { 
      tableName: 'coordinates', 
      partitionKey: { 
        name: 'teamId',
        type: dynamodb.AttributeType.NUMBER
      },  
      sortKey: { 
        name: 'timestamp', 
        type: dynamodb.AttributeType.STRING
      }, 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    coordinatesTable.addGlobalSecondaryIndex({ 
      indexName: 'distance-index', 
      partitionKey: { 
        name: 'teamId', 
        type: dynamodb.AttributeType.NUMBER
      }, 
      sortKey: { 
        name: 'distance',
        type: dynamodb.AttributeType.NUMBER
      }
    });


    const ingestionFunction = new lambda.Function(this, 'IngestionFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'ingestion.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"),
      environment: { 
        TABLE_NAME: teamTable.tableName,
      }
    });

    teamTable.grantReadWriteData(ingestionFunction);

    const generateDashboardFunction = new lambda.Function(this, 'DashboardFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'dashboard.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"), 
      environment: { 
        TABLE_NAME: eventTable.tableName,
      }
    });

    eventTable.grantReadWriteData(generateDashboardFunction);

    const getEventFunction = new lambda.Function(this, 'EventFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'getevent.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"),
      environment: { 
        TABLE_NAME: eventTable.tableName,
      }
    });

    eventTable.grantReadWriteData(getEventFunction);

    const getTeamFunction = new lambda.Function(this, 'TeamFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'getteam.handler',
      memorySize: 1024,
      code: lambda.Code.fromAsset("lambda-fns"),
      environment: { 
        TABLE_NAME: teamTable.tableName,
      }
    }); 

    teamTable.grantReadWriteData(getTeamFunction);

    const getAllTeamsFunction = new lambda.Function(this, 'AllTeamsFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'getallteams.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"),
      environment: { 
        TABLE_NAME: teamTable.tableName,
      }
    });

    teamTable.grantReadWriteData(getAllTeamsFunction);

    const addFavouriteTeam = new lambda.Function(this, 'addFavouriteFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'addfavourite.handler',
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"), 
      environment: { 
        TABLE_NAME: userTable.tableName,
      }
    }); 

    userTable.grantReadWriteData(addFavouriteTeam);

    const getUserFav = new lambda.Function(this, 'getUserFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'getuserfavourites.handler',
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"), 
      environment: { 
        TABLE_NAME: userTable.tableName,
      }
    }); 

    userTable.grantReadWriteData(getUserFav);

    const addUser = new lambda.Function(this, 'addUserFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'adduser.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"), 
      environment: { 
        TABLE_NAME: userTable.tableName,
      }
    }); 

    userTable.grantReadWriteData(addUser);

    const addCoords = new lambda.Function(this, 'addCoordinatesFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'addcoords.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"), 
      environment: { 
        TABLE_NAME: coordinatesTable.tableName,
      }
    }); 

    coordinatesTable.grantReadWriteData(addCoords);

    const loadLeaderboard = new lambda.Function(this, 'leaderboardFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'leaderboard.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"), 
      environment: { 
        TABLE_NAME: teamTable.tableName,
      }
    }); 

    teamTable.grantReadWriteData(loadLeaderboard);

    const getCoordinates = new lambda.Function(this, 'getCoordinatesFunction', { 
      runtime: lambda.Runtime.NODEJS_10_X, 
      handler: 'getcoords.handler', 
      memorySize: 1024, 
      code: lambda.Code.fromAsset("lambda-fns"), 
      environment: { 
        TABLE_NAME: coordinatesTable.tableName,
      }
    }); 

    coordinatesTable.grantReadWriteData(getCoordinates);

    const api = new apigateway.RestApi(this, 'race-api', { 
      defaultCorsPreflightOptions: { 
        allowOrigins: apigateway.Cors.ALL_ORIGINS, 
        allowMethods: apigateway.Cors.ALL_METHODS,
      }
    }); 

    const generateDashboardIntegration = new apigateway.LambdaIntegration(generateDashboardFunction); 
    const events = api.root.addResource('events');
    events.addMethod('GET', generateDashboardIntegration); 

    const event = events.addResource('{eventId}'); 
    const getEventIntegration = new apigateway.LambdaIntegration(getEventFunction);
    event.addMethod('GET', getEventIntegration); 

    const teams = api.root.addResource('teams'); 
    const team = teams.addResource('{teamId}');
    const getTeamIntegration = new apigateway.LambdaIntegration(getTeamFunction); 
    team.addMethod('GET', getTeamIntegration); 

    const allTeams = api.root.addResource('allTeams'); 
    const eventTeam = allTeams.addResource('{eventId}'); 
    const getAllTeamsIntegration = new apigateway.LambdaIntegration(getAllTeamsFunction); 
    eventTeam.addMethod('GET', getAllTeamsIntegration);

    const favourites = api.root.addResource('favourite'); 
    const favourite = favourites.addResource('{userId}');
    const addFavouriteIntegration = new apigateway.LambdaIntegration(addFavouriteTeam);
    favourite.addMethod('POST', addFavouriteIntegration);
    const getUserFavouritesIntegration = new apigateway.LambdaIntegration(getUserFav);
    favourite.addMethod('GET', getUserFavouritesIntegration);

    const users = api.root.addResource('user'); 
    const addUserIntegration = new apigateway.LambdaIntegration(addUser);
    users.addMethod('POST', addUserIntegration);

    const leaderboard = api.root.addResource('leaderboard'); 
    const eventleaderboard = leaderboard.addResource('{eventId}'); 
    const generateLeaderboardIntegration = new apigateway.LambdaIntegration(loadLeaderboard);
    eventleaderboard.addMethod('GET', generateLeaderboardIntegration);

    const coordinates = api.root.addResource('coordinates'); 
    const teamCoords = coordinates.addResource('{teamId}'); 
    const getCoordinatesIntegration = new apigateway.LambdaIntegration(getCoordinates); 
    teamCoords.addMethod('GET', getCoordinatesIntegration);
    
  
  }
}
