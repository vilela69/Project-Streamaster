import {EventEmitter} from 'events'
import {omit} from 'lodash'
const emitter = new EventEmitter();
emitter.setMaxListeners(20)

const baseUrl = '/api/'
// const baseUrl = 'http://10.92.44.177:8080/'

var user = { 
    email : null,
    userName : null,
    image : null
}

export default window.auth = {
    login : async (email, password) => {
        console.log('Logging in with', email, password)
        // var fd = new FormData();
        // fd.append('email', email)
        // fd.append('password', password)
        let res = await fetch('/api/login', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body : JSON.stringify({
                email: email,
                password: password
            })
        })

        let data = await res.json() 
        console.log(data)

        if (data.status == 200) {           
            delete data['password']
            console.log( '[Auth] Auth Successful', data)
            window.localStorage.setItem('user', JSON.stringify(data))
            return data
        } else {
            console.log('[Auth] Auth failed,error ' + data.status)
            return false
        }
    },

    subscribe : (callback) => {
        emitter.addListener('auth', callback)
    },

    unsubscribe : () => {
        emitter.removeAllListeners('auth')
    },

    getSavedUser : () => {
        let localStorageUser = localStorage.getItem('user')
        if(localStorageUser){
            user = JSON.parse(localStorageUser)
            console.log('[Auth] Retreived user from last session',user)
            return user
        } else {
            return false
        }
    },

    getUser : () => {
        return user
    },

    register : async (email,username,password,imageBase64) => {
        // let fd = new FormData();
        // fd.append('email',email)
        // fd.append('username',username)
        // fd.append('password',password)
        // fd.append('file',imageBase64);
        console.log('Registering with',email,password)
        try {
            let res = await fetch('/api/user', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    username: username,
                    image: null
                })
            })
            let data = await res.json()
            console.log('ALO ', data)
            if (data.status == 200) {
                user = omit(data, ['status'])
                localStorage.setItem('user', JSON.stringify(data))
                return user
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
        }
        
    },

    logout : () => {
        localStorage.removeItem('user')
        window.location.reload()
    }


}