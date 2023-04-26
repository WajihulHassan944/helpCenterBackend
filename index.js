const express = require("express");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/todo-list-app";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

const taskSchema = new mongoose.Schema({
  task: String,
});

const Task = mongoose.model("Task", taskSchema);


app.post("/api/tasks", async (req, res) => {
  try {
    const { task } = req.body;
    const newTask = new Task({ task });
    await newTask.save();
    res.json({ _id: newTask._id, task: newTask.task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve tasks" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get("/", (req,res) =>{
    res.send("hello");
})


