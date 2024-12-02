import express , { Application } from 'express';
import path from 'path';

import {AdminRoute, DeliveryRoute, VandorRoute} from '../routes'
// import { CustomerRoute } from '../routes/CustomerRoute';
// import { ShoppingRoute } from '../routes/ShoppingRoutes';
 

export default async(app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}))
    
    const imagePath = path.join(__dirname,'../images');
    
    app.use('/images', express.static(imagePath));
    
    app.use('/admin', AdminRoute);
    app.use('/vendor', VandorRoute)
    app.use('/customer', CustomerRoute)
    app.use('/delivery', DeliveryRoute);
    app.use(ShoppingRoute);

    return app;

}

  