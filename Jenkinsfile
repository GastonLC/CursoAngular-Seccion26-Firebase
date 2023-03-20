pipeline {
  agent any
  stages {
    stage('install') {
      steps {
        git(branch: 'develop', url: 'https://github.com/GastonLC/CursoAngular-Seccion26-Firebase.git')
        sh 'npm install --legacy-peer-deps'
      }
    }   

    stage('Recibir variable de entorno') {
            steps {
              withCredentials(bindings: [azureServicePrincipal('Azure-Service-Principal')]) {
                sh 'az login --service-principal -u ${AZURE_CLIENT_ID} -p ${AZURE_CLIENT_SECRET} --tenant ${AZURE_TENANT_ID}'                
                script {
                     MY_VARIABLE2 = sh(
                        returnStdout: true, 
                        script: "az webapp config appsettings list --name ${AZURE_NAME} --resource-group ${AZURE_GROUP} --query \"[?name=='MY_VARIABLE'].value\" --output tsv"
                    ).trim()                  
                    MY_VARIABLE = MY_VARIABLE2
                   
               sh "sed -i \"s/MY_VARIABLE: .*/MY_VARIABLE: '${MY_VARIABLE}'/g\" src/environments/environment.prod.ts"

                }
                
              }
            }
    }

    stage('build') {
      steps {
        sh 'npm run build'
        sh "docker build -t ${image_name}:${tag_image} --file dockerfile ."
      }
    }

    stage('pushDocker') {
      steps {
        sh 'docker login -u $DOCKERHUB_CREDENTIALS_USR --password $DOCKERHUB_CREDENTIALS_PSW'
        sh "docker tag ${image_name}:${tag_image} gastonlc/angularapp:${tag_image}"
        sh "docker push gastonlc/angularapp:${tag_image}"
        sh "docker rmi ${image_name}:${tag_image}"
        sh "docker rmi gastonlc/angularapp:${tag_image}"
      }
    }

    stage('Trigger Deploy Job') {
      steps {
        build(job: 'App-Angular-Deploy', parameters: [string(name: 'image_name', value: "gastonlc/angularapp"),
                                                                                                              string(name: 'tag_image', value:"${params.tag_image}")])
      }
    }

  }
  tools {
    nodejs 'NodeJS16'
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('DockerHubLoginGLC')
    AZURE_GROUP = 'SOCIUSRGLAB-RG-MODELODEVOPS-DEV'
    AZURE_NAME = 'sociuswebapptest010'
    MY_VARIABLE = ''
  }
  parameters {
    string(name: 'image_name', defaultValue: 'pagina_img', description: 'Nombre de la imagene docker.')
    string(name: 'tag_image', defaultValue: 'lts2', description: 'Tag de la imagen de la página.')
  }
}
