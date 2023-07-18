const publisherModel = require("../../models/publisher.model");
const {apiResponse:response} = require("../../utils/customResponse");
const customPagination = require("../../utils/customPagination");

class Publisher {
    async getAll(req, res) {
        try {
            const publishers = await publisherModel.find({});

            return response(res, true, "Get publishers successfully", 200, publishers);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const publisher = await publisherModel.findOne({_id: id});

            return response(res, true, "Get publisher successfully", 200, publisher);
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
                }
            ]

            const categories = await customPagination(publisherModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, categories);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {name, description} = req.body;

            const newPublisher = await publisherModel.create({
                name, description
            });

            return response(res, true, "New publisher is created", 201, newPublisher);
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

    async update(req, res) {
        try {
            const {id} = req.params;
            const {name, description} = req.body;

            const updatePublisher = await publisherModel.findByIdAndUpdate(id, {
                name, description
            }, {new: true, runValidators: true});

            return response(res, true, "Publisher is updated", 200, updatePublisher);
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

            const deletePublisher = await publisherModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Publisher is deleted", 200, deletePublisher);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Publisher();