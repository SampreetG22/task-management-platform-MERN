const express = require("express");
const Task = require("../models/taskModel");

const router = express.Router();

router.post("/", async (request, response) => {
  const { task } = request.body;
  try {
    const existingObject = await Task.findOne({
      category: "Pending", // To add newly created tasks to 'Pending' category by default
    });
    if (existingObject) {
      existingObject.tasks.push(task);
      await existingObject.save();
    } else {
      await Task.create({
        category: request.body.category,
        tasks: [request.body.task],
      });
    }

    response.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get("/", async (request, response) => {
  try {
    const tasks = await Task.find({});
    response.status(200).json({
      tasks: tasks,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.put("/", async (request, response) => {
  const { category, newCategory, taskId, updatedTask } = request.body;
  try {
    //If category is not changed
    if (category === newCategory) {
      const targetObject = await Task.findOne({ category: category });
      if (targetObject) {
        // Find the index of the task with the given taskId
        const taskIndex = targetObject.tasks.findIndex((task) =>
          task._id.equals(taskId)
        );
        if (taskIndex !== -1) {
          // Update the task object at the found index
          targetObject.tasks[taskIndex] = updatedTask;
          await targetObject.save();
          response.status(200).json({ message: "Task updated successfully" });
        } else {
          response.status(404).json({ message: "Task not found" });
        }
      } else {
        response.status(404).json({ message: "Category not found" });
      }
    } else {
      await Task.findOneAndUpdate(
        {
          category: newCategory,
        },
        {
          $push: { tasks: updatedTask },
        }
      );
      // Remove task from the old category
      await Task.findOneAndUpdate(
        { category: category },
        { $pull: { tasks: { _id: taskId } } }
      );
      response
        .status(200)
        .json({ message: "Task moved and updated successfully" });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.put("/assign", async (request, response) => {
  const { category, taskId, newAssignee } = request.body;

  try {
    const targetObject = await Task.findOne({ category: category });

    if (!targetObject) {
      return response.status(404).json({ message: "Category not found" });
    }

    const taskToUpdateIndex = targetObject.tasks.findIndex((task) =>
      task._id.equals(taskId)
    );

    if (taskToUpdateIndex === -1) {
      return response.status(404).json({ message: "Task not found" });
    }

    // Update the task's assigned_to field
    targetObject.tasks[taskToUpdateIndex].assigned_to = newAssignee;

    await targetObject.save();

    response.status(200).json({
      message: "Task updated successfully",
      updatedTask: targetObject.tasks[taskToUpdateIndex],
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.delete("/", async (request, response) => {
  const { category, taskId } = request.query;
  try {
    // Check if taskId is provided
    if (!taskId) {
      return response.status(400).json({ message: "Task ID is required" });
    }
    const deletedTask = await Task.findOneAndUpdate(
      { category: category },
      { $pull: { tasks: { _id: taskId } } },
      { new: true } // Returns the updated document
    );

    if (!deletedTask) {
      return response.status(404).json({ message: "Task not found" });
    }

    response.status(200).json({ deletedTask: deletedTask });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

module.exports = router;
