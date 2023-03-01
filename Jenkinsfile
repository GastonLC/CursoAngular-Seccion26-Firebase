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

    stage('pushDocker') {
      steps {
        sh 'docker push gastonlc/angularapp:lts'
      }
    }

    stage('deploy') {
      steps {
        sh "docker rm -f ${container_name}" // Elimina el contenedor si existe
        sh "docker run -d -p ${container_port}:80 --name ${container_name} ${image_name}:${tag_image}"
      }
    }

  }
  tools {
    nodejs 'NodeJS16'
  }
  parameters {
    string(name: 'container_name', defaultValue: 'pagina_web', description: 'Nombre del contenedor de docker.')
    string(name: 'image_name', defaultValue: 'pagina_img', description: 'Nombre de la imagene docker.')
    string(name: 'tag_image', defaultValue: 'lts', description: 'Tag de la imagen de la página.')
    string(name: 'container_port', defaultValue: '80', description: 'Puerto que usa el contenedor')
  }
}