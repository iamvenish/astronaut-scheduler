// Observer Interface
interface Observer {
  update(task: Task): void;
}

// Task class to store task details
class Task {
  description: string;
  startTime: Date;
  endTime: Date;
  priority: string;

  constructor(
    description: string,
    startTime: string,
    endTime: string,
    priority: string
  ) {
    this.description = description;
    this.startTime = new Date(`1970-01-01T${startTime}:00Z`);
    this.endTime = new Date(`1970-01-01T${endTime}:00Z`);
    this.priority = priority;
  }

  public toString(): string {
    return `${this.startTime.getUTCHours()}:${this.startTime.getUTCMinutes()} - ${this.endTime.getUTCHours()}:${this.endTime.getUTCMinutes()}: ${
      this.description
    } [${this.priority}]`;
  }
}

// TaskFactory class to create task objects
class TaskFactory {
  public static createTask(
    description: string,
    startTime: string,
    endTime: string,
    priority: string
  ): Task {
    return new Task(description, startTime, endTime, priority);
  }
}

// Singleton ScheduleManager class
class ScheduleManager implements Observer {
  private static instance: ScheduleManager;
  private tasks: Task[];

  private constructor() {
    this.tasks = [];
  }

  public static getInstance(): ScheduleManager {
    if (!ScheduleManager.instance) {
      ScheduleManager.instance = new ScheduleManager();
    }
    return ScheduleManager.instance;
  }

  public addTask(task: Task): void {
    if (this.checkConflict(task)) {
      console.log(
        `Error: Task '${task.description}' conflicts with existing tasks.`
      );
      return;
    }
    this.tasks.push(task);
    console.log(`Task '${task.description}' added successfully.`);
    this.notify(task);
  }

  public removeTask(description: string): void {
    const taskIndex = this.tasks.findIndex(
      (task) => task.description === description
    );
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      console.log(`Task '${description}' removed successfully.`);
    } else {
      console.log(`Error: Task '${description}' not found.`);
    }
  }

  public editTask(
    oldDescription: string,
    newDescription?: string,
    startTime?: string,
    endTime?: string,
    priority?: string
  ): void {
    const task = this.tasks.find((task) => task.description === oldDescription);
    if (task) {
      task.description = newDescription || task.description;
      task.startTime = startTime
        ? new Date(`1970-01-01T${startTime}:00Z`)
        : task.startTime;
      task.endTime = endTime
        ? new Date(`1970-01-01T${endTime}:00Z`)
        : task.endTime;
      task.priority = priority || task.priority;
      console.log(`Task '${oldDescription}' updated successfully.`);
    } else {
      console.log(`Error: Task '${oldDescription}' not found.`);
    }
  }

  public markTaskCompleted(description: string): void {
    this.removeTask(description);
    console.log(`Task '${description}' marked as completed and removed.`);
  }

  public viewTasks(priorityFilter?: string): void {
    if (this.tasks.length === 0) {
      console.log("No tasks scheduled for the day.");
      return;
    }

    let tasksToView = this.tasks;

    if (priorityFilter) {
      tasksToView = tasksToView.filter(
        (task) => task.priority === priorityFilter
      );
    }

    tasksToView.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    tasksToView.forEach((task) => {
      console.log(task.toString());
    });
  }

  private checkConflict(newTask: Task): boolean {
    return this.tasks.some((task) => {
      return (
        task.startTime < newTask.endTime && newTask.startTime < task.endTime
      );
    });
  }

  public notify(task: Task): void {
    this.update(task);
  }

  public update(task: Task): void {
    if (this.checkConflict(task)) {
      console.log(`Conflict detected for task: ${task.description}`);
    }
  }
}

// Example usage
const manager = ScheduleManager.getInstance();
const factory = TaskFactory;

// Adding tasks
const task1 = factory.createTask("Morning Exercise", "07:00", "08:00", "High");
manager.addTask(task1);

const task2 = factory.createTask("Team Meeting", "09:00", "10:00", "Medium");
manager.addTask(task2);

const task3 = factory.createTask("Lunch Break", "12:00", "13:00", "Low");
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
const task4 = factory.createTask("Training Session", "09:30", "10:30", "High");
manager.addTask(task4);

// Edit a task
manager.editTask("Lunch Break", "Afternoon Break", "14:00", "15:00", "Medium");

// View final tasks
console.log("\nFinal Tasks:");
manager.viewTasks();
