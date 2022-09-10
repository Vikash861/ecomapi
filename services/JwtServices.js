import JWT_SECRET from '../config';
import jwt from 'jsonwebtoken';
console.log(JWT_SECRET)

class JwtServices{
    static sign(payload,expiry='60s',secret=JWT_SECRET){
        return jwt.sign(palyoad,secret,{expiresIn:expiry})
    }
}