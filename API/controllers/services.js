const { util } = require('chai');
const express = require('express');
const { getService, deleteService } = require('../utils');
const utils = require('../utils');
const router = express.Router();

router.get('/:carId', async (req, res) => {

    var serviceList = [];

    try {
        serviceList = await utils.getCarServices(req.params.carId);

        if (serviceList === false){

            res.status(400);
            res.json({message: 'No services for car with given ID'});
            return;


        } else {
            res.json(serviceList);
            res.status(200);
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

    if ('mileAge' in req.body == false || req.body.mileAge == ""){
        res.status(400);
        res.json({message: "Mileage is missing, please enter the mileage"});
        return;

    } else {

        const service = 

        {
            idCars : req.params.carId,
            description : req.body.description,
            mileAge : req.body.mileAge,
            motorOilChangeDone : req.body.motorOilChangeDone,
            motorOilChangelongLifeOilUsed : req.body.motorOilChangelongLifeOilUsed,
            airConditioningServiceDone : req.body.airConditioningServiceDone,
            airConditioningServiceDryer : req.body.airConditioningServiceDryer,
            sparkPlugReplacement : req.body.sparkPlugReplacement,
            airFilterReplacement : req.body.airFilterReplacement,
            cleanAirReplacement : req.body.cleanAirReplacement,
            fuelFilterReplacement : req.body.fuelFilterReplacement,
            brakeFluidReplacement : req.body.brakeFluidReplacement,
            gearBoxOilReplacement : req.body.gearBoxOilReplacement,
            powerSteeringOilReplacement : req.body.powerSteeringOilReplacement,
            timingBeltReplacement : req.body.timingBeltReplacement,
            waterPumpReplacement : req.body.waterPumpReplacement,
            dieselParticulateFilterReplacement : req.body.dieselParticulateFilterReplacement,
            additionalInformation : req.body.additionalInformation
        };

        try {
            await utils.addNewService(service.idCars, service.description, service.mileAge, service.motorOilChangeDone, service.motorOilChangelongLifeOilUsed, service.airConditioningServiceDone, 
                service.airConditioningServiceDryer, service.sparkPlugReplacement, service.airFilterReplacement, service.cleanAirReplacement, service.fuelFilterReplacement, service.brakeFluidReplacement, 
                service.gearBoxOilReplacement, service.powerSteeringOilReplacement, service.timingBeltReplacement, service.waterPumpReplacement, service.dieselParticulateFilterReplacement, 
                service.additionalInformation);

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

    try {
        serviceList = await getService(req.params.carId, req.params.serviceId);

        if (serviceList === false) {

            res.status(400);
            res.json({message: "No service found with the given id"});
        } else {
            res.json(serviceList);
            res.status(200);
        }


    } catch (error) {
        console.log(error);
        res.status(404);
    }
});

router.put('/:carId/:serviceId', async (req, res) => {

    const editService = {
        motorOilChangeDone: null,
        motorOilChangelongLifeOilUsed: null,
        airConditioningServiceDone: null,
        airConditioningServiceDryer: null, 
        sparkPlugReplacement: null, 
        airFilterReplacement: null,
        cleanAirReplacement: null, 
        fuelFilterReplacement: null, 
        brakeFluidReplacement: null,
        gearBoxOilReplacement: null, 
        powerSteeringOilReplacement: null, 
        timingBeltReplacement: null, 
        waterPumpReplacement: null, 
        dieselParticulateFilterReplacement: null,
        additionalInformation: null
    };

    for (const key in req.body) {
        editService[key] = req.body[key];
    }

    try {
        serviceEdit = await utils.editService(req.params.carId, req.params.serviceId, editService);

        if (serviceEdit === null){
            res.status(404);
            res.json({message: "Cars has no service matching the id"});
        } else {
            res.status(201);
            res.json(serviceEdit);
        }

    } catch (error){
        console.log(error);
        res.status(400);
        res.json({message: "Editing infromation failed!"});

    }
    res.sendStatus(201);
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