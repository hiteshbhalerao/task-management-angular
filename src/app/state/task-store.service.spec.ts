import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TaskApiService } from '../data/task-api.service';
import { Task } from '../models/task.model';
import { TaskStoreService } from './task-store.service';

describe('TaskStoreService', () => {
  const sample: Task = { id: 'a', title: 'Write brief', status: 'todo', priority: 'high', dueDate: '2020-01-01' };
  let api: jasmine.SpyObj<TaskApiService>;
  let store: TaskStoreService;

  beforeEach(() => {
    api = jasmine.createSpyObj<TaskApiService>('TaskApiService', ['getTasks', 'createTask', 'updateTask', 'deleteTask']);
    TestBed.configureTestingModule({ providers: [TaskStoreService, { provide: TaskApiService, useValue: api }] });
    store = TestBed.inject(TaskStoreService);
  });

  it('loads tasks and derives dashboard counts and overdue state', async () => {
    api.getTasks.and.returnValue(of([sample]));
    await store.load();
    expect(store.tasks()).toEqual([sample]);
    expect(store.total()).toBe(1);
    expect(store.overdue()).toBe(1);
  });

  it('keeps the user informed when the API load fails', async () => {
    api.getTasks.and.returnValue(throwError(() => new Error('Offline')));
    await store.load();
    expect(store.error()).toBe('Offline');
    expect(store.loading()).toBeFalse();
  });
});
