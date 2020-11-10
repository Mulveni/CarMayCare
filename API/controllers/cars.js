const express = require('express');
const router = express.Router();
const utils = require('../utils');

router.get('/', async(req, res) => {

    var carsResult = [];

    try {
        carsResult = await utils.getCars(req.user.id);

        if(carsResult === false){
            res.status(200);
            res.json({message: "No results"})
            return;
        }
        
        else{
            res.status(200);
            res.json(carsResult); 
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(400);
        res.json({message: "Error while fetching the cars"})
        return;
    }
});

router.post('/', async(req, res) => {

   var carsResult = [];

    /*
    Checking if the mandatory fields exist.
    id, userId and dateOfAddition are mandatory too but not user generated
    */

    if('brand' in req.body == false || req.body.brand == "") {
        res.status(400);
        res.json({message: "Missing brand from body"})
        return;
    }
    if('model' in req.body == false || req.body.model == "") {
        res.status(400);
        res.json({message: "Missing model from body"})
        return;
    }
    if('yearModel' in req.body == false || req.body.yearModel == "") {
        res.status(400);
        res.json({message: "Missing yearModel from body"})
        return;
    }
    if('powerType' in req.body == false || req.body.powerType == "") {
        res.status(400);
        res.json({message: "Missing powerType from body"})
        return;
    }
    if('engineSize' in req.body == false || req.body.engineSize == "") {
        res.status(400);
        res.json({message: "Missing engineSize from body"})
        return;
    }
    if('licenseNumber' in req.body == false || req.body.licenseNumber == "") {
        res.status(400);
        res.json({message: "Missing licenseNumber from body"})
        return;
    }

    else{

        const newCar = {

            userId: req.user.id,
            brand: req.body.brand,
            model: req.body.model,
            yearModel: req.body.yearModel,
            powerType: req.body.powerType,
            engineSize: req.body.engineSize,
            licenseNumber: req.body.licenseNumber,
    
        }

        try{
            carsResult = await utils.postCar(newCar);

            if(carsResult === false){
                // No results
                res.status(400);
                res.json({message: "Bad request"})
                return;       
            }
            else{
                res.status(201);
                res.json(carsResult); 
                return;
            }

        } catch (error) {
            console.log(error);
            res.status(400);
            res.json({message: "Error while posting a new car"})
            return;
        }
    }
    
   
});

router.get('/:carId', async(req, res) => {
    var carResult = [];

    try {
        carResult = await utils.getCar(req.user.id, req.params.carId);
       
        if(carResult === false){

            res.status(200);
            res.json({message: "No results with given id"})
            return;
            
        }
        else{
            res.status(200);
            res.json(carResult); 
            return;
        }

    } catch (error) {
        res.status(400);
        res.json({message: "Error fetching a car by id."})
        return;
    }
});

router.put('/:carId', async(req, res) => {

    const modifyCar = {

        brand:  null,
        model: null,
        yearModel: null,
        powerType: null,
        engineSize: null,
        licenseNumber: null,
    }

    for (const key in req.body) {
        modifyCar[key] = req.body[key];
    }

    try {
        carUpdate = await utils.updateCar(req.user.id, req.params.carId, modifyCar);
       
        if(carUpdate === false){

            res.status(404);
            res.json({message: "User has no cars with given id"})
            return;
            
        }
        else{
            res.status(201);
            res.json(carUpdate); 
            return;
        }

    } catch (error) {
        res.status(400);
        res.json({message: "Error updating info."})
        return;
    }
});

router.delete('/:carId', async(req, res) => {
    var carDelete = [];

    try {

        carDelete = await utils.deleteCar(req.user.id, req.params.carId);

        if(carDelete.affectedRows === 0){

            res.status(400);
            res.json({message: "Cannot delete the given car"})
            return;
            
        }
        else{
            res.status(201);
            res.json({message: "Car has been deleted"})
            return;
        }

    } catch (error) {
        res.status(400);
        res.json({message: "Error while attempting to delete the car"})
        return;
    }
});

module.exports = router;