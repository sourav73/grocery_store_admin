import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationComponent } from '../../../common/confirmation/confirmation.component';
import { ProductService } from '../product.service';
import { Product } from '../product-type';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [ProductModalComponent],
  providers: [BsModalService, ToastrService],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  modalService = inject(BsModalService);
  toaster = inject(ToastrService);
  productService = inject(ProductService);
  ngUnsubscribe$: Subject<void> = new Subject();
  @Input() product: Product = {} as Product;
  @Output() editSuccess: EventEmitter<void> = new EventEmitter();

  openEditModal() {
    const initialState = {
      isEditMode: true,
      productId: this.product.id,
    };
    const modalRef = this.modalService.show(ProductModalComponent, {
      class: 'modal-md modal-dialog-center',
      initialState,
      backdrop: true,
      ignoreBackdropClick: true,
    });

    modalRef.content?.saveSuccess.subscribe(() => {
      this.editSuccess.emit();
    });
  }

  openDeleteConfirmModal() {
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
      if (isConfirmed) {
        modalRef.hide();
        this.productService
          .deleteProduct(this.product.id)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((res) => {
            if (res) {
              this.editSuccess.emit();
              this.toaster.success('Deleted successfully');
            } else {
              this.toaster.error('Delete Failed!');
            }
          });
      } else {
        modalRef.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
