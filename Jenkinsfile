pipeline {
  agent any
  stages {
    stage('install') {
      steps {
        git(branch: 'develop', url: 'https://github.com/GastonLC/CursoAngular-Seccion26-Firebase.git')
        sh 'npm install --legacy-peer-deps'
      }
    }

    stage('Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password dckr_pat_Y0sjy4-PK8KTlW-chb53QTdeI9Q'
      }
    }

    stage('Recibir variable de entorno') {
            steps {
              withCredentials(bindings: [azureServicePrincipal('Azure-Service-Principal')]) {
                sh 'az login --service-principal -u ${AZURE_CLIENT_ID} -p ${AZURE_CLIENT_SECRET} --tenant ${AZURE_TENANT_ID}'                
                script {
                    def MY_VARIABLE2 = sh(
                        returnStdout: true, 
                        script: "az webapp config appsettings list --name ${AZURE_NAME} --resource-group ${AZURE_GROUP} --query \"[?name=='MY_VARIABLE'].value\" --output tsv"
                    ).trim()                  
                }
                
                sh 'sed -i "s/MY_VARIABLE: .*/MY_VARIABLE: \'${MY_VARIABLE2}\'/g" src/environments/environment.prod.ts'
              }
            }
        }

    // stage('Modifica variable de entorno') {
    //   steps {
    //     sh 'sed -i "s/MY_VARIABLE: .*/MY_VARIABLE: \'${MY_VARIABLE}\'/g" src/environments/environment.prod.ts'
    //   }
    // }

    stage('build') {
      steps {
        sh 'npm run build'
        sh "docker build -t ${image_name}:${tag_image} --file dockerfile ."
      }
    }

    stage('pushDocker') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password dckr_pat_Y0sjy4-PK8KTlW-chb53QTdeI9Q'
        sh "docker tag ${image_name}:${tag_image} gastonlc/angularapp:${tag_image}"
        sh "docker push gastonlc/angularapp:${tag_image}"
        sh "docker rmi ${image_name}:${tag_image}"
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
    MY_VARIABLE = 'DESDEJENKINS'
  }
  parameters {
    string(name: 'container_name', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'image_name', defaultValue: 'pagina_img', description: 'Nombre de la imagene docker.')
    string(name: 'tag_image', defaultValue: 'lts2', description: 'Tag de la imagen de la página.')
    string(name: 'container_port', defaultValue: '80', description: 'Puerto que usa el contenedor')
  }
}