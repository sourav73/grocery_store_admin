import { Component } from '@angular/core';
import { HeadingComponent } from '../../common/heading/heading.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [HeadingComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {}
