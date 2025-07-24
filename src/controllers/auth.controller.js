const { registerSchema, loginSchema } = require('../validation/auth.validation');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const { asyncErrorHandler, sendResponse } = require("../helper/async-error.helper");
const { hashPassword, comparePassword } = require('../helper/bcrypt.helper');
const { generateToken } = require('../helper/jwt.helper');

const register = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const hashedPassword = hashPassword(value.password);

        const existingUser = await authService.findUserByEmail(value.email);
        if (existingUser) {
            return sendResponse(res, 400, false, "Email already in use.");
        }

        const user = await authService.registerUser(value, hashedPassword);
        if (!user) {
            return sendResponse(res, 400, false, "Unable to create user.");
        }
        return sendResponse(res, 201, true, "User registered successfully.");

    },res)


};

const login = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }
        const existingUser = await userService.findUserWithPwd({email:value.email});
        if (!existingUser) {
            return sendResponse(res, 400, false, "Invalid email.");
        }
        const isMatch = comparePassword(value.password, existingUser.password);
        if (!isMatch) {
            return sendResponse(res, 400, false, "Incorrect password.");
        }

        delete existingUser.password;

        const token = generateToken(existingUser);
        return sendResponse(res, 200, true, "Login successful", { user: existingUser, token });
    },res);
};


module.exports = { register, login };