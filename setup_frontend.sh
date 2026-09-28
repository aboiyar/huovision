#!/usr/bin/env bash
set -e

sudo cp /tmp/huovision.brickservers.ng.conf /opt/bitnami/apache2/conf/vhosts/huovision.brickservers.ng.conf
sudo cp /tmp/huovision.brickservers.ng-https.conf /opt/bitnami/apache2/conf/vhosts/huovision.brickservers.ng-https.conf
sudo cp /tmp/backend-bridge.js /opt/bitnami/apache2/htdocs/huonvision/frontend/www.huonvision.com/backend-bridge.js

cd /opt/bitnami/apache2/htdocs/huonvision/frontend/www.huonvision.com
for f in *.html; do
  if [ -f "$f" ]; then
    if ! grep -q 'backend-bridge.js' "$f"; then
      sed -i 's|</body>|<script src="/backend-bridge.js"></script></body>|g' "$f"
    fi
  fi
done

sudo apachectl configtest
sudo /opt/bitnami/ctlscript.sh restart apache
echo "✅ Apache frontend setup successfully completed!"
