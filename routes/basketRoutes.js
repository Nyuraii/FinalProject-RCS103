const router = require("express").Router()
const fs = require("fs")

const readBasket = () => {
    return JSON.parse(fs.readFileSync("./data/basket.json"))
}
const writeBasket = (data) => {
    fs.writeFileSync("./data/basket.json", JSON.stringify(data, null, 2))
}

router.get("/", (req, res) => {
    const basket = readBasket()
    res.render("baskets", { basket })
})

router.post("/add/:id", (req, res) => {
    const products = JSON.parse(fs.readFileSync("./data/products.json"))
    const basket = readBasket()
    const productIndex = products.findIndex(p => p.id == req.params.id)
    if (productIndex !== -1) {
        const foundProduct = products[productIndex]
        basket.push(foundProduct)
        writeBasket(basket)
        res.json(foundProduct)
    } else {
        res.status(404).json({ message: "Product not found" })
    }
})

router.delete("/remove/:id", (req, res) => {
    const basket = readBasket()
    const index = basket.findIndex(p => p.id == req.params.id)
    if (index !== -1) {
        const removedProduct = basket.splice(index, 1)
        writeBasket(basket)
        res.json(removedProduct)
    } else {
        res.status(404).json({ message: "Product not found" })
    }
})

module.exports = router
