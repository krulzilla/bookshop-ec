const typePaymentModel = require("../../models/typePayment.model");
const {apiResponse: response} = require("../../utils/customResponse");

class TypePayment {
    async getAll(req, res) {
        try {
            const data = await typePaymentModel.find();

            return response(res, true, "Get all successfully!", 200, data);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const data = await typePaymentModel.findById(id);

            return response(res, true, "Get by id successfully!", 200, data);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {name, shortName, description, image} = req.body;

            const data = await typePaymentModel.create({
                name,
                shortName,
                description,
                image,
            });

            return response(res, true, "Created successfully!", 201, data);
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
            const {name, description, image} = req.body;

            const data = await typePaymentModel.findByIdAndUpdate(id, {
                name,
                description,
                image,
            }, {new: true});

            return response(res, true, "Updated successfully!", 200, data);
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

    async delete(req, res) {
        try {
            const {id} = req.params;

            const data = await typePaymentModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Deleted successfully!", 200, data);
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
}

module.exports = new TypePayment();