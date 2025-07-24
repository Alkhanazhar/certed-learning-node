const { asyncHandler } = require('../helper/async-error.helper');
const { Course, CoursePurchase } = require('../models');

const findAllCourses = async () => {
    return asyncHandler(async () => {
        const courses = await Course.findAll({
            where: {
                status: 1,
                active: 1,
            },
            order: [['created_at', 'DESC']],
        });
        return courses ? courses : false;
    });
};

const findOneCourse = async (course_id) => {
    return asyncHandler(async () => {
        const course = await Course.findOne({
            where: {
                id: course_id,
                status: 1,
                active: 1,
            }
        });
        return course ? course.toJSON() : false;
    });
};

const findPurchase = async (user_id, course_id) => {
    return asyncHandler(async () => {
        const order = await CoursePurchase.findOne({
            where: {
                user_id,
                course_id,
                purchase_status: 'confirmed',
                active: true
            }
        });
        return order ? order : false;
    });
}

const createPurchaseOrder = async (value) => {
    return asyncHandler(async () => {
        const newOrder = await CoursePurchase.create(value);
        return newOrder ? newOrder : false;
    });

};

const findPurchaseById = async (purchase_id) => {
    return asyncHandler(async () => {
        const coursePurchase = await CoursePurchase.findByPk(purchase_id, {
            include: [{
                model: Course,
                as: 'course'
            }]
        });
        return coursePurchase ? coursePurchase:false
    })
}

const updatePurchase = async (purchase_id, updateData) => {
    return asyncHandler(async () => {

        const order = await findPurchaseById(purchase_id);
        if (!order) return false;
        await order.update(updateData);

        const orderData = order.toJSON();
        return orderData;
    });
};

module.exports = { findOneCourse, findAllCourses, findPurchase, createPurchaseOrder, findPurchaseById, updatePurchase }