# Self-contained run script for Student Tracker Backend
# This script downloads portable Apache Maven if it is not already present,
# and starts the Spring Boot backend server.

$BackendDir = "$PSScriptRoot\backend"
$MavenVersion = "3.9.6"
$MavenDir = "$PSScriptRoot\apache-maven-$MavenVersion"
$MavenZip = "$PSScriptRoot\maven.zip"

Write-Host "Checking Java installation..." -ForegroundColor Cyan
& java -version
if ($LASTEXITCODE -ne 0) {
    Write-Error "Java JDK is required but not found in your system path. Please install Java 17+ and try again."
    exit 1
}

# 1. Download Maven if not present
if (-not (Test-Path "$MavenDir\bin\mvn.cmd")) {
    Write-Host "Maven not found. Downloading portable Apache Maven $MavenVersion..." -ForegroundColor Yellow
    $MavenUrl = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
    
    Invoke-WebRequest -Uri $MavenUrl -OutFile $MavenZip
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path $MavenZip -DestinationPath "$PSScriptRoot"
    Remove-Item $MavenZip
    Write-Host "Maven downloaded and ready." -ForegroundColor Green
} else {
    Write-Host "Using existing portable Maven at $MavenDir" -ForegroundColor Green
}

# 2. Run backend
Write-Host "Starting Spring Boot Backend on http://localhost:8080..." -ForegroundColor Cyan
Set-Location $BackendDir
& "$MavenDir\bin\mvn.cmd" spring-boot:run
