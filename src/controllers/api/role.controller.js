const roleModel = require("../../models/role.model");
const response = require("../../utils/apiResponse");

class Role {
    async getAll(req, res) {
        try {
            const roles = await roleModel.find({});

            return response(res, true, "Get roles successfully", 200, roles);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const role = await roleModel.findOne({_id: id});

            return response(res, true, "Get role successfully", 200, role);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {name, description} = req.body;

            const newRole = await roleModel.create({
                name, description
            });

            return response(res, true, "New role is created", 201, newRole);
        } catch (e) {
            if (e.name === "ValidationError") {
                let errMsg;
                Object.keys(e.errors).forEach((key) => {
                    errMsg = e.errors[key].message;
                });
                return response(res, false, errMsg, 400);
            } else if (e.name === "MongoServerError" && e.code === 11000) {
                return response(res, false, `Attribute '${e.keyValue.name}' is unique!`, 400);
            }
            return response(res, false, "Somethings went wrong!", 500);
        }

    }

    async update(req, res) {
        try {
            const {id} = req.params;
            const {name, description} = req.body;

            const updateRole = await roleModel.findByIdAndUpdate(id, {
                name, description
            }, {new: true, runValidators: true});

            return response(res, true, "Role is updated", 200, updateRole);
        } catch (e) {
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

    async delete(req, res) {
        try {
            const {id} = req.params;

            const deleteRole = await roleModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Author is deleted", 200, deleteRole);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Role();