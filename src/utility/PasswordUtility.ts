import bcrypt, { hash } from 'bcrypt';
import { application, Request } from 'express';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import { AuthPayload } from '../dto';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}


export const GeneratePassword = async (password: string, salt: string) =>{
    return await bcrypt.hash(password, salt);

}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {

    return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

export const GenerateSignature = async (payload: AuthPayload) => {

    return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });

}

export const ValidateSignature = async (req: Request) => {

    // const signature = req.headers.authorization;
    const signature = req.cookies.jwt_token;


    if(signature){
        try {
            const payload = await jwt.verify(signature, APP_SECRET) as AuthPayload;            
            req.user = payload;
            return true;

        } catch (error) {
            return false;
        }
    }
    return false;
}