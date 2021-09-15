# Tekton

## Installation

```shell
## Server
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml

## Dashboard
kubectl apply --filename https://github.com/tektoncd/dashboard/releases/latest/download/tekton-dashboard-release.yaml

## Expose Dashboard
kubectl --namespace tekton-pipelines port-forward svc/tekton-dashboard 9097:9097
```

## Run Boathouse Calcuator Pipeline

1. Import folder /tekton
2. Create PipelineResource as Git
3. Create a Pipeline run and enter DOCKER_USER and DOCKER_PASS
4. Trigger a run
