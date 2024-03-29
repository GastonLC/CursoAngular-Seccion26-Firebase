pipeline {
  agent any
  stages {
    stage('install') {
      steps {
        sh 'npm install --legacy-peer-deps'
      }
    }

    stage('Chequeo de la rama') {
      steps {
          script {
                  AZURE_GROUP1 = "GOTY_RG_$BRANCH_NAME"
                  AZURE_GROUP = "${env[AZURE_GROUP1]}"
                  sh "echo ${AZURE_GROUP}"
                  
                  AZURE_NAME1 = "GOTY_NAME_$BRANCH_NAME"
                  AZURE_NAME = "${env[AZURE_NAME1]}"
                  
                  azureServicePrincipalValue1 = "ASP_VALUE_$BRANCH_NAME"
                  azureServicePrincipalValue =  "${env[azureServicePrincipalValue1]}"
                  
                  DEPLOY_JOB = "Goty-Deploy/$BRANCH_NAME"
          }
      }
    }

    stage('Recibir variable de entorno') {
      steps {
        withCredentials(bindings: [azureServicePrincipal("${azureServicePrincipalValue}")]) {
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
        build(job: "${DEPLOY_JOB}", parameters: [string(name: 'image_name', value: "gastonlc/angularapp"),
                                                                                              string(name: 'tag_image', value:"${params.tag_image}")])
      }
    }  

  }
  tools {
    nodejs 'NodeJS16'
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('DockerHubLoginGLC')
    AZURE_GROUP = ''
    AZURE_NAME = ''
    azureServicePrincipalValue= ''
    DEPLOY_JOB = ''
    MY_VARIABLE = ''
  }
  parameters {
    string(name: 'image_name', defaultValue: 'pagina_img', description: 'Nombre de la imagene docker.')
    string(name: 'tag_image', defaultValue: 'lts2', description: 'Tag de la imagen de la página.')
  }
}
