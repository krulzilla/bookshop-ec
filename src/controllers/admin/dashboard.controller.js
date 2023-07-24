const {uiRender: render} = require("../../utils/customResponse");
const userModel = require("../../models/user.model");
const roleModel = require("../../models/role.model");
const orderModel = require("../../models/order.model");
const orderDetailModel = require("../../models/orderDetail.model");

class Dashboard {
    async renderDashboardPage(req, res, next) {
        try {
            // Overview figure
            const role = await roleModel.findOne({name: "Client"});
            const amountCustomer = await userModel.where({role: role._id}).count();

            const orders = await orderModel.where({status: {$ne: 4}});
            const amountOrder = orders.length;
            const estimateRevenue = orders.reduce((total, current) => total += current.total, 0);

            const ordersDelivered = await orderModel.where({status: {$eq: 3}});
            const realRevenue = ordersDelivered.reduce((total, current) => total += current.total, 0);

            const figureOverview = {
                customers: amountCustomer,
                orders: amountOrder,
                estimateRevenue: estimateRevenue,
                realRevenue: realRevenue
            }

            // Top selling
            const topSelling = await orderDetailModel.aggregate([
                {
                    $group: {
                        _id: '$idProduct',
                        totalQuantity: { $sum: '$amount' },
                        avgPrice: {$avg: '$price'}
                    },
                },
                {
                    $sort: {
                        totalQuantity: -1,
                    },
                },
                {
                    $limit: 5,
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $unwind: "$product"
                },
                {
                    $project: {
                        totalQuantity: 1,
                        avgPrice: 1,
                        "product.image": 1,
                        "product.name": 1,
                        "product.createdAt": 1,
                    }
                }
            ]);

            // Recent activity
            const orderActivity = await orderModel.aggregate([
                {
                    $sort: {
                        updatedAt: -1
                    }
                },
                {
                    $limit: 10
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        updatedAt: 1
                    }
                }
            ])

            return render(res, "admin-dashboard", {name: "Dashboard", user: req.user, figure: figureOverview, topSelling, orderActivity}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new Dashboard();