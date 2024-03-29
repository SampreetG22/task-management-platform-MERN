import React, { useState } from "react";
import "./TaskBoard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TasksSections from "../TasksSections/TasksSections";
import Dialogs from "../Dialogs/Dialogs";
import { Alert, Button, Snackbar } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

const TaskBoard = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [newTasks, setNewTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogType, setDialogType] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [snackBar, setSnackBar] = useState({
    open: false,
    color: "",
    message: "",
  });
  const [sortBy, setSortBy] = useState("Priority");

  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => {
    const filteredList = newTasks.map((status) => {
      return {
        ...status,
        tasks: status.tasks.filter(
          (task) =>
            task.assigned_to.toLowerCase().includes(nameFilter.toLowerCase()) &&
            task.priority
              .toLowerCase()
              .includes(priorityFilter.toLowerCase()) &&
            status.category
              .toLowerCase()
              .includes(categoryFilter.toLowerCase()) && // Filter by category
            (!fromDate ||
              !toDate ||
              (status.createdAt >= fromDate && status.updatedAt <= toDate))
        ),
      };
    });
    setFilteredTasks(filteredList);
  }, [nameFilter, priorityFilter, categoryFilter, fromDate, toDate]);

  useEffect(() => {
    const sortedList = newTasks.map((status) => {
      let sortedTasks = [...status.tasks];

      if (sortBy === "Priority") {
        sortedTasks.sort((a, b) => {
          const priorityOrder = { P0: 0, P1: 1, P2: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      } else if (sortBy === "Category") {
        sortedTasks.sort((a, b) => a.category.localeCompare(b.category));
      }

      return { ...status, tasks: sortedTasks };
    });
    setFilteredTasks(sortedList);
  }, [sortBy]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
    setToDate("");
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handleDialogOps = (value, task, category) => {
    setCurrentCategory(category);
    setSelectedTask(task);
    setShowDialog(true);
    if (value === "edit") {
      setDialogType("edit");
    } else if (value === "assign") {
      setDialogType("assign");
    } else if (value === "delete") {
      setDialogType("delete");
    } else if (value === "add") {
      setDialogType("add");
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  //All CRUD Operations for tasks
  const getAllTasks = () => {
    axios({
      method: "GET",
      url: "http://localhost:8080/api/task",
    })
      .then((response) => {
        setNewTasks(response.data.tasks);
        setFilteredTasks(response.data.tasks);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createTask = (taskToCreate) => {
    const body = {
      task: taskToCreate,
    };
    axios({
      method: "POST",
      url: "http://localhost:8080/api/task",
      data: body,
    })
      .then(() => {
        getAllTasks();
        setSnackBar({
          open: true,
          color: "success",
          message: "Task created successfully",
        });
      })
      .catch((error) => {
        setSnackBar({
          open: true,
          color: "error",
          message: error.message,
        });
      });
    setShowDialog(false);
  };

  const editTask = (updatedTask, newCategory) => {
    const body = {
      category: currentCategory,
      newCategory: newCategory,
      taskId: selectedTask._id,
      updatedTask: updatedTask,
    };
    //To check if at least one field is updated and avoid unnecessary API call
    const tasksAreDifferent =
      selectedTask.task_name !== updatedTask.task_name ||
      selectedTask.description !== updatedTask.description ||
      selectedTask.priority !== updatedTask.priority ||
      selectedTask.assigned_to !== updatedTask.assigned_to ||
      currentCategory !== newCategory;

    if (tasksAreDifferent) {
      axios({
        method: "PUT",
        url: "http://localhost:8080/api/task",
        data: body,
      })
        .then(() => {
          getAllTasks();
          setSnackBar({
            open: true,
            color: "success",
            message: "Task updated successfully",
          });
        })
        .catch((error) => {
          setSnackBar({
            open: true,
            color: "error",
            message: error.message,
          });
        });
      setShowDialog(false);
    } else {
      setShowDialog(true);
      setSnackBar({
        open: true,
        color: "warning",
        message: "Please update at least one field",
      });
    }
  };

  const assignPendingTask = (newAssignee) => {
    if (newAssignee !== "") {
      axios({
        method: "PUT",
        url: "http://localhost:8080/api/task/assign",
        data: {
          category: currentCategory,
          newAssignee: newAssignee,
          taskId: selectedTask._id,
        },
      })
        .then(() => {
          getAllTasks();
          setSnackBar({
            open: true,
            color: "success",
            message: "Task assigned successfully",
          });
        })
        .catch((error) => {
          setSnackBar({
            open: true,
            color: "error",
            message: error.message,
          });
        });
      setShowDialog(false);
    } else {
      setShowDialog(true);
      setSnackBar({
        open: true,
        color: "warning",
        message: "Please enter a name to assign the task",
      });
    }
  };

  const deleteTask = () => {
    axios({
      method: "DELETE",
      url: `http://localhost:8080/api/task?category=${currentCategory}&taskId=${selectedTask._id}`,
    })
      .then(() => {
        getAllTasks();
        setSnackBar({
          open: true,
          color: "success",
          message: "Task deleted successfully",
        });
      })
      .catch((error) => {
        setSnackBar({
          open: true,
          color: "error",
          message: error.message,
        });
      });
    setShowDialog(false);
  };

  return (
    <>
      <div className="mainContainer">
        <div className="nameAndUserContainer">
          <p className="mainTitle">Task Board</p>
          <img src="./user.png" alt="userLogo" className="userIcon" />
        </div>
        <div className="tasksContainer">
          <div className="filteringSections">
            <div
              style={{
                width: "50vw",
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <p className="filterByText">Filter By: </p>
              <input
                type="text"
                className="inputBox"
                placeholder="Assignee Name"
                value={nameFilter}
                onChange={(event) => setNameFilter(event.target.value)}
              />
              <select
                name="priority"
                id="priority"
                className="inputBox"
                required
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="" defaultValue>
                  Priority
                </option>
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>
              <select
                name="category"
                id="category"
                className="inputBox"
                required
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="" defaultValue>
                  Category
                </option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Deployed">Deployed</option>
              </select>
              <div className="dateContainer">
                <DatePicker
                  selected={fromDate}
                  onChange={handleFromDateChange}
                  className="inputBoxDates"
                  placeholderText="From Date"
                  dateFormat="dd/MM/yyyy"
                />

                <DatePicker
                  selected={toDate}
                  onChange={handleToDateChange}
                  className="inputBoxDates"
                  placeholderText="To Date"
                  dateFormat="dd/MM/yyyy"
                  minDate={fromDate}
                />
              </div>
              <p
                className="clearIcon"
                onClick={() => {
                  setNameFilter("");
                  setPriorityFilter("");
                  setCategoryFilter("");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Clear
              </p>
            </div>
            <Button
              variant="contained"
              className="addTaskButton"
              onClick={() => handleDialogOps("add")}
            >
              Add New Task
            </Button>
          </div>
          <div className="sortBySection">
            <p className="filterByText">Sort By: </p>
            <select
              name="priority"
              id="priority"
              className="inputBox"
              required
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="Priority" defaultValue>
                Priority
              </option>
              <option value="Start Date">Category</option>
            </select>
          </div>
          <TasksSections
            newTasks={filteredTasks}
            handleDialogOps={handleDialogOps}
          />
        </div>
        <Snackbar
          open={snackBar.open}
          autoHideDuration={4000}
          onClose={() => setSnackBar({ ...snackBar, open: false })}
        >
          <Alert
            onClose={() => setSnackBar({ ...snackBar, open: false })}
            severity={snackBar.color}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackBar.message}
          </Alert>
        </Snackbar>
      </div>
      {showDialog && (
        <Dialogs
          value={dialogType}
          task={selectedTask}
          category={currentCategory}
          closeDialog={closeDialog}
          addTask={createTask}
          editTask={editTask}
          assignPendingTask={assignPendingTask}
          deleteTask={deleteTask}
        />
      )}
    </>
  );
};

export default TaskBoard;
