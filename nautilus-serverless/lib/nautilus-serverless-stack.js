"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NautilusServerlessStack = void 0;
const cdk = require("@aws-cdk/core");
const codecommit = require("@aws-cdk/aws-codecommit");
const amplify = require("@aws-cdk/aws-amplify");
class NautilusServerlessStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Creation of the source control repository 
        const sourceRepo = new codecommit.Repository(this, "SourceRepo", {
            repositoryName: "nautilus-serverless-application",
            description: "CodeCommit repository that will be used as the source repository for the react app and cdk app",
        });
        const amplifyApp = new amplify.App(this, "react-app", {
            sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
                repository: sourceRepo,
            }),
        });
        const masterBranch = amplifyApp.addBranch("master");
    }
}
exports.NautilusServerlessStack = NautilusServerlessStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF1dGlsdXMtc2VydmVybGVzcy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hdXRpbHVzLXNlcnZlcmxlc3Mtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHNEQUFzRDtBQUl0RCxnREFBZ0Q7QUFHaEQsTUFBYSx1QkFBd0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNwRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDZDQUE2QztRQUM3QyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFDL0Q7WUFDRSxjQUFjLEVBQUUsaUNBQWlDO1lBQ2pELFdBQVcsRUFBRSxnR0FBZ0c7U0FFOUcsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDcEQsa0JBQWtCLEVBQUUsSUFBSSxPQUFPLENBQUMsNEJBQTRCLENBQUM7Z0JBQzNELFVBQVUsRUFBRSxVQUFVO2FBQ3ZCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBR3RELENBQUM7Q0FDRjtBQXRCRCwwREFzQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlY29tbWl0JzsgXG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInOyBcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJzsgXG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JzsgXG5pbXBvcnQgKiBhcyBhbXBsaWZ5IGZyb20gJ0Bhd3MtY2RrL2F3cy1hbXBsaWZ5JztcblxuXG5leHBvcnQgY2xhc3MgTmF1dGlsdXNTZXJ2ZXJsZXNzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gQ3JlYXRpb24gb2YgdGhlIHNvdXJjZSBjb250cm9sIHJlcG9zaXRvcnkgXG4gICAgY29uc3Qgc291cmNlUmVwbyA9IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkodGhpcywgXCJTb3VyY2VSZXBvXCIsIFxuICAgIHsgXG4gICAgICByZXBvc2l0b3J5TmFtZTogXCJuYXV0aWx1cy1zZXJ2ZXJsZXNzLWFwcGxpY2F0aW9uXCIsIFxuICAgICAgZGVzY3JpcHRpb246IFwiQ29kZUNvbW1pdCByZXBvc2l0b3J5IHRoYXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBzb3VyY2UgcmVwb3NpdG9yeSBmb3IgdGhlIHJlYWN0IGFwcCBhbmQgY2RrIGFwcFwiLFxuXG4gICAgfSk7XG5cbiAgICBjb25zdCBhbXBsaWZ5QXBwID0gbmV3IGFtcGxpZnkuQXBwKHRoaXMsIFwicmVhY3QtYXBwXCIsIHsgXG4gICAgICBzb3VyY2VDb2RlUHJvdmlkZXI6IG5ldyBhbXBsaWZ5LkNvZGVDb21taXRTb3VyY2VDb2RlUHJvdmlkZXIoeyBcbiAgICAgICAgcmVwb3NpdG9yeTogc291cmNlUmVwbyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWFzdGVyQnJhbmNoID0gYW1wbGlmeUFwcC5hZGRCcmFuY2goXCJtYXN0ZXJcIik7XG5cblxuICB9XG59XG4iXX0=