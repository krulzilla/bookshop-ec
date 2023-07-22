const express = require("express");
const multer = require('multer');
const router = express.Router();
const productApi = require("../../controllers/api/product.controller");

// Config multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/resources/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = '' + Date.now() + Math.round(Math.random() * 1E3) + '.' + file.originalname.split('.').at(-1);
        const saveName = 'p-' + uniqueSuffix;
        req.body.img_url = saveName;
        cb(null, saveName);
    }
})
const upload = multer({ storage: storage })

router.get("/", productApi.getAll);
router.get("/export-excel", productApi.exportExcel);
router.get("/pagination", productApi.pagination);
router.get("/random", productApi.getRandom);
router.get("/:id", productApi.getById);
router.post("/", upload.single("image"), productApi.create);
router.put("/:id", upload.single("image"), productApi.update);
router.delete("/:id", productApi.delete);

module.exports = router;