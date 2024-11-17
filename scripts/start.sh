#!/bin/bash

echo "[EVO-PIT] Hello!"

echo "[EVO-PIT] Starting portainer..."
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest

# Cd to home
cd ~

if [ -d "evo-wm-24" ]; then
	echo "[EVO-PIT] Found repo, pulling the latest changes..."
	cd evo-wm-24
	git pull
else
	echo "[EVO-PIT] Didn't find repo, cloing it..."
	git clone https://github.com/matteolutz/evo-wm-24
	cd evo-wm-25
fi

# start
echo "[EVO-PIT] Starting Evo Server..."
DISABLE_SERIAL=1 SERIAL_PORT=/dev/ttyACM0 docker compose up --force-recreate --no-deps --build

echo "[EVO-PIT] Done! Checkout portainer at ::9443."
