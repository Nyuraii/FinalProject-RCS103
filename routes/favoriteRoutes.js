const router = require("express").Router();
const fs = require("fs");
const auth = require("../middleware/auth");

const readData = () => {
    return JSON.parse(fs.readFileSync("./data/favorites.json"));
};
const writeData = (data) => {
    fs.writeFileSync("./data/favorites.json", JSON.stringify(data, null, 2));
};

router.get("/", auth, (req, res) => {
    const products = readData();
    res.render("favorites", { products });
});

router.delete("/remove/:id", auth, (req, res) => {
    const favorites = readData();
    const index = favorites.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        const removedProduct = favorites.splice(index, 1);
        writeData(favorites);
        res.json(removedProduct);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

module.exports = router;
