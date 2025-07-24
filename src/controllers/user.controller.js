const { asyncErrorHandler, sendResponse } = require("../helper/async-error.helper");
const { updateProfileSchema, changePasswordSchema, contactFormSchema } = require('../validation/user.validation');
const userService = require("../services/user.service")
const { comparePassword, hashPassword } = require('../helper/bcrypt.helper');
const { generateToken } = require("../helper/jwt.helper");
const { sendEmail } = require("../helper/nodemailer.helper");
const { contactFormBody } = require("../views/contact.view");

const getAllUsers = async (req, res) => {
    return asyncErrorHandler(async () => {
        const users = await userService.findAllUsers();
        if (!users || users.length === 0) {
            return sendResponse(res, 404, false, 'No users found');
        }
        return sendResponse(res, 200, true, 'Users fetched successfully', users);
    }, res);
};

const getUserById = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { id } = req.params;

        const user = await userService.findUserById(id);
        if (!user) {
            return sendResponse(res, 404, false, 'User not found.');
        }
        else if (user.id != req.user.id) {  //verify the fetched user data is same as the id in token
            return sendResponse(res, 401, false, 'Invalid user id.');
        }

        return sendResponse(res, 200, true, 'User fetched successfully', user);
    },res)
}

const updateProfile = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { error, value } = updateProfileSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const user = await userService.findUserById(req.params.id);
        if (!user) {
            return sendResponse(res, 404, false, "User not found.");
        }

        const updatedUser = await userService.updateUser(req.params.id, value);
        if (!updatedUser) {
            return sendResponse(res, 400, false, "Unable to update profile.");
        }
        const token = generateToken(updatedUser);

        return sendResponse(res, 200, true, "Profile updated successfully.", { user: updatedUser, token });
    }, res);
};

const changePassword = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { error, value } = changePasswordSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const user = await userService.findUserWithPwd(req.user.id);
        if (!user) {
            return sendResponse(res, 404, false, "User not found.");
        }

        const isMatch = comparePassword(value.old_password, user.password);
        if (!isMatch) {
            return sendResponse(res, 400, false, "Old password is incorrect.");
        }

        const hashedPassword = hashPassword(value.new_password);
        const updated = await userService.updateUser(req.user.id, { password: hashedPassword });

        if (!updated) {
            return sendResponse(res, 400, false, "Unable to change password.");
        }

        return sendResponse(res, 200, true, "Password changed successfully.");
    }, res);
};

const contactForm = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { error, value } = contactFormSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }
        const { name, email, phone, subject, message } = value;

        const regex = /http|www/i;
        const fieldsToCheck = [name, email, phone, message];

        for (const field of fieldsToCheck) {
            if (regex.test(field)) {
                return sendResponse(res, 402, false, "URL not allowed in message. Please do not try to spam.");
            }
        }

        const contact = await userService.addContactInfo(value);
        if (!contact) {
            return sendResponse(res, 400, false, "Unable to contact CertEd technologies.");
        }

        const body = contactFormBody(value);

        await sendEmail(email, `Contact CertEd Technologies: ${subject}`, body);

        return sendResponse(res, 200, true, "Email sent successfully.");
    }, res);
};
  

module.exports = {
    getAllUsers,
    getUserById,
    updateProfile,
    changePassword,
    contactForm
};
