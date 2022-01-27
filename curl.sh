#!/bin/bash
SERVER_KEY='AAAASMvQvw0:APA91bFocXzLXve1mwo7Hzyj3dCfrxF5mT6TSy6VzJHFwFb14YdDXj0E3t0ZO09mBKB3aAxEimswqHFjAyv3Iz6qEr8cwewQ5688vtGyrI0htv5GYQ-kXwjFU4vA1OOt0SOv1xqDyhsi'
DEVICE_REG_TOKEN='/topics/all'

CMD=$(cat <<END
curl -X POST -H "Authorization: key=$SERVER_KEY" -H "Content-Type: application/json"
    -d '{
    "data": {
        "notification": {
            "title": "Niagahoster FCM",
            "body": "Ini adalah FCM Message guys!",
            "icon": "https://www.niagahoster.co.id/assets/images/2021/logo/n-logo-blue.svg",
        }
    },
    "to": "$DEVICE_REG_TOKEN"
}' https://fcm.googleapis.com/fcm/send
END
)

echo $CMD && eval $CMD