const productModel = require("../../models/product.model");
const {apiResponse:response} = require("../../utils/customResponse");
const customPagination = require("../../utils/customPagination");
const {Types} = require("mongoose");

class Product {
    async getAll(req, res) {
        try {
            const products = await productModel.find({});

            return response(res, true, "Get products successfully", 200, products);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const product = await productModel.findOne({_id: id});

            return response(res, true, "Get product successfully", 200, product);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async pagination(req, res) {
        try {
            let {category = [], search = "", page = 1, pageSize = 8, price = ""} = req.query;
            // Handle filter category
            if (!category) category = [];
            category = typeof category == "string" ? [new Types.ObjectId(category)] : category.map(ele => new Types.ObjectId(ele));
            const filterCategory = category.length == 0 ? "$nin" : "$in";
            // Handle filter price
            const priceParams = price.split("-");
            let gte = 0, lt = Number.POSITIVE_INFINITY;
            if (priceParams.length == 2) {
                gte = +priceParams[0] * 1000;
                if (priceParams[1] != "max") lt = +priceParams[1] * 1000;
            }
            // Exec query
            const pipelines = [
                {
                    $match: {
                        name: { $regex: search, $options: "i" },
                        idCategory: { [filterCategory]: category },
                        price: { $gte: gte, $lt: lt }
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "idCategory",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $lookup: {
                        from: "authors",
                        localField: "idAuthor",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    $project: {
                        name: 1,
                        price: 1,
                        amount: 1,
                        image: 1,
                        publishedAt: 1,
                        "category.name": 1,
                        "author.name": 1
                    }
                }
            ]

            const products = await customPagination(productModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, products);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {name,
                category,
                author,
                publisher,
                publishedAt,
                amount,
                description,
                price,
                image} = req.body;

            // Exec insert
            const newProduct = await productModel.create({
                name,
                idCategory: [...category],
                idAuthor: [...author],
                idPublisher: publisher,
                publishedAt,
                amount,
                description,
                price,
                image
            });

            return response(res, true, "New product is created", 201, newProduct);
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
            const {name,
                category,
                author,
                publisher,
                publishedAt,
                amount,
                description,
                price,
                image} = req.body;

            // Exec update
            const updateData = {
                name,
                idPublisher: publisher,
                publishedAt,
                amount,
                description,
                price,
                image
            };
            if (category) updateData.idCategory = [...category];
            if (author) updateData.idAuthor = [...author];

            const updateProduct = await productModel.findByIdAndUpdate(id, updateData,
                {new: true, runValidators: true});

            return response(res, true, "Product is updated", 200, updateProduct);
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

            const deleteProduct = await productModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Product is deleted", 200, deleteProduct);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Product();