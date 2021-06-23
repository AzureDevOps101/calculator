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
    }

    stages {

        stage('before-build'){
          steps {
            sh "printenv"
            sh "git log --oneline --graph"
          }
        }

        stage('Unit Tests & Publish Result') {
            steps {
                sh 'docker-compose -f docker-compose-build.yml -p boathouse-calculator-testrun up'
                sh 'docker-compose -f docker-compose-build.yml -p boathouse-calculator-testrundown -v --rmi all --remove-orphans'
            }
            post {
                always{
                    echo "upload test results ..."
                    junit 'out/*.xml'
                }                
            }
        }

        stage('Docker Build & Push') {
            steps {
                echo "Docker Build ... "
                sh 'docker build -f Dockerfile -t ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:latest .'
                echo "Docker Login to docker registry ..."
                sh 'docker login ${REGISTRY_URL} -u ${REGISTRY_USER} -p ${REGISTRY_PWD}'
                echo "Docker Push ..."
                sh 'docker push ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:latest'
            }
            post {
                success{
                    echo "clearn up local images ..."
                    sh 'docker rmi -f ${REGISTRY_URL}/${REGISTRY_NS}/boathouse-calculator:latest'
                }
            }
        }
    }
}