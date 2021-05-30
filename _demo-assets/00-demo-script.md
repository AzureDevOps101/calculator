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

## Demo 2 - Docker Build and Deploy to AKS

prep

```shell
az group create --name MyResourceGroup --location southeastasia
az aks create -g MyResourceGroup -n MyAKS --location southeastasia --node-vm-size Standard_DS2_v2 --node-count 2 --disable-rbac --generate-ssh-keys

az aks get-credentials -g MyResourceGroup -n MyAKS

az aks use-dev-spaces -g MyResourceGroup -n MyAKS --space dev --yes

```

	1. Add a Dockerfile
	2. Build the docker container and run it locally

	```shell
	docker build -t calculator:v2 .
	```

	3. Show the ACR and copy the key 

	```shell
	docker login {acr-name}.azurecr.io
	```

	4. Tag and push the image

	```shell
	docker tag calculator:v2 {acr-name}.azurecr.io/calculator:v2
	docker push {acr-name}.azurecr.io/calculator:v2
	```

	5. Create kube-deploy.yml and deploy to AKS

	```shell
	az login
	az account set -s {sub-id}
	az aks get-credential -g {resourceGroup} -n {aksName}

	kubectl create secret docker-registry regcred --docker-server={acr-name}.azurecr.io --docker-username={acr-name} --docker-password={acr-password} --docker-email=leixu@leansoftx.com

	kubectl apploy -f kube-deploy.yml
	```
## Demo 3 - Create pipeline for docker build and AKS deployment

	1. Create a classic build with Docker Container template
		- tick add "latest" tags
	2. Add the following 2 steps
		- Copy File
		- Publish Build Artifact
		and publish kube-deploy.yml
	3. Trigger the build
	4. Create a release definition with Kubernetes Cluster deployment template
		- create secret name: regcred
	5. kube-deploy.yaml location 
		$(System.DefaultWorkingDirectory)/_calculator/drop/kube-deploy.yaml

## Demo 4 - Use Azure Dev Spaces in Visual Studio 2019 with .net core web app

	1. create new .net core web app with mvc
	2. Enable Dev Space
	3. Start debugging and set breakpoint
	4. add Environment.MachineName to show the container (pod) name

## Demo 5 - Use Azure Dev Spaces in Visual Studio Code 

	1. Following documentation from https://github.com/AzureDevOps101/BikeSharingApp


## Demo 6 - Istio

	1. show test environment and pipeline
		- vote: http://13.76.172.131:31654/
		- result: http://13.76.172.131:31844/

	2. show production environment
		- vote: http://vote.devopshub.cn
		- result: http://result.devopshub.cn
		show gateway.yaml

	3. Sceanrio: v2 is ready to go live 

	4. Use kubectl to explain how istio working

	```shell

	# rollback to old version first
	kubectl apply -f vote-app-old.yml
	# refresh http://vote.devlopshub.cn and always see v1

	# start canary deployment 10% for vew version v2
	kubectl apply -f vote-app-90-10.yml
	# refresh http://vote.devlopshub.cn and see v2 for 10% of time
	# try to change 50/50 and refresh again

	# direct all traffic to v2
	kubectl apply -f vote-app-new.yml
	# refresh http://vote.devlopshub.cn and always see v2

	# rollback to old version again
	kubectl apply -f vote-app-old.yml
	# refresh http://vote.devlopshub.cn and always see v1
	```

	5. Show the Production Pipeline and simulate the same process as above 

## Demo 7 - GitHub Actions

Enable github action for caculator app.


1. in Github repo, click on Action | New workflow
2. Choose [Deploy Node.js to Azure Web App](https://github.com/actions/starter-workflows/blob/3c3736f59805d1e4f838182263705f44fab9cf68/ci/azure.yml) action
3. In Azure Portal, create a "Web App" with Node 10.0 as the runtime
4. Download "Publish Profile" from the web app homepage
5. Create a secret in GitHub repo, name it AZURE_WEBAPP_PUBLISH_PROFILE and copy all content from "publish profile" into this secret
6. in the Github action configuration file, default path is ".github/workflows/azure.yml", update the following parameters

```yml
  AZURE_WEBAPP_NAME: <your app name> ## get this from azure
```

7. Update the following as the trigger

Note: this is only for demo purpose

```yml
on:
  ##release:
  ##  types: [created]
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
```

8. Commit the yml file will trigger the action to push the app into web app

then you can start your demo for the calculator scenario.




	
