require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const studentRouter = require("./routes/studentRouter");

//middleware
app.use(express.json());

//route
app.get("/", (req, res) => {
  res.status(200).json({ message: "WELCOME TO TSA DATABASE API" });
});

app.use("/api/v1/student", studentRouter);

//error route
app.use((req, res) => {
  res.status(404).send("Resouce Not Found");
});

const startSerer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "TSADATABASE" });
    app.listen(PORT, () => {
      console.log(`App running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startSerer();
