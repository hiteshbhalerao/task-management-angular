import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { TaskListComponent } from './task-list.component';
import { TaskStoreService } from '../state/task-store.service';
import { Task } from '../models/task.model';

describe('TaskListComponent', () => {
  it('filters tasks by title and status', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Write proposal', status: 'todo', priority: 'high', dueDate: '2030-01-01' },
      { id: '2', title: 'Review notes', status: 'completed', priority: 'low', dueDate: '2030-01-01' }
    ];
    const store = { tasks: signal<readonly Task[]>(tasks), total: signal(2), completed: signal(1), inProgress: signal(0), overdue: signal(0), loading: signal(false), isOverdue: () => false };
    TestBed.configureTestingModule({ imports: [TaskListComponent, RouterTestingModule], providers: [{ provide: TaskStoreService, useValue: store }] });
    const fixture = TestBed.createComponent(TaskListComponent);
    const component = fixture.componentInstance;
    component.query.set('proposal');
    expect(component.filteredTasks().map((task) => task.id)).toEqual(['1']);
    component.query.set('');
    component.status.set('completed');
    expect(component.filteredTasks().map((task) => task.id)).toEqual(['2']);
  });
});
