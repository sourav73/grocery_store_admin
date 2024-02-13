import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HeadingComponent } from '../../common/heading/heading.component';
import { RoleService } from './role.service';
import { Role } from './role-type';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { RoleModalComponent } from './role-modal/role-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [HeadingComponent],
  providers: [BsModalService, RoleService, ToastrService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit, OnDestroy {
  roleService = inject(RoleService);
  modalService = inject(BsModalService);
  toastrService = inject(ToastrService);
  roles: Role[] = [];
  ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.getRoles();
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

  openDeleteConfirmModal(roleId: number) {
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
        this.roleService
          .deleteRole(roleId)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((res) => {
            if (res.data) {
              this.toastrService.success('Deleted successfully');
              this.getRoles();
            } else {
              this.toastrService.success('Deleting failed!');
            }
          });
      }
    });
  }

  openModal(role: Role | null) {
    const initialState = {
      role,
    };
    const modalRef = this.modalService.show(RoleModalComponent, {
      class: 'modal-md modal-dialog-center',
      initialState,
      backdrop: true,
      ignoreBackdropClick: true,
    });

    modalRef.content?.roleAddSuccesEmit.subscribe(() => {
      this.getRoles();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
