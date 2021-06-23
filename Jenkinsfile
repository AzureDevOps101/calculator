def getHost() {
  def remote = [:]
  remote.name = 'server-dev'
  remote.host = "${DEVOPSBOX_HOST_IP}"
  remote.user = "${env.CREDS_DEVOPSBOX_USR}"
  remote.password = "${env.CREDS_DEVOPSBOX_PSW}"
  remote.port = 22
  remote.allowAnyHosts = true
  return remote
}

pipeline {
    agent{
        label 'vm-slave'
    }

    environment {
      CREDS_DEVOPSBOX = credentials('CREDS_DEVOPSBOX')
      SONAR_LOGIN = credentials('SONAR_LOGIN')
    }

    stages {

        stage('before-build'){
          steps {
            sh "printenv"
            sh "git log --oneline --graph"
          }
        }

        stage('CI'){
            parallel {
                stage('SonarQube Check') {
                    steps {
                        sh 'docker run --rm -e SONAR_HOST_URL="${SONAR_HOST_URL}" -e SONAR_LOGIN="${SONAR_LOGIN}" -v "${PWD}:/usr/src" sonarsource/sonar-scanner-cli'
                    }
                }

                stage('Unit Tests') {
                    steps {
                        sh 'docker-compose -f docker-compose-build.yaml -p boathouse-calculator-testrun up'
                        sh 'docker-compose -f docker-compose-build.yaml -p boathouse-calculator-testrun down -v --rmi all --remove-orphans'
                    }
                    post {
                        always{
                            echo "upload test results ..."
                            junit 'out/*.xml'
                        }                
                    }
                }

                stage('Docker Build') {
                    steps {
                        echo "Docker Build ... "
                        sh 'docker build -f Dockerfile -t ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:latest -t ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:${env.BRANCH_NAME}-${env.BUILD_ID} .'
                        echo "Docker Login to docker registry ..."
                        sh 'docker login ${REGISTRY_URL} -u ${REGISTRY_USER} -p ${REGISTRY_PWD}'
                        echo "Docker Push ..."
                        sh 'docker push ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:latest'
                        sh 'docker push ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:${env.BRANCH_NAME}-${env.BUILD_ID}'
                    }
                    post {
                        success{
                            echo "clearn up local images ..."
                            sh 'docker rmi -f ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:latest'
                            sh 'docker rmi -f ${REGISTRY_URL}/${REGISTRY_NS}/${env.BRANCH_NAME}-${env.BUILD_ID}'
                        }
                    }
                }
            }

        }

        

        // dev 环境
        stage('CD - DEV') { 
            steps {
              sh "sed -i 's/#{REGISTRY_URL}#/${REGISTRY_URL}/g' docker-compose-template.yaml"
              sh "sed -i 's/#{REGISTRY_NS}#/${REGISTRY_NS}/g' docker-compose-template.yaml"
              script {
                server = getHost()
                echo "copy docker-compose file to remote server..."       
                sshRemove remote: server, path: "./docker-compose-template-calculator.yaml"   // 先删除远程服务器上的文件，已确保是最新的文件
                sshPut remote: server, from: './docker-compose-template.yaml', into: './docker-compose-calculator.yaml'
                
                echo "stopping previous docker containers..."       
                sshCommand remote: server, command: "docker login ${REGISTRY_URL} -u ${REGISTRY_USER} -p ${REGISTRY_PWD}"
                sshCommand remote: server, command: "docker-compose -f docker-compose-calculator.yaml -p boathouse-calculator down"
                
                echo "pulling newest docker images..."
                sshCommand remote: server, command: "docker-compose -f docker-compose-calculator.yaml -p boathouse-calculator pull"
                
                echo "restarting new docker containers..."
                sshCommand remote: server, command: "docker-compose -f docker-compose-calculator.yaml -p boathouse-calculator up -d"
                
                echo "DEV Environment successfully deployed!"
              }
            }
        }

        // 测试环境部署
        stage('CD - K8S TEST') {
            steps {
                timeout(5) {
                    input message: '是否部署到测试环境?', ok: '是', submitter: 'admin'
                }
                sh "sed -i 's/#{REGISTRY_URL}#/${REGISTRY_URL}/g' kube-deploy-test.yaml"
                sh "sed -i 's/#{REGISTRY_NS}#/${REGISTRY_NS}/g' kube-deploy-test.yaml"
                sh "sed -i 's/#{K8S_NAMESPACE}#/${K8S_NAMESPACE_TEST}/g' kube-deploy-test.yaml"
                kubernetesDeploy configs: 'kube-deploy-test.yaml', deleteResource: false, kubeconfigId: 'minikube', secretName: 'regcred', secretNamespace: 'boathouse-test'
            }
        }

        // 测试环境部署
        stage('CD - K8S Prod') {
            steps {
                timeout(5) {
                    input message: '是否部署到生产环境?', ok: '是', submitter: 'admin'
                }
                sh "sed -i 's/#{REGISTRY_URL}#/${REGISTRY_URL}/g' kube-deploy-prod.yaml"
                sh "sed -i 's/#{REGISTRY_NS}#/${REGISTRY_NS}/g' kube-deploy-prod.yaml"
                sh "sed -i 's/#{K8S_NAMESPACE}#/${K8S_NAMESPACE_PROD}/g' kube-deploy-prod.yaml"
                kubernetesDeploy configs: 'kube-deploy-prod.yaml', deleteResource: false, kubeconfigId: 'minikube', secretName: 'regcred', secretNamespace: 'boathouse-test'
            }
        }
    }
}