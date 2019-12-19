#!/bin/bash

USER='pi'
DEVICE='raspberrypi'
CODE_PATH='/home/pi/btlight'

TO="$USER@$DEVICE:$CODE_PATH"
FROM="."

#update the files
scp -r $FROM $TO