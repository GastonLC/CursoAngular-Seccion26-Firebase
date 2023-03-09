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
    string(name: 'tag_image', defaultValue: 'lts2', description: 'Tag de la imagen de la página.')
    string(name: 'container_port', defaultValue: '80', description: 'Puerto que usa el contenedor')
  }
}