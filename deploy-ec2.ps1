<#
.SYNOPSIS
Deploy HuonVision codebase to my-ec2 server
#>

$ErrorActionPreference = "Stop"

Write-Host "📦 Creating release archive..." -ForegroundColor Cyan
if (Test-Path "huonvision-release.tar.gz") {
    Remove-Item "huonvision-release.tar.gz" -Force
}

tar.exe --exclude="node_modules" --exclude=".next" --exclude=".git" -czf huonvision-release.tar.gz .

Write-Host "🚀 Uploading release to my-ec2..." -ForegroundColor Cyan
scp huonvision-release.tar.gz my-ec2:/tmp/huonvision-release.tar.gz

Write-Host "🔄 Extracting and building on remote server..." -ForegroundColor Cyan
ssh my-ec2 @"
set -e
cd /opt/bitnami/apache2/htdocs/huonvision
tar -xzf /tmp/huonvision-release.tar.gz
rm /tmp/huonvision-release.tar.gz
npm run build
pm2 reload huonvision --update-env
echo '✅ Deployment complete! HuonVision is live.'
"@

Remove-Item "huonvision-release.tar.gz" -Force
Write-Host "🎉 Successfully deployed to https://huovision.brickservers.ng!" -ForegroundColor Green
