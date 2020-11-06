const models = {
    userModel: (userInfo) => {
        const newUserModel = {
            id: userInfo.idUsers,
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
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