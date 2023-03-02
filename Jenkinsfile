pipeline {
  agent any
  stages {
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

    stage('DeployAzure') {
      steps {
        sh '"az login --service-principal -u 1c6914e6-5a2b-4c76-b99a-68614314529f -p zd.8Q~Q_OV6KR-BOcHF~SGTlmmpFW58fvcyKXa2Y --tenant       9297550c-fa07-4acd-ade0-49b8c437c2df"'
        sh "az webapp deployment source config-zip --resource-group SOCIUSRGLAB-RG-MODELODEVOPS-DEV --name sociuswebapptest010 --src gastonlc/angularapp:${tag_image}"
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