const categoryModel = require("../../models/category.model");
const {apiResponse:response} = require("../../utils/customResponse");
const customPagination = require("../../utils/customPagination");

class Category {
    async getAll(req, res) {
        try {
            const categories = await categoryModel.find({});

            return response(res, true, "Get categories successfully", 200, categories);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const category = await categoryModel.findOne({_id: id});

            return response(res, true, "Get category successfully", 200, category);
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

            const categories = await customPagination(categoryModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, categories);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {name, description} = req.body;

            const newCategory = await categoryModel.create({
                name, description
            });

            return response(res, true, "New category is created", 201, newCategory);
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

            const updateCategory = await categoryModel.findByIdAndUpdate(id, {
                name, description
            }, {new: true, runValidators: true});

            return response(res, true, "Category is updated", 200, updateCategory);
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

            const deleteCategory = await categoryModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Category is deleted", 200, deleteCategory);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Category();