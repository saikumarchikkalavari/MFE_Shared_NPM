pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // Configure this in Jenkins Global Tool Configuration
    }
    
    environment {
        CI = 'true'
        NODE_ENV = 'test'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Host') {
                    steps {
                        dir('host') {
                            bat 'npm ci'
                        }
                    }
                }
                stage('Shared') {
                    steps {
                        dir('shared') {
                            bat 'npm ci'
                        }
                    }
                }
                stage('Remote') {
                    steps {
                        dir('remote') {
                            bat 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('host') {
                    echo 'Running unit tests...'
                    bat 'npm run test:ci:report'
                }
            }
            post {
                always {
                    // Publish test results
                    junit(
                        allowEmptyResults: true,
                        testResults: 'host/coverage/junit.xml'
                    )
                    
                    // Publish coverage reports
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'host/coverage',
                        reportFiles: 'index.html',
                        reportName: 'Test Coverage Report',
                        reportTitles: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Host') {
                    steps {
                        dir('host') {
                            bat 'npm run build'
                        }
                    }
                }
                stage('Shared') {
                    steps {
                        dir('shared') {
                            bat 'npm run build'
                        }
                    }
                }
                stage('Remote') {
                    steps {
                        dir('remote') {
                            bat 'npm run build'
                        }
                    }
                }
            }
            post {
                success {
                    archiveArtifacts(
                        artifacts: 'host/dist/**/*,shared/dist/**/*,remote/dist/**/*',
                        fingerprint: true,
                        allowEmptyArchive: true
                    )
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed.'
            cleanWs(
                deleteDirs: true,
                patterns: [
                    [pattern: 'node_modules/**', type: 'INCLUDE'],
                    [pattern: '.npm/**', type: 'INCLUDE']
                ]
            )
        }
        success {
            echo 'Build succeeded!'
            // Add notifications (email, Slack, etc.)
        }
        failure {
            echo 'Build failed!'
            // Add failure notifications
        }
        unstable {
            echo 'Build is unstable!'
        }
    }
}
