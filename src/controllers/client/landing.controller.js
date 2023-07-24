const {uiRender: render} = require("../../utils/customResponse");
const productModel = require("../../models/product.model");


class Landing {
    async renderLandingPage(req, res, next) {
        try {
            const products = await productModel.aggregate([
                {
                    $match: {
                        amount: {$gt: 0}
                    }
                }
                ,{
                    $sample: {
                        size: 16
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
                        _id: 1,
                        name: 1,
                        price: 1,
                        image: 1,
                        sale: 1,
                        author: {
                            name: 1
                        }
                    }
                }
            ])

            return render(res, "client-landing", {user: req.user, products}, false);
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Landing();