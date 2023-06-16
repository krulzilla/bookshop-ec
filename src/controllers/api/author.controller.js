const authorModel = require("../../models/author.model");
const response = require("../../utils/apiResponse");

class Author {
    async getAll(req, res) {
        try {
            const authors = await authorModel.find({});

            return response(res, true, "Get authors successfully", 200, authors);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const author = await authorModel.findOne({_id: id});

            return response(res, true, "Get author successfully", 200, author);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {name, description} = req.body;

            const newAuthor = await authorModel.create({
                name, description
            });

            return response(res, true, "New author is created", 201, newAuthor);
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

            const updateAuthor = await authorModel.findByIdAndUpdate(id, {
                name, description
            }, {new: true, runValidators: true});

            return response(res, true, "Author is updated", 200, updateAuthor);
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

            const deleteAuthor = await authorModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Author is deleted", 200, deleteAuthor);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Author();