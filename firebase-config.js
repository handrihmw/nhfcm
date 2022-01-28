var pushPopup = localStorage.getItem('popupStatus');
var token = "";
var firebasePopup = document.getElementById('firebase-popup');
var permission = Notification.permission;

console.log('status permission: ', permission);
checkPopupStatus();

function allowButton() {
	setStatus('allowed');
	getToken();
	document.getElementById("popup-subscribe").style.display = "none";
}

function cancelButton() {
	popupAllowed = false;
	setStatus("dismissed");
	removeElement("popup-subscribe");
}

function checkPopupStatus() {
	var date1 = new Date();
	var date2;
	var popupStatus = localStorage.getItem('popupStatus');

	if (popupStatus !== null) {
		var jsonPopupStatus = JSON.parse(popupStatus);
		statusDate = jsonPopupStatus.timestamp;
		if (jsonPopupStatus.status === 'dismissed') {
			date2 = new Date(jsonPopupStatus.timestamp);
			var difference = date1.getTime() - date2.getTime();

			var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
			difference -= daysDifference * 1000 * 60 * 60 * 24;

			console.log('difference = ' + daysDifference);

			if (daysDifference >= 3) {
				showPopup();
			}
		}
	} else {
		switch (permission) {
			case "default":
				if (pushPopup === null) {
					showPopup();
				}
				break;
			case "granted":
				getToken();
				break;
			case "denied":

				break;
		}
	}
}

function setStatus(status) {
	var timestamp = new Date().getTime();
	var popupStatus = {
		status: status,
		timestamp: timestamp
	}
	localStorage.setItem('popupStatus', JSON.stringify(popupStatus));
}

function showPopup() {
	firebasePopup.innerHTML = `<div id="popup-subscribe" class="card nh-push__card">
			<div class="card-body">
				<div class="nh-push__card--wrapper ">
					<img src="/logo.webp" class="nh-push__image" loading="lazy" />
					<p class="nh-push__title">Terima notifikasi untuk mendapatkan informasi terkait akun, status order, status server, promo dan informasi lainnya dari Niagahoster.</p>
				</div>
				<div class="nh-push__button--wrapper">
					<button class="btn nh-push__button nh-push__button--green" onClick="allowButton()">Konfirmasi</button>
					<button class="btn nh-push__button nh-push__button--red" onClick="cancelButton()">Tidak</button>
				</div>
			</div>
        </div>`;
}

function removeElement(id) {
	var element = document.getElementById(id);
	element.parentNode.removeChild(element);
}

function getToken() {
	fbToken = localStorage.getItem('fb-token');
	var config = {
		apiKey: "AIzaSyCWXOCqEm07FK95TxsYtn4fez9aIjmyKxs",
		authDomain: "niaga-c7572.firebaseapp.com",
		projectId: "niaga-c7572",
		storageBucket: "niaga-c7572.appspot.com",
		messagingSenderId: "312657100557",
		appId: "1:312657100557:web:5d083c263e92581774fa44",
		measurementId: "G-G22NREJJMG"
	};

	firebase.initializeApp(config);

	const messaging = firebase.messaging();

	messaging.requestPermission()
	.then(function () {
		console.log("Izin pemberitahuan diberikan.");

		return messaging.getToken()
	})
	.then(function(token) {
		$('#tokenarea').html(token);
	})
	.catch(function (err) {
		console.log("Tidak dapat memperoleh izin pemberitahuan", err);
	});

	// messaging.requestPermission()
	// 	.then(function () {
	// 		console.log('Notification permission granted.');

	// 		messaging.getToken()
	// 			.then(function (currentToken) {
	// 				if (currentToken) {
	// 					console.log(currentToken);
	// 				} else {
	// 					console.log('No Instance ID token available. Request permission to generate one.');
	// 				}
	// 			})
	// 			.catch(function (err) {
	// 				console.log('An error occurred while retrieving token. ', err);
	// 			});
	// 	})
	// 	.catch(function (err) {
	// 		console.log('Unable to get permission to notify. ', err);
	// 	});

	// messaging.getToken()
	// 	.then(function (currentToken) {
	// 		if (currentToken) {
	// 			console.log(currentToken);
	// 			$('#tokenarea').html(currentToken);
	// 		} else {
	// 			console.log('No Instance ID token available. Request permission to generate one.');
	// 			updateUIForPushPermissionRequired();

	// 		}
	// 	})
	// 	.catch(function (err) {
	// 		console.log('An error occurred while retrieving token. ', err);
	// 	});

	// messaging.onTokenRefresh(function () {
	// 	messaging.getToken()
	// 		.then(function (refreshedToken) {
	// 			console.log('Token refreshed.');

	// 			$('#tokenarea').html(refreshedToken);

	// 			console.log(refreshedToken);
	// 		})
	// 		.catch(function (err) {
	// 			console.log('Unable to retrieve refreshed token ', err);
	// 		});
	// })

	// messaging.onMessage(function (payload) {
	// 	console.log("Message received. ", payload);
	// });
}