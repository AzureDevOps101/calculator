# Calculator Demo for Azure Pipeline

## Demo 1

1. Search Github Marketplace for Azure Pipeline and setup for the project in dev.azure.com/AzureDevOps101
2. In Template Page, show all templates. then show the yml view, talk about I don't know much about it
3. Cancel the process, so I use UI to create the Pipeline
4. In Location, choose "use visual designer"
5. Create an "empty pipeline"
6. Show the build pool list, and choose Ubuntu 1604
7. add steps
    1. npm install
    2. npm run build
    3. npm test
8. trigger manually
9. change api/controllers/arithmeticControllers.js adding function to trigger a test faliure
10. Trigger manullay and show the test failed log
11. Add another step to "Publish Test Results", make sure step "npm test" has "continue on err"
12. Show build Summary and Test Tab
13. Fix the problem and trigger another build and how build pass

## Demo 2

1. Enable build on Pull Reqeust
2. Create a Fork and submit some change from fork
3. Show the PR build and test failure

## Demo 3

1. Add Docker Build and Push tasks