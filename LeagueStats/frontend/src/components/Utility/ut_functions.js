

export function loggedIn() {
        if (!localStorage.getItem('access_token') || !localStorage.getItem('refresh_token')) {
            return false
        } else {
            return true
        }
    }