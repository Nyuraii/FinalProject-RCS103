const express = require("express")
const ejs = require("ejs")
const path = require("path")
const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const favoriteRoutes = require("./routes/favoriteRoutes")
const basketRoutes = require("./routes/basketRoutes")

app.get("/", (req, res)=>{
    res.render("index")
})

app.use("/products", productRoutes)
app.use("/users", userRoutes)
app.use("/favorites", favoriteRoutes)
app.use("/baskets", basketRoutes)


const PORT = 8000
app.listen(PORT, ()=>{
    console.log(`App is runnign on port ${PORT}`);
})

