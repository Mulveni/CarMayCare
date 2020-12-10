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
    },
      
    userModel: (userInfo) => {
        const newUserModel = {
            id: userInfo.idUsers,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            email: userInfo.email,
            phonenumber: userInfo.phonenumber,
            address: {
                street: userInfo.street,
                city: userInfo.city,
                postcode: userInfo.postcode,
                country: userInfo.country
            },
            registerDate: userInfo.registerDate,
            password: userInfo.password
        }
        return newUserModel;
    },
    updateModel: () => {
        const updateModel = {
            firstname: "string",
            lastname: "string",
            email: "string",
            phonenumber: "string",
            address: {
                street: "string",
                city: "string",
                postcode: "string",
                country: "string"
            }
        }
        return updateModel;
    }

}
module.exports = models;