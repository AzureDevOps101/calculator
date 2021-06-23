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
                sh 'docker-compose -f docker-compose-build.yaml -p boathouse-calculator-testrun up'
                sh 'docker-compose -f docker-compose-build.yaml -p boathouse-calculator-testrundown -v --rmi all --remove-orphans'
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

        // dev 环境
        stage('Deploy - DEV') { 
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
    }
}