const { util } = require('chai');
const express = require('express');
const { getService, deleteService, editService } = require('../utils');
const utils = require('../utils');
const models = require('../models');
const { compare } = require('bcryptjs');
const router = express.Router();

router.get('/:carId', async (req, res) => {


    var serviceList = [];
    var servModel = [];

    try {
        serviceList = await utils.getCarServices(req.params.carId);

        if (serviceList === false){

            res.status(400);
            res.json({message: 'No services for car with given ID'});
            return;


        } else {    

            for (var i = 0; i < serviceList.length; i++){
                servModel[i] = models.serviceModel(serviceList[i]);
            }

            console.log(servModel);
            res.status(200).send(servModel);
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(404);
        res.json({message: "NOT FOUND"});
        return;
    }
});

router.post('/:carId', async (req, res) => {

    servicePosting = [];

    if ('mileAge' in req.body == false || req.body.mileAge == ""){
        res.status(400);
        res.json({message: "Mileage is missing, please enter the mileage"});
        return;

    } else {

        const service = 

        {
            idCars: req.params.carId,
            description: req.body.description,
            mileAge: req.body.mileAge,

            motorOilChange: {
              done: req.body.motorOilChange.done,
              longLifeOilUsed: req.body.motorOilChange.longLifeOilUsed
            },

            airConditioningService: {
              done: req.body.airConditioningService.done,
              dryer: req.body.airConditioningService.dryer
            },

            additionalServices: {
              sparkPlugReplacement: req.body.additionalServices.sparkPlugReplacement,
              airFilterReplacement: req.body.additionalServices.airFilterReplacement,
              cleanAirReplacement: req.body.additionalServices.cleanAirReplacement,
              fuelFilterReplacement: req.body.additionalServices.fuelFilterReplacement,
              brakeFluidReplacement: req.body.additionalServices.brakeFluidReplacement,
              gearBoxOilReplacement: req.body.additionalServices.gearBoxOilReplacement,
              powerSteeringOilReplacement: req.body.additionalServices.gearBoxOilReplacement,
              timingBeltReplacement: req.body.additionalServices.timingBeltReplacement,
              waterPumpReplacement: req.body.additionalServices.waterPumpReplacement,
              dieselParticulateFilterReplacement: req.body.additionalServices.dieselParticulateFilterReplacement
            },
            additionalInformation: req.body.additionalInformation
          };

          console.log(service);

        try {
            servicePosting = await utils.addNewService(service, req.user.id, req.params.carId);

            res.sendStatus(201);

        } catch (error) {
            console.log(error);
            res.status(400);
            res.json({message: "Failed to create service, missing obligatory information or car you tried to create service to doesn't exist!"});
        }
    }

});

router.get('/:carId/:serviceId', async (req, res) => {

    serviceList = [];
    servModel = [];

    try {
        serviceList = await getService(req.params.carId, req.params.serviceId);

        if (serviceList === false) {

            res.status(400);
            res.json({message: "No service found with the given id"});
        } else {

            for (var i = 0; i < serviceList.length; i++){
                servModel[i] = models.serviceModel(serviceList[i]);
            }

            res.json(servModel);
            res.status(200);
        }


    } catch (error) {
        console.log(error);
        res.status(404);
    }
});

router.put('/:carId/:serviceId', async (req, res) => {


    //Comparative array created to use as the default values for the service desired to be edited
    let comaparative = [];
    comaparative = await utils.getService(req.params.carId, req.params.serviceId);

    console.log(comaparative[0].description);

    let editable = {

        description: null,
        mileAge: null,

        motorOilChange: {
            done: false,
            longLifeOilUsed: false
        },

        airConditioningService: {
            done: false,
            dryer: false
        },

        additionalServices: {
            sparkPlugReplacement: false,
            airFilterReplacement: false,
            cleanAirReplacement: false, 
            fuelFilterReplacement: false, 
            brakeFluidReplacement: false,
            gearBoxOilReplacement: false, 
            powerSteeringOilReplacement: false, 
            timingBeltReplacement: false, 
            waterPumpReplacement: false, 
            dieselParticulateFilterReplacement: false,
        },

        additionalInformation: null
    };

    //Looping the key values to the inner elements (motorOilChange)
    for (const key in req.body.motorOilChange) {
        editable.motorOilChange[key] = req.body.motorOilChange[key];
    }
    console.log(editable);

    //Looping the key values to inner elements (airConditioningService)
    for (const key in req.body.airConditioningService) {
        editable.airConditioningService[key] = req.body.airConditioningService[key];
    }

    //Looping the key values to inner elements (additionalSerives)
    for (const key in req.body.additionalServices){
        editable.additionalServices[key] = req.body.additionalServices[key];
    }

    //Looping the rest of the elements to the outer elements
    for (const key in req.body){
        editable[key] = req.body[key];
    }

    //Checking the error cases for the request body sent with the PUT
    if(req.body.description === undefined || req.body.description == null || req.body.description == ""){
        editable.description = comaparative[0].description;
    }

    if(req.body.mileAge === undefined || req.body.mileAge == null || req.body.mileAge == ""){
        editable.mileAge = comaparative[0].mileAge;
    }

    
    if( req.body.motorOilChange.done === undefined || typeof req.body.motorOilChange.done === "string"){
        editable.motorOilChange.done = comaparative[0].motorOilChangeDone;
    }

    if( req.body.motorOilChange.longLifeOilUsed === undefined || typeof req.body.motorOilChange.longLifeOilUsed === "string"){
        editable.motorOilChange.longLifeOilUsed = comaparative[0].longLifeOilUsedDone;
    }

    if( req.body.airConditioningService.done === undefined || typeof req.body.airConditioningService.done === "string"){
        editable.airConditioningService.done = comaparative[0].airConditioningServiceDone;
    }

    if( req.body.airConditioningService.dryer === undefined || typeof req.body.airConditioningService.dryer === "string"){
        editable.airConditioningService.dryer = comaparative[0].airConditioningServiceDryer;
    }

    if( req.body.additionalServices.sparkPlugReplacement === undefined || typeof req.body.additionalServices.sparkPlugReplacement === "string"){
        editable.additionalServices.sparkPlugReplacement = comaparative[0].sparkPlugReplacement;
    }

    if( req.body.additionalServices.airFilterReplacement === undefined || typeof req.body.additionalServices.airFilterReplacement === "string"){
        editable.additionalServices.airFilterReplacement = comaparative[0].airFilterReplacement;
    }

    if( req.body.additionalServices.cleanAirReplacement === undefined || typeof req.body.additionalServices.cleanAirReplacement === "string"){
        editable.additionalServices.cleanAirReplacement = comaparative[0].cleanAirReplacement;
    }

    if( req.body.additionalServices.fuelFilterReplacement === undefined || typeof req.body.additionalServices.fuelFilterReplacement === "string"){
        editable.additionalServices.fuelFilterReplacement = comaparative[0].fuelFilterReplacement;
    }

    if( req.body.additionalServices.brakeFluidReplacement === undefined || typeof req.body.additionalServices.brakeFluidReplacement === "string"){
        editable.additionalServices.brakeFluidReplacement = comaparative[0].brakeFluidReplacement;
    }

    if( req.body.additionalServices.gearBoxOilReplacement === undefined || typeof req.body.additionalServices.gearBoxOilReplacement === "string"){
        editable.additionalServices.gearBoxOilReplacement = comaparative[0].gearBoxOilReplacement;
    }

    if( req.body.additionalServices.powerSteeringOilReplacement === undefined || typeof req.body.additionalServices.powerSteeringOilReplacement === "string"){
        editable.additionalServices.powerSteeringOilReplacement = comaparative[0].powerSteeringOilReplacement;
    }

    if( req.body.additionalServices.timingBeltReplacement === undefined || typeof req.body.additionalServices.timingBeltReplacement === "string"){
        editable.additionalServices.timingBeltReplacement = comaparative[0].timingBeltReplacement;
    }

    if( req.body.additionalServices.waterPumpReplacement=== undefined || typeof req.body.additionalServices.waterPumpReplacement === "string"){
        editable.additionalServices.waterPumpReplacement = comaparative[0].waterPumpReplacement;
    }

    if( req.body.additionalServices.dieselParticulateFilterReplacement === undefined || typeof req.body.additionalServices.dieselParticulateFilterReplacement === "string"){
        editable.additionalServices.dieselParticulateFilterReplacement = comaparative[0].dieselParticulateFilterReplacement;
    }

    if(req.body.additionalInformation === undefined || req.body.additionalInformation == null || req.body.additionalInformation == ""){
        editable.additionalInformation = comaparative[0].additionalInformation;
    }


    let serviceEdit = await utils.editService(req.user.id, req.params.carId, req.params.serviceId, editable);

    if (serviceEdit !== 0){

        res.status(200);
        res.json(serviceEdit);
   
    } else {

        res.status(400);
        res.json({message: "Editing the service information failed!"});
    }
});

router.delete('/:carId/:serviceId', async (req, res) => {

    var deleteService = [];

    try {
        deleteService = await utils.deleteService(req.params.carId, req.params.serviceId);

        if (deleteService.affectedRows === 0){
            res.status(400);
            res.json({message: "Failed to delete!"});
        } else {
            res.status(201);
            res.json({message: "Succesfully deleted the selected service!"});
        }

    } catch (error) {
        console.log(error);
        res.status(400);
    }

});

module.exports = router;