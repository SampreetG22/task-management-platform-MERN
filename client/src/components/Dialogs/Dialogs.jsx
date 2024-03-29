import { Button, Dialog } from "@mui/material";
import React, { useState } from "react";
import "./Dialogs.css";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Dialogs = ({
  value,
  task,
  category,
  closeDialog,
  addTask,
  editTask,
  assignPendingTask,
  deleteTask,
}) => {
  const [newTaskDetails, setNewTaskDetails] = useState({
    task_name: "",
    description: "",
    assigned_to: "",
    priority: "",
  });

  const [editingTaskDetails, setEditingTaskDetails] = useState(
    //Because while adding we wont be sending any task props
    value !== "add" && {
      task_name: task.task_name,
      description: task.description,
      assigned_to: task.assigned_to,
      priority: task.priority,
    }
  );

  const [editingCategory, setEditingCategory] = useState(category);

  const [newAssignee, setNewAssignee] = useState("");

  const handleInputChange = (event, field) => {
    setNewTaskDetails({
      ...newTaskDetails,
      [field]: event.target.value,
    });
  };

  const handleInputEditing = (event, field) => {
    setEditingTaskDetails({
      ...editingTaskDetails,
      [field]: event.target.value,
    });
  };

  const getAddTaskDialog = () => {
    return (
      <Dialog
        open
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: "30vw",
            height: "100%",
            padding: "1vw 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <div className="headerAndClose">
          <h2 className="dialogHeader">CREATE TASK</h2>
          <HighlightOffIcon className="closeIcon" onClick={closeDialog} />
        </div>
        <div className="dialogContent">
          <p className="label" htmlFor="title">
            Title:
          </p>
          <input
            id="title"
            value={newTaskDetails.task_name}
            className="dialogInputs"
            onChange={(event) => handleInputChange(event, "task_name")}
          />
          <p className="label" htmlFor="description">
            Description:
          </p>
          <textarea
            rows={3.5}
            id="description"
            value={newTaskDetails.description}
            className="dialogInputs"
            onChange={(event) => handleInputChange(event, "description")}
          />
          <p className="label" htmlFor="assignee">
            Assignee:
          </p>
          <input
            id="assignee"
            value={newTaskDetails.assigned_to}
            className="dialogInputs"
            onChange={(event) => handleInputChange(event, "assigned_to")}
          />
          <label
            className="label"
            htmlFor="priority"
            style={{ marginTop: "1vw" }}
          >
            Priority:
          </label>
          <select
            name="priority"
            id="priority"
            className="dialogInputs"
            required
            onChange={(event) => handleInputChange(event, "priority")}
          >
            <option value="" defaultValue>
              Priority
            </option>
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
          </select>
        </div>
        <Button
          variant="contained"
          className="finalButtons"
          onClick={() => addTask(newTaskDetails)}
          style={{ marginTop: "1vw" }}
        >
          Create Task
        </Button>
      </Dialog>
    );
  };

  const getEditTaskDialog = () => {
    return (
      <Dialog
        open
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: "40vw",
            padding: "1vw 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <div className="headerAndClose">
          <h2 className="dialogHeader">EDIT TASK</h2>
          <HighlightOffIcon className="closeIcon" onClick={closeDialog} />
        </div>
        <div className="dialogContent">
          <p className="label" htmlFor="title">
            Title:
          </p>
          <input
            id="title"
            value={editingTaskDetails.task_name}
            className="dialogInputs"
            onChange={(event) => handleInputEditing(event, "task_name")}
          />
          <p className="label" htmlFor="description">
            Description:
          </p>
          <textarea
            rows={4}
            id="description"
            value={editingTaskDetails.description}
            className="dialogInputs"
            onChange={(event) => handleInputEditing(event, "description")}
          />
          <p className="label" htmlFor="assignee">
            Assignee:
          </p>
          <input
            id="assignee"
            value={editingTaskDetails.assigned_to}
            className="dialogInputs"
            onChange={(event) => handleInputEditing(event, "assigned_to")}
          />
          <div className="selectElementsContainer">
            <div
              style={{
                width: "10%",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                marginRight: "0.5vw",
              }}
            >
              <label className="label" htmlFor="priority">
                Priority:
              </label>
              <select
                name="priority"
                id="priority"
                className="dialogInputs"
                required
                value={editingTaskDetails.priority}
                onChange={(event) => handleInputEditing(event, "priority")}
              >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>
            </div>
            <div
              style={{
                width: "30%",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <label className="label" htmlFor="status">
                Category:
              </label>
              <select
                name="status"
                id="status"
                className="dialogInputs"
                required
                value={editingCategory}
                onChange={(event) => setEditingCategory(event.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Deployed">Deployed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="buttonContainer">
          <Button
            variant="contained"
            className="finalButtons"
            onClick={() => editTask(editingTaskDetails, editingCategory)}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            className="finalButtons"
            onClick={() => {
              setEditingTaskDetails({
                task_name: task.task_name,
                description: task.description,
                assigned_to: task.assigned_to,
                priority: task.priority,
              });
              setEditingCategory(category);
            }}
          >
            Reset
          </Button>
        </div>
      </Dialog>
    );
  };

  const getAssignDialog = () => {
    return (
      <Dialog
        open
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <div className="headerAndClose">
          <h2 className="dialogHeader">ASSIGN TASK</h2>
          <HighlightOffIcon className="closeIcon" onClick={closeDialog} />
        </div>
        <div className="dialogContent">
          <p className="label" htmlFor="title">
            Assignee:
          </p>
          <input
            id="title"
            value={newAssignee}
            className="dialogInputs"
            onChange={(event) => setNewAssignee(event.target.value)}
          />
          <div className="buttonContainer">
            <Button
              variant="contained"
              className="finalButtons"
              onClick={() => assignPendingTask(newAssignee)}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              className="finalButtons"
              onClick={closeDialog}
            >
              No
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };

  const getDeleteTaskDialog = () => {
    return (
      <Dialog
        open
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <div className="headerAndClose">
          <h2 className="dialogHeader">DELETE TASK</h2>
          <HighlightOffIcon className="closeIcon" onClick={closeDialog} />
        </div>
        <div className="dialogContent">
          <p>
            Do you wish to Delete Task <strong>{task.task_name}</strong>
          </p>
          <div className="buttonContainer">
            <Button
              variant="contained"
              className="finalButtons"
              onClick={deleteTask}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              className="finalButtons"
              onClick={closeDialog}
            >
              No
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };

  if (value === "edit") {
    return getEditTaskDialog();
  } else if (value === "assign") {
    return getAssignDialog();
  } else if (value === "delete") {
    return getDeleteTaskDialog();
  } else if (value === "add") {
    return getAddTaskDialog();
  }
};

export default Dialogs;
