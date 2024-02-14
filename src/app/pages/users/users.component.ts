import { Component, OnInit, inject } from '@angular/core';
import { HeadingComponent } from '../../common/heading/heading.component';
import { User } from './user-type';
import { UserService } from './user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserModalComponent } from './user-modal/user-modal.component';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeadingComponent],
  providers: [BsModalService, ToastrService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  modalService = inject(BsModalService);
  toastrService = inject(ToastrService);
  userService = inject(UserService);
  ngUnsubscribe$ = new Subject<void>();
  users: User[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (res.data.length) {
          this.users = res.data;
        }
      });
  }

  openModal(user: User | null) {
    const initialState = {
      user
    };
    const modalRef = this.modalService.show(UserModalComponent, {
      class: 'modal-md modal-dialog-center',
      initialState,
      backdrop: true,
      ignoreBackdropClick: true,
    });

    modalRef.content?.saveSuccess.subscribe(() => {
      this.getUsers();
    });
  }

  openDeleteConfirmModal(userId: number) {
    const initialState = {
      headingText: 'Warning',
      warningText: 'Are you sure you want to delete this product?',
    };
    const modalRef = this.modalService.show(ConfirmationComponent, {
      class: 'modal-md modal-dialog-centered',
      initialState,
      backdrop: true,
      ignoreBackdropClick: true,
    });

    modalRef.content?.confirmed.subscribe((isConfirmed) => {
      modalRef.hide();
      if (isConfirmed) {
        this.userService
          .deleteUser(userId)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((res) => {
            if (res.data) {
              this.toastrService.success('Deleted successfully');
              this.getUsers();
            } else {
              this.toastrService.success('Deleting failed!');
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
