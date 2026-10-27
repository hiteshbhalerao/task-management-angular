import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskInput } from '../models/task.model';
import { TaskStoreService } from '../state/task-store.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(TaskStoreService);
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['todo' as TaskInput['status'], Validators.required],
    priority: ['medium' as TaskInput['priority'], Validators.required],
    dueDate: ['', Validators.required]
  });
  editing = false;
  missingTask = false;
  saving = false;
  private taskId: string | null = null;

  ngOnInit(): void { void this.initialize(); }

  private async initialize(): Promise<void> {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.editing = this.taskId !== null;
    if (this.taskId) {
      await this.store.load();
      const task = this.store.find(this.taskId);
      if (!task) { this.missingTask = true; return; }
      this.form.setValue({ title: task.title, description: task.description ?? '', status: task.status, priority: task.priority, dueDate: task.dueDate });
    }
  }

  showError(field: 'title' | 'status' | 'priority' | 'dueDate'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.formSubmitted);
  }

  private formSubmitted = false;
  async save(): Promise<void> {
    this.formSubmitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    const input: TaskInput = this.form.getRawValue();
    const success = this.taskId ? await this.store.update(this.taskId, input) : await this.store.create(input);
    this.saving = false;
    if (success) await this.router.navigate(['/tasks']);
  }
}
