const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskDetailsSchema = new Schema({
  task_name: String,
  description: String,
  priority: String,
  assigned_to: String,
});

const taskSchema = new Schema(
  {
    category: String,
    tasks: [taskDetailsSchema],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
