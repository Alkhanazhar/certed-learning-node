module.exports = (sequelize, DataTypes) => {
    const CoursePurchase = sequelize.define('CoursePurchase', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'id'
            }
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id'
            }
        },
        course_name: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        discount_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        final_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        coupon_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        coupon_info: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        // Razorpay related fields
        razorpay_order_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        razorpay_payment_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        razorpay_signature: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        razorpay_order_details: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        razorpay_payment_response: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        payment_status: {
            type: DataTypes.ENUM('pending', 'success', 'failed', 'tampered'),
            allowNull: false,
            defaultValue: 'pending',
        },
        purchase_status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'refunded'),
            allowNull: false,
            defaultValue: 'pending',
        },
        purchase_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        access_granted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        sequelize,
        tableName: 'course_purchases',
        underscored: true,
        timestamps: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['course_id']
            },
            {
                fields: ['razorpay_order_id']
            },
            {
                fields: ['razorpay_payment_id']
            },
            {
                fields: ['payment_status']
            }
        ]
    });

    CoursePurchase.associate = models => {
        CoursePurchase.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course'
        });
        // Assuming you have a User model
        CoursePurchase.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };
    return CoursePurchase;
}