import { Button } from "@mui/material";
import "./TasksSections.css";

const TasksSections = ({ newTasks, handleDialogOps }) => {
  const titleColors = ["gray", "orange", "green", "blue"];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  return (
    <div className="allTasksCategories">
      {newTasks.map((each, i) => {
        return (
          <div key={each._id} className="eachTasksSection">
            <p className={`${titleColors[i]} cardTitle`}>{each.category}</p>
            {each.tasks.length > 0 ? (
              each.tasks.map((task) => (
                <div key={task._id} className="eachTaskContainer">
                  <div className="taskNameAndPriority">
                    <p className="tasksName">{task.task_name}</p>
                    <p className="priority">{task.priority}</p>
                  </div>
                  <p className="description">{task.description}</p>
                  <p className="assignee">Assignee: {task.assigned_to}</p>
                  <div className="editAndDelete">
                    <Button
                      variant="contained"
                      className="options"
                      onClick={() =>
                        handleDialogOps("edit", task, each.category)
                      }
                    >
                      Edit
                    </Button>
                    {each.category !== "Completed" && (
                      <Button
                        variant="contained"
                        className="options"
                        onClick={() =>
                          handleDialogOps("delete", task, each.category)
                        }
                      >
                        Delete
                      </Button>
                    )}
                    {each.category === "Pending" && !task.assigned_to && (
                      <Button
                        variant="contained"
                        className="options"
                        onClick={() =>
                          handleDialogOps("assign", task, each.category)
                        }
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                  <p className="createdDate">
                    Created on: {formatDate(each.createdAt)}
                  </p>
                  {each.category === "Completed" && (
                    <p className="createdDate">
                      Ended on: {formatDate(each.updatedAt)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="noTaskText">No tasks {each.category} yet</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TasksSections;
