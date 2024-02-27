require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const PORT = process.env.PORT || 3000;
const fileUpload = require("express-fileupload");
const studentRouter = require("./routes/studentRouter");
const adminRouter = require("./routes/adminRouter");

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//middlewares
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(cors());

//route
app.get("/", (req, res) => {
  res.status(200).json({ message: "WELCOME TO TSA DATABASE API" });
});

app.use("/api/v1/student", studentRouter);
app.use("/api/v1", adminRouter);

//error route
app.use((req, res) => {
  res.status(404).json({ error: "Resouce Not Found" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "TSADATABASE" });
    app.listen(PORT, () => {
      console.log(`App running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
