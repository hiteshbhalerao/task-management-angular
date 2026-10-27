export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly dueDate: string;
}

export type TaskInput = Omit<Task, 'id'>;
export type StatusFilter = TaskStatus | 'all';
export type PriorityFilter = TaskPriority | 'all';
