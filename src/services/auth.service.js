const { User } = require('../models');
const { asyncHandler } = require('../helper/async-error.helper');

const findUserByEmail = async (email) => {
    return asyncHandler(async () => {
        const user = await User.findOne({ where: { email } });
        return user || false;
    })
}

const registerUser = async ({ name, email }, password) => {

    const newUser = await User.create({
        name,
        email,
        password,
    });
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return userResponse ? userResponse : false;
};

module.exports = {
    findUserByEmail,
    registerUser
}