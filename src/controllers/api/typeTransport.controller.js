const typeTransportModel = require("../../models/typeTransport.model");
const {apiResponse: response} = require("../../utils/customResponse");
const customPagination = require("../../utils/customPagination");

class TypeTransport {
    async getAll(req, res) {
        try {
            const data = await typeTransportModel.find();

            return response(res, true, "Get all successfully!", 200, data);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const data = await typeTransportModel.findById(id);

            return response(res, true, "Get by id successfully!", 200, data);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async pagination(req, res) {
        try {
            let {search = "", page = 1, pageSize = 10} = req.query;
            // Exec query
            const pipelines = [
                {
                    $match: {
                        name: { $regex: search, $options: "i" },
                    }
                },
                {
                    $sort: {
                        createdAt: 1
                    }
                }
            ]

            const types = await customPagination(typeTransportModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, types);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {name, description, price} = req.body;

            const data = await typeTransportModel.create({
                name,
                description,
                price,
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
            const {name, description, price} = req.body;

            const data = await typeTransportModel.findByIdAndUpdate(id, {
                name,
                description,
                price,
            }, {new: true});

            return response(res, true, "Updated successfully!", 200, data);
        } catch (e) {
            console.log(e)
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

            const data = await typeTransportModel.findByIdAndUpdate(id, {
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

module.exports = new TypeTransport();