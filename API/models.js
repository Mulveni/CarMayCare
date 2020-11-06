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
    }

}


module.exports = models;