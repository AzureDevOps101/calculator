pipeline {
    agent{
        label 'vm-slave'
    }

    stages {

        stage('before-build'){
          steps {
            sh "printenv"
            sh "git log --oneline --graph"
          }
        }

        stage('Npm Test in Docker') {
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

        stage('Docker Build') {
            steps {
                sh 'docker build -f Dockerfile -t boathouse-calculator:latest .'
            }
            post {
                success{
                    echo "clearn up local images ..."
                    sh 'docker rmi -f boathouse-calculator:latest'
                }
            }
        }
    }
}