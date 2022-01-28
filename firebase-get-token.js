class Firebase {
    constructor() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(config);
            this.auth = firebase.auth();
            this.messaging = firebase.messaging();
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                if (registrations.length === 0) {
                    navigator.serviceWorker
                        .register("/firebase-messaging-sw.js")
                        .then((registration) => {
                            this.registration = registration;
                        });
                } else {
                    [this.registration] = registrations;
                }
            });
        }
    }

    async askNotificationPermission() {
        try {
            const token = await this.messaging.getToken({
                serviceWorkerRegistration: this.registration,
            });
            return token;
        } catch (error) {
            console.error("[FIREBASE ERROR]: ", error);
            return null;
        }
    }
}