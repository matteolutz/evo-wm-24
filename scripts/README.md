# Raspberry-Pi Installation Guide

## `start.sh`
### Copy `start.sh` script
```bash
cp start.sh /home/pi/start.sh
```

Update `cd /home/matteolutz` in `start.sh´ to the correct home directory.

### Add `start.sh` to `rc.local`
Add the following line to `/etc/rc.local` before `exit 0`:
```bash
sudo bash /home/pi/start.sh
```

## `EvoClient.desktop`
Copy `EvoClient.desktop` to `.config/autostart/`
