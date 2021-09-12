# ArgoCD

## Installation

Server

```shell
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl get pods -n argocd --watch
```

CLI
Download from https://github.com/argoproj/argo-cd/releases/

```shell
cp ~/Downloads/argocd-darwin-amd64 /usr/local/bin/argocd
chmod +x /usr/local/bin/argocd
```

## Expose

```shell
## change to use LB
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
## get password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
argocd login <ARGOCD_SERVER>
argocd account update-password
```


## Create Sample

```shell
argocd app create guestbook --repo https://github.com/argoproj/argocd-example-apps.git --path guestbook --dest-server https://kubernetes.default.svc --dest-namespace default
argocd app get guestbook
```

## Create boathouse-calcualtor

```shell
argocd app create boathouse-calculator --repo https://github.com/idcf-boat-house/boathouse-calculator.git --path kubeconfig --revision tid --dest-server https://kubernetes.default.svc --dest-namespace default
argocd app get boathouse-calculator
```