import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { Task, TaskInput } from '../models/task.model';
import { TaskApiService } from '../data/task-api.service';

@Injectable({ providedIn: 'root' })
export class TaskStoreService {
  private readonly taskState = signal<readonly Task[]>([]);
  readonly tasks = this.taskState.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly total = computed(() => this.tasks().length);
  readonly completed = computed(() => this.tasks().filter((task) => task.status === 'completed').length);
  readonly inProgress = computed(() => this.tasks().filter((task) => task.status === 'in-progress').length);
  readonly overdue = computed(() => this.tasks().filter((task) => this.isOverdue(task)).length);

  constructor(private readonly api: TaskApiService) {}

  async load(): Promise<void> {
    if (this.tasks().length > 0) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const tasks = await firstValueFrom(this.api.getTasks().pipe(catchError((error: unknown) => {
        this.error.set(this.message(error, 'Tasks could not be loaded.'));
        return throwError(() => error);
      })));
      this.taskState.set([...tasks]);
    } catch {}
    finally { this.loading.set(false); }
  }

  find(id: string): Task | undefined { return this.tasks().find((task) => task.id === id); }

  async create(input: TaskInput): Promise<boolean> {
    return this.mutate(this.api.createTask(input), (task) => this.taskState.update((tasks) => [...tasks, task]), 'Task created successfully.');
  }

  async update(id: string, input: TaskInput): Promise<boolean> {
    return this.mutate(this.api.updateTask(id, input), (task) => this.taskState.update((tasks) => tasks.map((item) => item.id === id ? task : item)), 'Task updated successfully.');
  }

  async delete(id: string): Promise<boolean> {
    return this.mutate(this.api.deleteTask(id), () => this.taskState.update((tasks) => tasks.filter((task) => task.id !== id)), 'Task deleted successfully.');
  }

  dismissFeedback(): void { this.notice.set(null); this.error.set(null); }

  isOverdue(task: Task, today = new Date().toISOString().slice(0, 10)): boolean {
    return task.status !== 'completed' && task.dueDate < today;
  }

  private async mutate<T>(operation: Observable<T>, commit: (value: T) => void, success: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);
    this.notice.set(null);
    try {
      const value = await firstValueFrom(operation);
      commit(value);
      this.notice.set(success);
      return true;
    } catch (error) {
      this.error.set(this.message(error, 'Something went wrong. Please try again.'));
      return false;
    } finally { this.loading.set(false); }
  }

  private message(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
  }
}
