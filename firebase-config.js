var pushPopup = localStorage.getItem('popupStatus');
var token = "";
var firebasePopup = document.getElementById('firebase-popup');
var permission = Notification.permission;
var laravelToken;
var urlSendToken;

console.log('permission statusnya apa yaa: ', permission);
checkPopupStatus();

var main = function () {
	return {
		setup: function (params) {
			laravelToken = params.token;
			urlSendToken = params.url;
		}
	}
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
		databaseURL: "https://niaga-c7572-default-rtdb.asia-southeast1.firebasedatabase.app",
		projectId: "niaga-c7572",
		storageBucket: "niaga-c7572.appspot.com",
		messagingSenderId: "312657100557",
		appId: "1:312657100557:web:5d083c263e92581774fa44",
		measurementId: "G-G22NREJJMG"
	};

	firebase.initializeApp(config);

	const messaging = firebase.messaging();

	messaging.requestPermission().then(function () {
			return messaging.getToken();
		})
		.then(function (token) {
			console.log('token is ', token)
			if (fbToken === null) {
				sendToken(token);
			} else {
				if (fbToken !== token) {
					sendToken(token)
				}
			}
		})
		.catch(function (err) {
			document.getElementById("popup-subscribe").style.display = "none";
			console.log("Unable to get permission to notify. ", err);
		});
}

function allowButton() {
	setStatus('allowed');
	getToken();
	document.getElementById("popup-subscribe").style.display = "none";
}

function sendToken(token) {
	var firebaseToken = token;
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax(urlSendToken, {
		data: {
			token: laravelToken,
			fbToken: firebaseToken
		},
		method: "POST",
		success: function (data) {
			console.log('data: ', data);
			localStorage.setItem('fb-token', firebaseToken);
		},
		error: function (err) {
			console.log('error send token', err);
		}
	});
}