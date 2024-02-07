import { Component, inject } from '@angular/core';
import { HeadingComponent } from '../../common/heading/heading.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { SingleObjectOutput } from '../../common/types/response';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeadingComponent],
  providers: [BsModalService, ToastrService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  modalService = inject(BsModalService);
  toastrService = inject(ToastrService);
  ngUnsubscribe$ = new Subject<void>();
  openModal(productId: number) {
    // const initialState = {
    //   isEditMode: productId ? true : false,
    //   productId,
    //   products: this.categories,
    // };
    // const modalRef = this.modalService.show(ProductModalComponent, {
    //   class: 'modal-md modal-dialog-center',
    //   initialState,
    //   backdrop: true,
    //   ignoreBackdropClick: true,
    // });
    // modalRef.content?.submitted.subscribe(() => {
    //   const categoryToAddOrUpdate = {
    //     categoryName: this.categoryForm.value.categoryName,
    //     parentId: this.selectedParentId,
    //   };
    //   if (productId) {
    //     this.categoryService
    //       .updateCategory(categoryId, categoryToAddOrUpdate)
    //       .subscribe((res) => {
    //         this.showSuccessOrErrorPopup(res, modalRef, productId);
    //       });
    //   } else {
    //     this.categoryService
    //       .addCategory(categoryToAddOrUpdate)
    //       .subscribe((res) => {
    //         this.showSuccessOrErrorPopup(res, modalRef, productId);
    //       });
    //   }
    // });
  }

  showSuccessOrErrorPopup(
    res: SingleObjectOutput<boolean>,
    modalRef: BsModalRef,
    productId: number
  ) {
    if (res.data) {
      modalRef.hide();
      this.toastrService.success(
        productId ? 'Updated' : 'Added' + ' Succeffully'
      );
      // this.getCategories();
    } else {
      this.toastrService.error(productId ? 'Updating' : 'Adding' + ' Failed!');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
