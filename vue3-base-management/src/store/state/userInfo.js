export default {
    state: {
        userInfo: (localStorage.getItem('loginData') && JSON.parse(localStorage.getItem('loginData'))) || {}
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        }
    }
}