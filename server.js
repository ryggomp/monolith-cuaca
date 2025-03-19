require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // Now it reads from .env file

// Middleware Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setting template engine EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// API Cuaca
app.get("/api/cuaca", async (req, res) => {
    try {
        const city = req.query.city || "Jakarta"; // Default ke Jakarta
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        res.json({
            kota: response.data.name,
            suhu: response.data.main.temp + "°C",
            deskripsi: response.data.weather[0].description
        });
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data cuaca" });
    }
});

// Tampilan Frontend
app.get("/", (req, res) => {
    res.render("index", { kota: null, suhu: null, deskripsi: null, error: null });
});

// Form input di frontend
app.get("/cuaca", async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.render("index", { kota: null, suhu: null, deskripsi: null, error: "Harap masukkan nama kota!" });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        res.render("index", {
            kota: response.data.name,
            suhu: response.data.main.temp + "°C",
            deskripsi: response.data.weather[0].description,
            error: null
        });
    } catch (error) {
        res.render("index", { kota: null, suhu: null, deskripsi: null, error: "Data cuaca tidak ditemukan!" });
    }
});

// Jalankan server
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
