if [ $# -ne 1 ]
then
    echo "taking one argument, the pattern number"
    exit 1
fi

curl -H "Content-Type: application/json" http://192.168.43.252:3333/play -d "{\"pattern\": $1}"