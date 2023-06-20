const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");
const categoryModel = require("../../models/category.model");
const productModel = require("../../models/product.model");
const mongoose = require("mongoose");
const getPagination = require("../../utils/customPagination");

class Product {
    async renderProductPage(req, res, next) {
        const {category = []} = req.query;
        try {
            const categories = await categoryModel.find();
            // Get products
            const pipelines = [
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
                        publishedAt: 1,
                        "category.name": 1,
                        "author.name": 1,
                        image: 1
                    }
                }
            ]
            const products = await getPagination(productModel, 1, 8, pipelines);
            const pagination = {
                currentPage: 1,
                totalPage: 3,
                filterCategory: category
            }
            return render(res, "client-product", {name: "Product", category: categories, products, pagination});
        } catch (e) {
            next(e);
        }
    }

    async renderDetailPage(req, res) {
        return render(res, "client-product_detail");
    }
}

module.exports = new Product();