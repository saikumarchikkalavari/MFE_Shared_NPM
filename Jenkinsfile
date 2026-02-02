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
                            bat 'npm install'
                        }
                    }
                }
                stage('Shared') {
                    steps {
                        dir('shared') {
                            bat 'npm install'
                        }
                    }
                }
                stage('Remote') {
                    steps {
                        dir('remote') {
                            bat 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            stages {
                stage('Host Tests') {
                    steps {
                        dir('host') {
                            echo 'Running host unit tests...'
                            bat 'npm test -- --ci --coverage --testPathPatterns="__tests__/(Button|DateSelector|DataTable)"'
                        }
                    }
                }
                stage('Shared Tests') {
                    steps {
                        dir('shared') {
                            echo 'Running shared library unit tests...'
                            bat 'npm test -- --ci --coverage --testPathPatterns="__tests__/(Button|DateSelector|DataTable)"'
                        }
                    }
                }
            }
            post {
                always {
                    // Publish test results from host
                    junit(
                        allowEmptyResults: true,
                        testResults: 'host/coverage/junit.xml'
                    )
                    
                    // Publish test results from shared
                    junit(
                        allowEmptyResults: true,
                        testResults: 'shared/coverage/junit.xml'
                    )
                    
                    // Publish coverage reports for host
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'host/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Host Test Coverage',
                        reportTitles: 'Host Coverage Report'
                    ])
                    
                    // Publish coverage reports for shared
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'shared/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Shared Test Coverage',
                        reportTitles: 'Shared Coverage Report'
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
