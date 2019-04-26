# Calculator Demo for Azure Pipeline

## Demo 1 - Integrate GitHub public repo with Azure Pipeline

**Setup**
1. Git clone https://github.com/AzureDevOps101/calculator
2. Make the following changes 
	a. Introduce the bug change (+a + +b) to (a + b)
	b. Remove unit test for Additions to avoid test failure
	c. Remove /azure-pipelines.yml so we can create to from scratch 
3. Push it back to Github for a new repo
4. Create a Azure Web App for the Release Pipeline to use and make sure you have the following Configuration
WEBSITE_NODE_DEFAULT_VERSION = 8.9.4

**Steps:**

### Section 1

	1. Go to the new repo
	2. Toto GitHub Marketplace and search for "Azure Pipeline"
	3. Enable Azure Pipeline and setup an Azure Pipeline for the Calculator app
	4. Add steps for packaging Artefacts
	5. Add Release Pipeline to deploy application to Azure Web App 
	6. Trigger deploy and show the app running
	7. Send the URL to audience for testing

### Section 2

	1. Audience find the bug about a + b
	2. Create an GitHub Issue and try to fix the issue
	3. Follow TDD and add unit test for a + b first
	4. Commit to master branch
	5. Re-configure Azure Pipeline
		a. Override YAML build triggers
		b. Trigger on master branch
		c. Trigger on Pull Request and require team member comment to start build
		d. (Release Pipeline) only trigger on master branch (prevent PR build to trigger deploy)

### Section 3

	1. Use another account leixu216
	2. (leixu216) Fork the repo
	3. (leixu216) commit #1 try to make some changes which is not going to fix the build
	4. (leixu216) create PR to main repo 
	5. (ups216) to trigger the build using /azurepipeline run
	6. (ups216) use vscode PR extension to review the code
	7. (leixu216) commit #2 finally fix the code 
	8. (ups216) close the review, trigger build again (/azp run) and accept PR when build is ok
	9. Check the CI/CD full pipeline is running and URL is updated
    10. Ask audience to test 
