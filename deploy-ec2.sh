#!/usr/bin/env bash
# HuonVision EC2 Deployment Script
set -e

echo "📦 Packaging release..."
tar --exclude="node_modules" --exclude=".next" --exclude=".git" -czf /tmp/huonvision-release.tar.gz .

echo "🚀 Uploading to my-ec2..."
scp /tmp/huonvision-release.tar.gz my-ec2:/tmp/huonvision-release.tar.gz
rm /tmp/huonvision-release.tar.gz

echo "🔄 Extracting, building, and restarting on EC2..."
ssh my-ec2 'bash -s' << 'EOF'
set -e
cd /opt/bitnami/apache2/htdocs/huonvision
tar -xzf /tmp/huonvision-release.tar.gz
rm /tmp/huonvision-release.tar.gz
npm run build
pm2 reload huonvision --update-env
echo "✅ Build and restart complete!"
EOF

echo "🎉 Deployment finished! Check https://huovision.brickservers.ng"
