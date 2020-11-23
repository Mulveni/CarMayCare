const models = {
    serviceModel: (service) => {


        const newServiceModel = {
            idServices: service.idServices,
            idCars: service.idCars,
            description: service.description,
            dateOfService: service.dateOfService,
            mileAge: service.mileAge,

            motorOilChange: {
                done: service.motorOilChangeDone,
                longLifeOilUsed: service.motorOilChangelongLifeOilUsed
            },

            airConditioningService: {
                done: service.airConditioningServiceDone,
                dryer: service.airConditioningServiceDryer
            },

            additionalServices: {
                sparkPlugReplacement: service.sparkPlugReplacement,
                airFilterReplacement: service.airFilterReplacement,
                cleanAirReplacement: service.cleanAirReplacement,
                fuelFilterReplacement: service.fuelFilterReplacement,
                brakeFluidReplacement: service.brakeFluidReplacement,
                gearBoxOilReplacement: service.gearBoxOilReplacement,
                powerSteeringOilReplacement: service.gearBoxOilReplacement,
                timingBeltReplacement: service.timingBeltReplacement,
                waterPumpReplacement: service.waterPumpReplacement,
                dieselParticulateFilterReplacement: service.dieselParticulateFilterReplacement
              },

              additionalInformation: service.additionalInformation
        }

        return newServiceModel;
    }
}

module.exports = models;