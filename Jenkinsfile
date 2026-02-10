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
        timeout(time: 60, unit: 'MINUTES')
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
        
        stage('Install Dependencies - Shared') {
            steps {
                dir('shared') {
                    echo 'Installing Shared dependencies...'
                    bat 'npm install'
                }
            }
        }
        
        stage('Build - Shared') {
            steps {
                dir('shared') {
                    echo 'Building Shared library (required for Host and Remote)...'
                    bat 'npm run build'
                }
            }
        }
        
        stage('Install Dependencies - Host') {
            steps {
                dir('host') {
                    echo 'Installing Host dependencies...'
                    bat 'npm install'
                }
            }
        }
        
        stage('Install Dependencies - Remote') {
            steps {
                dir('remote') {
                    echo 'Installing Remote dependencies...'
                    bat 'npm install'
                }
            }
        }
        
        stage('Build - Host') {
            steps {
                dir('host') {
                    echo 'Building Host application...'
                    bat 'npm run build'
                }
            }
        }
        
        stage('Build - Remote') {
            steps {
                dir('remote') {
                    echo 'Building Remote application...'
                    bat 'npm run build'
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
        
        stage('Run Tests - Host') {
            steps {
                dir('host') {
                    echo 'Running Host unit tests...'
                    bat 'npm test -- --ci --coverage --coverageDirectory=coverage'
                }
            }
        }
        
        stage('Run Tests - Shared') {
            steps {
                dir('shared') {
                    echo 'Running Shared library tests (AGGrid, MaterialUI, Button, DateSelector, DataTable)...'
                    bat 'npm test -- --ci --coverage --coverageDirectory=coverage'
                }
            }
        }
        
        stage('Run Tests - Remote') {
            steps {
                dir('remote') {
                    echo 'Running Remote application tests (AGGrid, MaterialUI, Dashboard)...'
                    bat 'npm test -- --ci --coverage --coverageDirectory=coverage'
                }
            }
            post {
                always {
                    // Publish test results from Host
                    junit(
                        allowEmptyResults: true,
                        testResults: 'host/coverage/junit.xml'
                    )
                    
                    // Publish test results from Shared
                    junit(
                        allowEmptyResults: true,
                        testResults: 'shared/coverage/junit.xml'
                    )
                    
                    // Publish test results from Remote
                    junit(
                        allowEmptyResults: true,
                        testResults: 'remote/coverage/junit.xml'
                    )
                    
                    // Publish coverage reports for Host
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'host/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Host Test Coverage',
                        reportTitles: 'Host Coverage Report'
                    ])
                    
                    // Publish coverage reports for Shared
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'shared/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Shared Test Coverage',
                        reportTitles: 'Shared Coverage Report'
                    ])
                    
                    // Publish coverage reports for Remote
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'remote/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Remote Test Coverage',
                        reportTitles: 'Remote Coverage Report'
                    ])
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
