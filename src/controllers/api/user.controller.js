const userModel = require("../../models/user.model");
const roleModel = require("../../models/role.model");
const {apiResponse: response} = require("../../utils/customResponse");
const {hashString, compareHash} = require("../../utils/helper");
const customPagination = require("../../utils/customPagination");

class User {
    async getById(req, res) {
        try {
            const {id} = req.params;

            const user = await userModel.findById(id).populate("role", "name").select("username fullname age phone address email github isActive createdAt");

            return response(res, true, "Get user success!", 200, user);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async paginationCustomer(req, res) {
        try {
            let {search = "", page = 1, pageSize = 10} = req.query;
            // Exec query
            const pipelines = [
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $unwind: "$role"
                },{
                    $match: {
                        "role.name": "Client",
                        username: { $regex: search, $options: "i" },
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        fullname: 1,
                        phone: 1,
                        isActive: 1,
                        createdAt: 1
                    }
                }
            ]

            const customers = await customPagination(userModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, customers);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async createCustomer(req, res) {
        try {
            const {username, password, age, address, phone} = req.body;
            let {fullname} = req.body;

            if (password === "") return response(res, false, "Password cannot be null!", 400);

            const roleCustomer = await roleModel.findOne({
                name: "Client"
            });

            const roleCustomerId = roleCustomer._id;

            const newCustomer = new userModel({
                username,
                password: hashString(password),
                age,
                address,
                phone,
                role: roleCustomerId
            })

            if (fullname === "") fullname = "Anonymous client " + Date.now().toString().slice(-4);
            newCustomer.fullname = fullname;

            await newCustomer.save();

            return response(res, true, "Create customer successfully!", 201, newCustomer);
        } catch (e) {
            if (e.name === "MongoServerError" && e.code === 11000) {
                const fieldDuplicated = Object.keys(e.keyPattern)[0];
                return response(res, false, `Field ${fieldDuplicated} is in used!`, 400);
            }
            if (e.name === "ValidationError") {
                let errMsg;
                Object.keys(e.errors).forEach((key) => {
                    errMsg = e.errors[key].message;
                });
                return response(res, false, errMsg, 400);
            }
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async paginationStaff(req, res) {
        try {
            let {search = "", page = 1, pageSize = 10} = req.query;
            // Exec query
            const pipelines = [
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $unwind: "$role"
                },{
                    $match: {
                        "role.name": { $ne: "Client" },
                        username: { $regex: search, $options: "i" },
                    }
                },
                {
                    $sort: {
                        "role.name": 1,
                        createdAt: -1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        fullname: 1,
                        phone: 1,
                        "role.name": 1,
                        isActive: 1,
                        createdAt: 1
                    }
                }
            ]

            const staffs = await customPagination(userModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, staffs);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async createStaff(req, res) {
        try {
            const {username, password, age, address, phone, role} = req.body;
            let {fullname} = req.body;

            if (password === "") return response(res, false, "Password cannot be null!", 400);

            const newStaff = new userModel({
                username,
                password: hashString(password),
                age,
                address,
                phone,
                role
            })

            if (fullname === "") fullname = "Anonymous client " + Date.now().toString().slice(-4);
            newStaff.fullname = fullname;

            await newStaff.save();

            return response(res, true, "Create staff successfully!", 201, newStaff);
        } catch (e) {
            if (e.name === "MongoServerError" && e.code === 11000) {
                const fieldDuplicated = Object.keys(e.keyPattern)[0];
                return response(res, false, `Field ${fieldDuplicated} is in used!`, 400);
            }
            if (e.name === "ValidationError") {
                let errMsg;
                Object.keys(e.errors).forEach((key) => {
                    errMsg = e.errors[key].message;
                });
                return response(res, false, errMsg, 400);
            }
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async updateInfo(req, res) {
        try {
            const idUser = req.body.idUser ?? req.user._id;
            const {fullname, age, address, phone} = req.body;

            const user = await userModel.findByIdAndUpdate(idUser, {
                fullname,
                age,
                address,
                phone
            });

            return response(res, true, "Update information successfully!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async updateInfoStaff(req, res) {
        try {
            const idUser = req.body.idUser;
            const {fullname, age, address, phone, role} = req.body;

            const user = await userModel.findByIdAndUpdate(idUser, {
                fullname,
                age,
                address,
                phone,
                role
            });

            return response(res, true, "Update information successfully!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async changePassword(req, res) {
        try {
            const idUser = req.body.idUser ?? req.user._id;
            const {password, newPassword, confirmPassword} = req.body;

            // Check new password == confirm password
            if (newPassword !== confirmPassword) return response(res, false, "Confirm password is incorrect!", 400);

            // Check current password is correct
            const currentUser = await userModel.findById(idUser).select("password isAuthBySocial");

            let passwordUpdate = {};  // Use to update password.

            if (!currentUser.isAuthBySocial) {
                if (!compareHash(password, currentUser.password)) return response(res, false, "Current password is incorrect!", 400);
            } else {
                passwordUpdate.isAuthBySocial = false;
            }

            passwordUpdate.password = hashString(newPassword)

            // Change password
            const newUser = await userModel.findByIdAndUpdate(idUser, passwordUpdate);

            return response(res, true, "Change password successfully!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async changeStatusUser(req, res) {
        try {
            const {id} = req.params;

            const user = await userModel.findById(id).populate("role", "name");

            if (user.role.name === "Admin") return response(res, false, "Cannot change status of admin!", 400);

            user.isActive = !user.isActive;

            await user.save();

            return response(res, true, "Change status successfully!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    // Fn to check shipping info of user (fullName, phone, address)
    async haveShippingInfo(req, res) {
        try {
            const idUser = req.body.idUser ?? req.user._id;

            const user = await userModel.findById(idUser);

            if (!user.fullname || !user.address || !user.phone) {
                return response(res, false, "Missing shipping information, please update your information before complete order!", 400);
            }

            return response(res, true, "Can create order!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            const user = await userModel.findById(id).populate("role", "name");

            if (user.role.name === "Admin") return response(res, false, "Cannot delete admin!", 400);

            user.isDeleted = true;

            await user.save();

            return response(res, true, "Delete user successfully!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new User();