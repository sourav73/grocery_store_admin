import { Component, OnInit, inject } from '@angular/core';
import { HeadingComponent } from '../../common/heading/heading.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './product.service';
import { Product } from './product-type';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeadingComponent, ProductItemComponent],
  providers: [BsModalService, ToastrService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  modalService = inject(BsModalService);
  toastrService = inject(ToastrService);
  productService = inject(ProductService);
  ngUnsubscribe$ = new Subject<void>();
  products: Product[] = [];

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (res.data.length) {
          this.products = res.data;
        }
      });
  }

  refreshProducts() {
    this.getProducts();
  }
  openModal(productId: number) {
    const initialState = {
      isEditMode: productId ? true : false,
      productId,
    };
    const modalRef = this.modalService.show(ProductModalComponent, {
      class: 'modal-md modal-dialog-center',
      initialState,
      backdrop: true,
      ignoreBackdropClick: true,
    });

    modalRef.content?.saveSuccess.subscribe(() => {
      this.getProducts();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
