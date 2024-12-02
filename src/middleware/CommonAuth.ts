import { Request, NextFunction, Response } from 'express'
import {AuthPayload } from '../dto'
import { ValidateSignature } from '../utility';

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const signature = await ValidateSignature(req);
    if(signature){
        next()
        return 
    }else{

        // somesh redirect to login page
        res.json({message: "User Not authorised"});
        return 
    }
}