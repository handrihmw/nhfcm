importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js');

    firebase.initializeApp({
		'apiKey': "AIzaSyCWXOCqEm07FK95TxsYtn4fez9aIjmyKxs",
		'authDomain': "niaga-c7572.firebaseapp.com",
		'databaseURL': "https://niaga-c7572-default-rtdb.asia-southeast1.firebasedatabase.app",
		'projectId': "niaga-c7572",
		'storageBucket': "niaga-c7572.appspot.com",
		'messagingSenderId': "312657100557",
		'appId': "1:312657100557:web:5d083c263e92581774fa44",
		'measurementId': "G-G22NREJJMG"
    });

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	console.log('payload: ', payload)

	const notificationTitle = payload.data.title;
	const notificationOptions = {
		click_action: payload.notification.action_click,
		body: payload.notification.body,
		icon: payload.notification.icon
	};

	return self.registration.showNotification(notificationTitle, notificationOptions);
});