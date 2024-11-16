#!/bin/bash

# Creating start script
#!/bin/bash

# Start portainer
echo "echo \"Starting portainer...\"
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest

# Cd to home
cd ~

if [ -d \"evo-wm-24\" ]; then
	echo \"Found repo, pulling the latest changes...\"
	cd evo-wm-24
	git pull
else
	echo \"Didn't find repo, cloing it...\"
	git clone https://github.com/matteolutz/evo-wm-24
	cd evo-wm-25
fi

# start
echo \"Starting Evo Server...\"
DISABLE_SERIAL=1 SERIAL_PORT=/dev/ttyACM0 docker compose up --force-recreate --no-deps --build'" > ~/start.sh

# Creating Desktop File
echo "[Desktop Entry]
Name=EvoClient
Comment=Opens up a browser for the evo wm
Type=Application
Exec=chromium-browser http://localhost --window-size=1920,1080 --start-fullscreen --kiosk --incognito --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null  --password-store=basic
Terminal=false" > .config/autostart/EvoClient.desktop
