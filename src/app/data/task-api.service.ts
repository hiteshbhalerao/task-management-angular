import { Injectable } from '@angular/core';
import { Observable, defer, delay, of, throwError } from 'rxjs';
import { Task, TaskInput } from '../models/task.model';

const STORAGE_KEY = 'taskflow.tasks.v1';
const SEED_TASKS: readonly Task[] = [
  { id: 'task-1', title: 'Prepare quarterly roadmap', description: 'Align milestones with the product and engineering teams.', status: 'in-progress', priority: 'high', dueDate: '2026-10-29' },
  { id: 'task-2', title: 'Review onboarding flow', description: 'Collect feedback and identify friction in the first session.', status: 'todo', priority: 'medium', dueDate: '2026-11-02' },
  { id: 'task-3', title: 'Update component library', description: 'Document the new form and navigation patterns.', status: 'completed', priority: 'low', dueDate: '2026-10-20' },
  { id: 'task-4', title: 'Plan customer interviews', description: 'Schedule five conversations for next sprint.', status: 'todo', priority: 'high', dueDate: '2026-10-24' }
];

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly latencyMs = 180;

  getTasks(): Observable<readonly Task[]> {
    return defer(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
          this.persist(SEED_TASKS);
          return of(SEED_TASKS);
        }
        return of(this.parseTasks(stored));
      } catch {
        return throwError(() => new Error('Tasks could not be loaded from local storage.'));
      }
    }).pipe(delay(this.latencyMs));
  }

  createTask(input: TaskInput): Observable<Task> {
    return defer(() => {
      try {
        const task: Task = { ...input, id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}` };
        this.persist([...this.readStored(), task]);
        return of(task);
      } catch {
        return throwError(() => new Error('The task could not be saved. Please try again.'));
      }
    }).pipe(delay(this.latencyMs));
  }

  updateTask(id: string, input: TaskInput): Observable<Task> {
    return defer(() => {
      try {
        const tasks = this.readStored();
        if (!tasks.some((task) => task.id === id)) return throwError(() => new Error('Task not found.'));
        const updated: Task = { ...input, id };
        this.persist(tasks.map((task) => task.id === id ? updated : task));
        return of(updated);
      } catch (error) {
        return throwError(() => error instanceof Error ? error : new Error('The task could not be updated.'));
      }
    }).pipe(delay(this.latencyMs));
  }

  deleteTask(id: string): Observable<void> {
    return defer(() => {
      try {
        const tasks = this.readStored();
        if (!tasks.some((task) => task.id === id)) return throwError(() => new Error('Task not found.'));
        this.persist(tasks.filter((task) => task.id !== id));
        return of(void 0);
      } catch (error) {
        return throwError(() => error instanceof Error ? error : new Error('The task could not be deleted.'));
      }
    }).pipe(delay(this.latencyMs));
  }

  private readStored(): readonly Task[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? SEED_TASKS : this.parseTasks(raw);
  }

  private parseTasks(raw: string): readonly Task[] {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) throw new Error('Stored task data is invalid.');
    return value as readonly Task[];
  }

  private persist(tasks: readonly Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}
