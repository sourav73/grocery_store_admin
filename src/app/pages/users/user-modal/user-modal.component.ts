import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { User, UserInputDto } from '../user-type';
import { Role } from '../../roles/role-type';
import { RoleService } from '../../roles/role.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgSelectModule],
  providers: [ToastrService],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  userService = inject(UserService);
  roleService = inject(RoleService);
  toastrService = inject(ToastrService);
  @Input() user: User | null = null;
  @Output() saveSuccess: EventEmitter<void> = new EventEmitter();
  userForm: FormGroup = new FormGroup({});
  users: User[] = [];
  roles: Role[] = [];
  ngUnsubscribe$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.createUserForm();
    if (this.user) {
      this.userForm.setValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        roleId: this.user.fkRoleId,
        address: this.user.address,
      });
    }
    this.getRoles();
  }

  createUserForm() {
    this.userForm = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl<string>(''),
      address: new FormControl<number | null>(null),
      roleId: new FormControl<number>(0, Validators.required),
    });
  }

  getRoles() {
    this.roleService
      .getRoles()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (res.data.length) {
          this.roles = res.data;
        }
      });
  }
  closeModal() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    const userInfo = this.userForm.value;
    const userToAddOrUpdate: UserInputDto = {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      fkRoleId: userInfo.roleId,
      address: userInfo.address,
    };

    if (this.user) {
      this.userService
        .updateUser(this.user.id, userToAddOrUpdate)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.showSuccessOrErrorPopup(res.data, this.bsModalRef, this.user);
        });
    } else {
      this.userService
        .addUser(userToAddOrUpdate)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.showSuccessOrErrorPopup(res.data, this.bsModalRef, this.user);
        });
    }
  }

  showSuccessOrErrorPopup(
    isSaved: boolean,
    modalRef: BsModalRef,
    user: User | null
  ) {
    if (isSaved) {
      modalRef.hide();
      this.toastrService.success(user ? 'Updated' : 'Added' + ' Succeffully');
      this.saveSuccess.emit();
    } else {
      this.toastrService.error(user ? 'Updating' : 'Adding' + ' Failed!');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
