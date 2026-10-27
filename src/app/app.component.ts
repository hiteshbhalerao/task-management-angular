import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TaskStoreService } from './state/task-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  readonly store = inject(TaskStoreService);
  readonly todayLabel = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
  ngOnInit(): void { void this.store.load(); }
}
