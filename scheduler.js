// Task class to store task details
var Task = /** @class */ (function () {
    function Task(description, startTime, endTime, priority) {
        this.description = description;
        this.startTime = new Date("1970-01-01T".concat(startTime, ":00Z"));
        this.endTime = new Date("1970-01-01T".concat(endTime, ":00Z"));
        this.priority = priority;
    }
    Task.prototype.toString = function () {
        return "".concat(this.startTime.getUTCHours(), ":").concat(this.startTime.getUTCMinutes(), " - ").concat(this.endTime.getUTCHours(), ":").concat(this.endTime.getUTCMinutes(), ": ").concat(this.description, " [").concat(this.priority, "]");
    };
    return Task;
}());
// TaskFactory class to create task objects
var TaskFactory = /** @class */ (function () {
    function TaskFactory() {
    }
    TaskFactory.createTask = function (description, startTime, endTime, priority) {
        return new Task(description, startTime, endTime, priority);
    };
    return TaskFactory;
}());
// Singleton ScheduleManager class
var ScheduleManager = /** @class */ (function () {
    function ScheduleManager() {
        this.tasks = [];
    }
    ScheduleManager.getInstance = function () {
        if (!ScheduleManager.instance) {
            ScheduleManager.instance = new ScheduleManager();
        }
        return ScheduleManager.instance;
    };
    ScheduleManager.prototype.addTask = function (task) {
        if (this.checkConflict(task)) {
            console.log("Error: Task '".concat(task.description, "' conflicts with existing tasks."));
            return;
        }
        this.tasks.push(task);
        console.log("Task '".concat(task.description, "' added successfully."));
        this.notify(task);
    };
    ScheduleManager.prototype.removeTask = function (description) {
        var taskIndex = this.tasks.findIndex(function (task) { return task.description === description; });
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            console.log("Task '".concat(description, "' removed successfully."));
        }
        else {
            console.log("Error: Task '".concat(description, "' not found."));
        }
    };
    ScheduleManager.prototype.editTask = function (oldDescription, newDescription, startTime, endTime, priority) {
        var task = this.tasks.find(function (task) { return task.description === oldDescription; });
        if (task) {
            task.description = newDescription || task.description;
            task.startTime = startTime
                ? new Date("1970-01-01T".concat(startTime, ":00Z"))
                : task.startTime;
            task.endTime = endTime
                ? new Date("1970-01-01T".concat(endTime, ":00Z"))
                : task.endTime;
            task.priority = priority || task.priority;
            console.log("Task '".concat(oldDescription, "' updated successfully."));
        }
        else {
            console.log("Error: Task '".concat(oldDescription, "' not found."));
        }
    };
    ScheduleManager.prototype.markTaskCompleted = function (description) {
        this.removeTask(description);
        console.log("Task '".concat(description, "' marked as completed and removed."));
    };
    ScheduleManager.prototype.viewTasks = function (priorityFilter) {
        if (this.tasks.length === 0) {
            console.log("No tasks scheduled for the day.");
            return;
        }
        var tasksToView = this.tasks;
        if (priorityFilter) {
            tasksToView = tasksToView.filter(function (task) { return task.priority === priorityFilter; });
        }
        tasksToView.sort(function (a, b) { return a.startTime.getTime() - b.startTime.getTime(); });
        tasksToView.forEach(function (task) {
            console.log(task.toString());
        });
    };
    ScheduleManager.prototype.checkConflict = function (newTask) {
        return this.tasks.some(function (task) {
            return (task.startTime < newTask.endTime && newTask.startTime < task.endTime);
        });
    };
    ScheduleManager.prototype.notify = function (task) {
        this.update(task);
    };
    ScheduleManager.prototype.update = function (task) {
        if (this.checkConflict(task)) {
            console.log("Conflict detected for task: ".concat(task.description));
        }
    };
    return ScheduleManager;
}());
// Example usage
var manager = ScheduleManager.getInstance();
var factory = TaskFactory;
// Adding tasks
var task1 = factory.createTask("Morning Exercise", "07:00", "08:00", "High");
manager.addTask(task1);
var task2 = factory.createTask("Team Meeting", "09:00", "10:00", "Medium");
manager.addTask(task2);
var task3 = factory.createTask("Lunch Break", "12:00", "13:00", "Low");
manager.addTask(task3);
// View all tasks
console.log("\nScheduled Tasks:");
manager.viewTasks();
// Remove a task
manager.removeTask("Morning Exercise");
// View updated tasks
console.log("\nUpdated Tasks:");
manager.viewTasks();
// Mark a task as completed
manager.markTaskCompleted("Team Meeting");
// View tasks by priority
console.log("\nTasks with Low Priority:");
manager.viewTasks("Low");
// Trying to add a conflicting task
var task4 = factory.createTask("Training Session", "09:30", "10:30", "High");
manager.addTask(task4);
// Edit a task
manager.editTask("Lunch Break", "Afternoon Break", "14:00", "15:00", "Medium");
// View final tasks
console.log("\nFinal Tasks:");
manager.viewTasks();
