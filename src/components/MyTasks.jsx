import React, { useState, useEffect } from "react";
import { Button, TextField, List, ListItem, ListItemText, IconButton, MenuItem, Select, FormControl, Checkbox } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Countdown from "./Timer";
import { BASE_URL } from "../constants";
import bgImage from "../assets/bg.jpg";

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        deadline: "",
        priority: "Medium",
    });

    const [rawTasks, setRawTasks] = useState([]);

    const [filters, setFilters] = useState({
        searchQuery: "",
        priority: "",
        sortBy: "",
    });

    // Fetch tasks from API on mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${BASE_URL}/todos`);
                if (!response.ok) throw new Error("Failed to fetch tasks");
                let data = await response.json();
                setTasks(data);
                setRawTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    // Handle input change for both taskData & filters
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name]: value }));
    };

    // Add a new task
    const handleAddTask = async () => {
        if (!taskData.title.trim() || !taskData.deadline || !taskData.priority) {
            toast.error("Please fill all the fields!");
            return;
        }

        const newTask = {
            ...taskData,
            createdAt: new Date(),
            deadline: new Date(taskData.deadline),
            priority: taskData.priority === "High" ? 3 : taskData.priority === "Medium" ? 2 : 1,
            is_completed: false,
        };

        try {
            const response = await fetch(`${BASE_URL}/todo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Error adding task");

            const data = await response.json();
            setTasks((prev) => [...prev, data]);
            setTaskData({ title: "", description: "", deadline: "", priority: "Medium" });
            toast.success("Task added successfully!");
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Failed to add task!");
        }
    };

    // Toggle task completion
    const handleToggleTask = async (id) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        try {
            const response = await fetch(`${BASE_URL}/todo/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...task, is_completed: !task.is_completed }),
            });

            if (!response.ok) throw new Error("Error updating task");

            setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t)));
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    // Delete task
    const handleDeleteTask = async (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));

        try {
            const response = await fetch(`${BASE_URL}/todo/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error deleting task");
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Filter and sort tasks
    const filteredTasks = tasks
        .filter(
            (task) =>
                task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
                (filters.priority ? task.priority === filters.priority : true)
        )
        .sort((a, b) => {
            if (filters.sortBy === "creation") return new Date(a.created_at) - new Date(b.created_at);
            if (filters.sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
            if (filters.sortBy === "priority") return a.priority - b.priority;
            return 0;
        });

    // sorting
    const handleSorting = (event) => {
        const { name, value } = event.target;
        console.log(name, value);

        if (name === "sortBy") {
            setFilters((prevFilters) => {
                const sortedTasks = [...tasks].sort((a, b) => {
                    if (value === "creation") return new Date(a.created_at) - new Date(b.created_at);
                    if (value === "deadline") return new Date(a.deadline) - new Date(b.deadline);
                    if (value === "priority") {
                        return Number(b.priority) - Number(a.priority);  // Sorting in descending order for priority (3 is high)
                    }
                });

                if (value === "none") {
                    setTasks(rawTasks);
                    console.log("rawTasks", rawTasks);
                } else {
                    setTasks(sortedTasks);
                }

                return { ...prevFilters, [name]: value };
            });
        }

    };


    return (
        <div>
            <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}></div>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable theme="colored" />
            <div className="flex flex-row mx-auto max-w-lg justify-center z-10">
                <img src="https://static-00.iconduck.com/assets.00/todo-icon-2048x2048-m7wp6prw.png" alt="" className="mt-4 w-5 h-5 top-[6px] relative mr-3" />
                <h1 className="text-center text-2xl font-bold mt-4 z-10">
                    My Todo List
                </h1>
            </div>
            <div className="mt-8 p-6 mx-auto max-w-lg bg-gray-100 rounded-lg shadow-md bg-white/30 backdrop-blur-sm shadow-lg">
                {/* Task Input Form */}
                <div className="gap-3 flex flex-col mb-4">
                    <TextField fullWidth label="Add a task" variant="outlined" name="title" value={taskData.title} onChange={handleInputChange} />
                    <TextField fullWidth label="Description" variant="outlined" name="description" value={taskData.description} onChange={handleInputChange} />
                    <TextField fullWidth type="datetime-local" label="Deadline" variant="outlined" name="deadline" value={taskData.deadline} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                    <FormControl fullWidth>
                        <Select name="priority" value={taskData.priority} onChange={handleInputChange} displayEmpty>
                            <MenuItem value="" disabled> Priority </MenuItem>
                            <MenuItem value="High">High Priority</MenuItem>
                            <MenuItem value="Medium">Medium Priority</MenuItem>
                            <MenuItem value="Low">Low Priority</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleAddTask} className="text-white" style={{ backgroundColor: "#41ac95" }}>
                        Add Task
                    </Button>
                </div>

                {/* Search & Filters */}
                <div className="gap-3 flex flex-col mb-4">
                    <div>
                        Sort Tasks:
                    </div>
                    <FormControl fullWidth>
                        <Select name="sortBy" value={filters.sortBy} onChange={handleSorting} displayEmpty>
                            <MenuItem value="" disabled>
                                Sort by Criteria
                            </MenuItem>
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="creation">Creation Time</MenuItem>
                            <MenuItem value="deadline">Deadline</MenuItem>
                            <MenuItem value="priority">Priority</MenuItem>
                        </Select>
                    </FormControl>
                    <div>
                        Search Tasks:
                    </div>
                    <TextField fullWidth label="Search Task" variant="outlined" name="searchQuery" value={filters.searchQuery} onChange={
                        (e) => setFilters((prevFilters) => ({ ...prevFilters, searchQuery: e.target.value }))
                    } />
                </div>

                {/* Task List */}
                <List>
                    {filteredTasks.map(({ id, title, description, created_at, deadline, priority, is_completed }) => (
                        <ListItem
                            title={description}
                            key={id}
                            className={`p-2 mb-1 flex items-center justify-between rounded-md shadow-sm border ${is_completed ? "bg-green-100" : "bg-white"}`}
                        >
                            {/* Left Side: Task Title & Priority */}
                            <div className="flex items-center gap-3 w-full">
                                <Checkbox checked={is_completed} onChange={() => handleToggleTask(id)} color="success" size="small" />
                                <div>
                                    <span className="text-lg font-medium">{title}</span>
                                    <br />
                                    <span className="text-xs text-gray-500">
                                        {
                                            description.length > 15
                                                ? `${description.slice(0, 15)}...`
                                                : description
                                        }
                                    </span>
                                    <div className="text-xs text-gray-500">
                                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" }).format(new Date(deadline))}
                                        <br />
                                        <span className={`font-semibold ${priority === 3 ? "text-red-500" : priority === 2 ? "text-yellow-500" : "text-green-500"}`}>
                                            {priority === 3 ? "High" : priority === 2 ? "Medium" : "Low"} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Actions */}
                            <div className="flex items-center gap-2">
                                {!is_completed && <Countdown deadline={deadline} />}
                                <IconButton color="error" onClick={() => handleDeleteTask(id)} size="small" title="Delete Task">
                                    <Close fontSize="small" />
                                </IconButton>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default MyTasks;