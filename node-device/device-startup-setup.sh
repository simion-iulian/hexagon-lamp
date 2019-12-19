#!/bin/bash

#cd /home/pi/btlight
sudo cp lampService /etc/init.d/lampService
sudo chmod 755 /etc/init.d/lampService
sudo update-rc.d lampService defaults
