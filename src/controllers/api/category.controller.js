const categoryModel = require("../../models/category.model");
const response = require("../../utils/apiResponse");

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

    async create(req, res) {
        try {
            const {name, description, isDeleted} = req.body;

            if (!name) return response(res, false, "Field name is required.");

            const newCategory = await categoryModel.create({
                name, description, isDeleted
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

            if (!name) return response(res, false, "Field name is required.");

            const updateCategory = await categoryModel.findByIdAndUpdate(id, {
                name, description
            }, {new: true});

            return response(res, true, "Category is updated", 200, updateCategory);
        } catch (e) {
            console.log(e);
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