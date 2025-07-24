const { asyncHandler } = require('../helper/async-error.helper');
const { User, ContactForm } = require('../models');

const findUserById = async (userId) => {
    return asyncHandler(async () => {
        const user = await User.findByPk(userId);
        return user ? user.toJSON() : false;
    });
};

const findUserWithPwd = async (data) => {
    return asyncHandler(async () => {
        const user = await User.scope('withPassword').findOne({ where: data });
        return user ? user.toJSON() : false;
    });
};

const findAllUsers = async () => {
    return asyncHandler(async () => {
        const user = await User.findAll({
            order: [['created_at', 'DESC']],
        });
        if (user) {
            const userData = user.toJSON();
            delete userData.password;
            return userData;
        } else {

        }
        return user ? user : false;
    });
};

const updateUser = async (userId, updateData) => {
    return asyncHandler(async () => {

        const user = await findUserById(userId);
        if (!user) return false;
        await user.update(updateData);

        const userData = user.toJSON();
        return userData;
    });
};

const updateUserPassword = async (userId, hashedPassword) => {
    return asyncHandler(async () => {

        const user = await findUserWithPwd(userId);
        if (!user) return false;
        await user.update({ password: hashedPassword });
        return true;
    });

};

const addContactInfo = async (value) => {
    return asyncHandler(async () => {
        const newContact = await ContactForm.create(value);
        return newContact ? newContact.toJSON() : false;
    });

};

module.exports = {
    findUserById,
    findAllUsers,
    updateUser,
    updateUserPassword,
    findUserWithPwd,
    addContactInfo
};
