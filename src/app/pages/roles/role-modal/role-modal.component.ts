import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RoleService } from '../role.service';
import { Role } from '../role-type';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  providers: [],
  templateUrl: './role-modal.component.html',
  styleUrl: './role-modal.component.scss',
})
export class RoleModalComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  roleService = inject(RoleService);
  toastrService = inject(ToastrService);
  roleName: string = '';
  ngUnsubscribe$ = new Subject<void>();
  @Input() role: Role | null = null;
  @Output() roleAddSuccesEmit: EventEmitter<boolean> = new EventEmitter();
  ngOnInit(): void {
    if (this.role) {
      this.roleName = this.role.roleName;
    }
  }
  closeModal() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    if (this.role) {
      this.roleService
        .updateRole(this.role.id, this.roleName)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          if (res.data) {
            this.roleAddSuccesEmit.emit(true);
            this.bsModalRef.hide();
            this.toastrService.success('Role updated successfully');
          } else {
            this.toastrService.error('Role updating failed!');
          }
        });
    } else {
      this.roleService
        .addRole(this.roleName)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          if (res.data) {
            this.roleAddSuccesEmit.emit(true);
            this.bsModalRef.hide();
            this.toastrService.success('Role added successfully');
          } else {
            this.toastrService.error('Role adding failed!');
          }
        });
    }
  }
}
