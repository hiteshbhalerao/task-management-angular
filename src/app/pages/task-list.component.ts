import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskPriority, TaskStatus } from '../models/task.model';
import { TaskStoreService } from '../state/task-store.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  readonly store = inject(TaskStoreService);
  readonly query = signal('');
  readonly status = signal<'all' | TaskStatus>('all');
  readonly priority = signal<'all' | TaskPriority>('all');
  readonly filteredTasks = computed(() => {
    const search = this.query().trim().toLocaleLowerCase();
    return this.store.tasks().filter((task) =>
      (!search || task.title.toLocaleLowerCase().includes(search)) &&
      (this.status() === 'all' || task.status === this.status()) &&
      (this.priority() === 'all' || task.priority === this.priority())
    );
  });

  statusLabel(status: TaskStatus): string { return status === 'todo' ? 'To do' : status === 'in-progress' ? 'In progress' : 'Completed'; }
  formatDate(value: string): string { return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`)); }
  remove(id: string, title: string): void {
    if (globalThis.confirm(`Delete “${title}”? This action cannot be undone.`)) void this.store.delete(id);
  }
}
