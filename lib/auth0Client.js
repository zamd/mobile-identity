
var rp = require('request-promise');
class Auth0Client {

    constructor(options){
        this.options = options;
    }

    getTokenAsync(clientId, clientSecret){

        clientId = clientId || this.options.clientId;
        clientSecret = clientSecret || this.options.clientSecret;

        return new Promise((resolve,reject)=>{
            console.log(`getting token...`);
            rp.post({
                uri: `https://${this.options.domain}/oauth/token`,
                json: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'client_credentials',
                    audience: `https://${this.options.domain}/api/v2/`,
                    scope: 'create:users'
                }
            })
            .then(r=>resolve(r))
            .catch(err=>this.handleError('failed to get token',err,reject));
        });
    }

    handleError(message, err, handler) {
        console.log(err);
        handler(new Error(message));
    }

    startPasswordless(user) {
        return new Promise( (resolve, reject) => {
            console.log(`starting passwordless...`);
            rp.post({
                uri: `https://${this.options.domain}/passwordless/start`,
                json: {
                    connection: 'sms',
                    phone_number: user.phone,
                    send: 'code'
                }
            })
            .then(r=>resolve(r))
            .catch(err=>this.handleError('failed to start passwordless', err,reject));
            });       
    }

    verifyOTP(phone, otp){

        let clientId = this.options.clientId;
        let clientSecret = this.options.clientSecret;

        return new Promise((resolve,reject)=>{
            rp.post({
                uri: `https://${this.options.domain}/oauth/ro`,
                json: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    connection: 'sms',
                    grant_type: 'password',
                    username: phone,
                    password: otp
                }
            })
            .then(r=>resolve(r))
            .catch(err=>this.handleError('failed to get token',err,reject));
        });
    }


    createUserAsync(user){
        return new Promise( (resolve, reject) => {
            this.getTokenAsync()
            .then(res=>{
                console.log(`creating user...`);
                rp.post({
                    uri: `https://${this.options.domain}/api/v2/users`,
                    headers: {
                        'Authorization': `Bearer ${res.access_token}`
                    },
                    json: {
                        connection: this.options.connection,
                        username: user.phone,
                        email: user.email,
                        password: user.password,
                        user_metadata: {
                            phone_verified: false
                        }
                    }
                })
                .then(r=>resolve(r))
                .catch(err=>this.handleError('failed to create user', err,reject));
            })
        });
    }
}


module.exports = Auth0Client;