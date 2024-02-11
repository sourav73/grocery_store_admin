import { Component } from '@angular/core';
import { HeadingComponent } from '../../common/heading/heading.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeadingComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {}
