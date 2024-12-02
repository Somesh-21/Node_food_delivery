
import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { sanitizeFilter } from "mongoose";
import { GeneratePassword, GenerateSalt } from "../utility/PasswordUtility";


export const FindVendor = async (id: string | undefined, email?: string) => {

    if (email){
        return await Vandor.findOne({email});
    }else{
        return await Vandor.findById(id);
    }
}

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, address, pincode, foodType, email, password, ownerName, phone }  = <CreateVandorInput>req.body;

    const existingVandor = await FindVendor('', email);

    if(existingVandor !== null){
        res.json({ "message": "A vandor is exist with this email ID"})
        return; 
    }


    //generate a salt

    const salt =  await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt);

    // encrypt the password using the salt
    

    const createdVandor =  await Vandor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        // lat: 0,
        // lng: 0
    })

    res.json(createdVandor)
    return 

}

export const GetVanndors = async (req: Request, res: Response, next: NextFunction) => {

    const vandors = await Vandor.find();

    if (vandors !== null){
        res.json(vandors)
        return 
    }
    res.json({ message: "No vendors available"})
    return 

}

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {

    const vendorId = req.params.id;

    const vendors = await FindVendor(vendorId);

    if(vendors !== null){
        res.json(vendors)
        return 
    }

    res.json({"message": "Vendors data not available"})
    return


}


export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {

 
    const transactions = await Transaction.find();

    if(transactions){
        return res.status(200).json(transactions)
    }

    return res.json({"message": "Transactions data not available"})

}


export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const transaction = await Transaction.findById(id);

    if(transaction){
        return res.status(200).json(transaction)
    }

     return res.json({"message": "Transaction data not available"})

}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

    const { _id, status } = req.body;

    if(_id){

        const profile = await DeliveryUser.findById(_id);

        if(profile){
            profile.verified = status;
            const result = await profile.save();

            return res.status(200).json(result);
        }
    }

    return res.json({ message: 'Unable to verify Delivery User'});
}


export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUsers = await DeliveryUser.find();

    if(deliveryUsers){
        return res.status(200).json(deliveryUsers);
    }
    
    return res.json({ message: 'Unable to get Delivery Users'});
}