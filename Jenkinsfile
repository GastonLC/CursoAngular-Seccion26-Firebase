pipeline {
  agent any
  stages {
    stage('test-az') {
      steps {
        sh 'az version'
      }
    }

    stage('install') {
      steps {
        git(branch: 'main', url: 'https://github.com/GastonLC/CursoAngular-Seccion26-Firebase.git')
        sh 'npm install --legacy-peer-deps'
      }
    }

    stage('build') {
      steps {
        sh 'npm run build'
        sh "docker build -t ${image_name}:${tag_image} --file dockerfile ."
      }
    }

    stage('Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }

    stage('pushDocker') {
      steps {
        sh "docker tag ${image_name}:${tag_image} gastonlc/angularapp:${tag_image}"
        sh "docker push gastonlc/angularapp:${tag_image}"
      }
    }

    stage('Deploy to Azure App Service') {
      steps {
        withCredentials(bindings: [azureServicePrincipal('Azure-Service-Principal')]) {
          sh 'curl -sL https://aka.ms/InstallAzureCLIDeb'
          sh 'az login --service-principal -u ${AZURE_CLIENT_ID} -p ${AZURE_CLIENT_SECRET} --tenant ${AZURE_TENANT_ID}'
          sh "az webapp create -g SOCIUSRGLAB-RG-MODELODEVOPS-DEV -p Plan-SociusRGLABRGModeloDevOpsDockerProd -n sociuswebapptest010 -i gastonlc/angularapp:${tag_image}"
        }

      }
    }

  }
  tools {
    nodejs 'NodeJS16'
  }
  environment {
    DOCKERHUB_CREDENTIALS = credentials('DockerHubLoginGLC')
  }
  parameters {
    string(name: 'container_name', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'image_name', defaultValue: 'pagina_img', description: 'Nombre de la imagene docker.')
    string(name: 'tag_image', defaultValue: 'lts', description: 'Tag de la imagen de la página.')
    string(name: 'container_port', defaultValue: '80', description: 'Puerto que usa el contenedor')
  }
}