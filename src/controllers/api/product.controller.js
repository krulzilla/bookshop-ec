const productModel = require("../../models/product.model");
const {apiResponse: response} = require("../../utils/customResponse");
const customPagination = require("../../utils/customPagination");
const {Types} = require("mongoose");
const fs = require("fs");
const xlsx = require("xlsx");

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

            const product = await productModel.findOne({_id: id}).populate("idCategory", "name")
                .populate("idAuthor", "name").populate("idPublisher", "name");

            return response(res, true, "Get product successfully", 200, product);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getRandom(req, res) {
        try {
            let {category = [], size = 1} = req.query;
            if (!category) category = [];
            category = typeof category == "string" ? [new Types.ObjectId(category)] : category.map(ele => new Types.ObjectId(ele));
            const filterCategory = category.length == 0 ? "$nin" : "$in";

            const pipelines = [
                {
                    $match: {
                        idCategory: { [filterCategory]: category },
                    }
                },
                {
                    $sample: {
                        size: +size
                    }
                },
                {
                    $project: {
                        name: 1,
                        price: 1,
                        image: 1
                    }
                }
            ];

            const products = await productModel.aggregate(pipelines);

            return response(res, true, "Action success!", 200, products);
        } catch (e) {
            console.log(e)
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
                    $sort: {
                        createdAt: -1,
                    }
                },
                {
                    $project: {
                        name: 1,
                        price: 1,
                        sale: 1,
                        amount: 1,
                        image: 1,
                        publishedAt: 1,
                        createdAt: 1,
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
                sale,
                img_url: image} = req.body;

            const categories = Array.isArray(category) ? [...category] : [category];
            const authors = Array.isArray(author) ? [...author] : [author];

            // Exec insert
            const newProduct = await productModel.create({
                name,
                idCategory: categories,
                idAuthor: authors,
                idPublisher: publisher,
                publishedAt,
                amount,
                description,
                price,
                sale,
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
                description,
                price,
                sale,
                img_url: image} = req.body;

            // Exec update
            const updateData = {
                name,
                idPublisher: publisher,
                publishedAt,
                description,
                price,
                sale,
                image
            };
            if (Array.isArray(category)) updateData.idCategory = [...category];
            else updateData.idCategory = [category];
            if (Array.isArray(author)) updateData.idAuthor = [...author];
            else updateData.idAuthor = [author];

            const updateProduct = await productModel.findByIdAndUpdate(id, updateData,
                {runValidators: true});
            if (image) fs.unlinkSync(`./src/public/resources/images/${updateProduct.image}`)

            return response(res, true, "Product is updated", 200);
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

    async exportExcel(req, res) {
        try {
            const products = await productModel.find().populate("idCategory").populate("idAuthor").populate("idPublisher");

            const productsToExport = products.map(product => ({
                Id: product._id.toString(),
                Name: product.name,
                Category: product.idCategory.reduce((res, current) => res += current.name + "; ", "").replace(/(; )$/, ""),
                Author: product.idAuthor.reduce((res, current) => res += current.name + "; ", "").replace(/(; )$/, ""),
                Publisher: product.idPublisher.name,
                PublishedAt: product.publishedAt,
                Amount: product.amount,
                Description: product.description,
                Price: product.price,
                CreatedAt: product.createdAt
            }))

            const worksheet = xlsx.utils.json_to_sheet(productsToExport);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Product");
            const excelBuffer = xlsx.write(workbook, {type: "buffer"});

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=products.xlsx"
            );
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            return res.send(excelBuffer);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Product();