import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskFormComponent } from './task-form.component';
import { TaskStoreService } from '../state/task-store.service';

describe('TaskFormComponent', () => {
  it('requires a three-character title and a due date', () => {
    TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: TaskStoreService, useValue: {} }
      ]
    });
    const component = TestBed.createComponent(TaskFormComponent).componentInstance;
    expect(component.form.invalid).toBeTrue();
    component.form.controls.title.setValue('ab');
    component.form.controls.dueDate.setValue('2030-01-01');
    expect(component.form.controls.title.hasError('minlength')).toBeTrue();
    component.form.controls.title.setValue('A useful task');
    expect(component.form.valid).toBeTrue();
  });
});
