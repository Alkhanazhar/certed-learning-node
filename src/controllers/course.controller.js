const courseService = require("../services/course.service")
const { asyncErrorHandler, sendResponse } = require("../helper/async-error.helper");
const { coursePurchaseSchema, paymentVerificationSchema } = require("../validation/course.validation");
const { razorpayInstance, verifyRazorpaySignature } = require("../helper/razorpay.helpers");
const { purchaseConfirmaitonBody } = require("../views/course.view");
const { sendEmail } = require("../helper/nodemailer.helper");
const path = require("path");
const fs = require("fs");

const getCourseAttachment = async (courseId, courseName) => {
    try {

        const courseFilesDir = './src/public/courses';
        const possibleExtensions = ['.pdf'];

        for (const ext of possibleExtensions) {
            const filePath = path.join(courseFilesDir, `${courseId}${ext}`);
            console.log(filePath)
            try {
                await fs.promises.access(filePath);
                return {
                    filename: `${courseName.replace(/[^a-zA-Z0-9]/g, '_')}_Course${ext}`,
                    path: filePath
                };
            } catch (error) {

                console.log(error)
                continue;
            }
        }


        console.warn(`Course attachment not found for course ID: ${courseId}`);
        return null;
    } catch (error) {
        console.error('Error getting course attachment:', error);
        return null;
    }
};

const getAllCourses = async (req, res) => {
    return asyncErrorHandler(async () => {
        const courses = await courseService.findAllCourses()
        if (courses.length == 0) {
            return sendResponse(res, 404, false, "No courses found as of now.");
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const formattedCourses = courses.map((course) => {
            return {
                ...course.toJSON(),
                pdf_url: `${baseUrl}/public${course.file_path}`, // Append full URL to the file
            };
        });


        return sendResponse(res, 200, true, "Courses fetched successfully.", {
            courses: formattedCourses,
        });
    }, res);
};

const purchaseCourse = async (req, res) => {
    return asyncErrorHandler(async () => {

        const { error, value } = coursePurchaseSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const { user_id, course_id, name, email, phone, } = value; //coupon_code

        const course = await courseService.findOneCourse(course_id);

        if (!course) {
            return sendResponse(res, 404, false, 'Course not found or inactive.');
        }

        const existingPurchase = await courseService.findPurchase(user_id, course_id)

        if (existingPurchase) {
            return sendResponse(res, 400, false, 'You have already purchased this course');
        }

        // Calculate pricing (add your coupon logic here)
        let course_price = parseFloat(course.amount);
        let discount_amount = 0;
        let coupon_info = null;

        // if (coupon_code) {
        // const couponData = await validateCoupon(coupon_code, course_id);
        // if (couponData.valid) {
        //   discount_amount = couponData.discount;
        //   coupon_info = JSON.stringify(couponData);
        // }
        // }

        const final_amount = course_price - discount_amount;

        // Create purchase record
        const purchaseData = {
            user_id,
            course_id,
            course_name: course.name,
            name,
            email,
            phone,
            amount: course_price,
            discount_amount,
            final_amount,
            coupon_code: "",
            coupon_info,
            payment_status: 'pending',
            purchase_status: 'pending'
        };

        const coursePurchase = await courseService.createPurchaseOrder(purchaseData);

        // Create Razorpay order
        const razorpayOptions = {
            amount: Math.round(final_amount * 100), // Convert to paise
            currency: 'INR',
            receipt: `course_${coursePurchase.id}`,
            payment_capture: 1,
            notes: {
                purchase_id: coursePurchase.id,
                course_id: course_id,
                user_id: user_id,
                order_type: 'Course Purchase'
            }
        };

        const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);

        // Update purchase record with Razorpay order details
        await coursePurchase.update({
            razorpay_order_id: razorpayOrder.id,
            razorpay_order_details: JSON.stringify(razorpayOrder)
        });

        return sendResponse(res, 200, true, 'Purchase order created successfully.', {
            purchase_id: coursePurchase.id,
            razorpay_order: razorpayOrder,
            course_details: {
                id: course.id,
                name: course.name,
                price: course_price,
                discount: discount_amount,
                final_amount: final_amount
            }
        });

    }, res)

};

const verifyPayment = async (req, res) => {
    return asyncErrorHandler(async () => {

        const { error, value } = paymentVerificationSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, purchase_id } = value;

        // Verify signature
        const isSignatureValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isSignatureValid) {
            return sendResponse(res, 400, false, 'Invalid payment signature.');
        }

        // Get purchase record
        const coursePurchase = await courseService.findPurchaseById((purchase_id))

        if (!coursePurchase) {
            return sendResponse(res, 404, false, 'Purchase record not found');
        }

        // Verify order ID matches
        if (coursePurchase.razorpay_order_id !== razorpay_order_id) {
            return sendResponse(res, 400, false, 'Order ID mismatch');
        }

        // Fetch payment details from Razorpay
        const paymentResponse = await razorpayInstance.payments.fetch(razorpay_payment_id);
        const expectedAmount = Math.round(coursePurchase.final_amount * 100);

        if (paymentResponse.status === 'captured') {
            // Check amount integrity
            if (paymentResponse.amount !== expectedAmount) {
                await courseService.updatePurchase(purchase_id, {
                    razorpay_payment_id,
                    razorpay_signature,
                    razorpay_payment_response: JSON.stringify(paymentResponse),
                    payment_status: 'tampered',
                    purchase_status: 'cancelled',
                    notes: 'Payment amount mismatch detected'
                });

                return sendResponse(res, 400, false, 'Payment amount mismatch detected');
            }

            // Payment successful - update purchase record
            await courseService.updatePurchase(purchase_id, {
                razorpay_payment_id,
                razorpay_signature,
                razorpay_payment_response: JSON.stringify(paymentResponse),
                payment_status: 'success',
                purchase_status: 'confirmed',
                access_granted: true
            });

            const coursePurchase = { course_id: 1, user_id: 1, course_name: "Artificial Intelligence", amount: 24999, email: "ambreen4724syed@gmail.com", name: "ambreen" }

            const attachment = await getCourseAttachment(coursePurchase.course_id, coursePurchase.course_name);
            const attachments = attachment ? [attachment] : [];

            const body = purchaseConfirmaitonBody(coursePurchase);
            await sendEmail(coursePurchase.email, `CertEd Technologies: Purchase Confirmation`, body, attachments);


            return sendResponse(res, 200, true, 'Course purchase completed successfully.', {
                purchase_id: coursePurchase.id,
                course_name: coursePurchase.course_name,
                access_granted: true
            });

        } else {
            // Payment failed
            await courseService.updatePurchase(purchase_id, {
                razorpay_payment_id,
                razorpay_signature,
                razorpay_payment_response: JSON.stringify(paymentResponse),
                payment_status: 'failed',
                purchase_status: 'cancelled'
            });

            return sendResponse(res, 400, false, 'Payment failed.');
        }
    }, res)

};

const getUserCoursePurchases = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id || isNaN(user_id)) {
            return sendResponse(res, 400, false, 'Valid user ID is required');
        }

        const purchases = await CoursePurchase.findAll({
            where: {
                user_id: parseInt(user_id),
                active: true
            },
            include: [{
                model: Course,
                as: 'course',
                attributes: ['id', 'name', 'chapters', 'duration', 'file_path']
            }],
            order: [['created_at', 'DESC']]
        });

        return sendResponse(res, 200, true, 'User purchases retrieved successfully', purchases);

    } catch (error) {
        console.error('Error fetching user course purchases:', error);
        return sendResponse(res, 500, false, 'Internal server error');
    }
};

module.exports = {
    getAllCourses,
    purchaseCourse,
    verifyPayment,
    getUserCoursePurchases
}