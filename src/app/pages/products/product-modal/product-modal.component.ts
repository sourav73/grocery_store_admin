import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryItem } from '../../categories/category-type';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../categories/categor.service';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductInput } from '../product-type';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgSelectModule],
  providers: [ToastrService],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModalComponent implements OnInit, OnDestroy {
  bsModalRef = inject(BsModalRef);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  toastrService = inject(ToastrService);
  @Input() isEditMode: boolean = false;
  @Input() productId: number = 0;
  @Output() saveSuccess: EventEmitter<void> = new EventEmitter();
  productForm: FormGroup = new FormGroup({});
  categories: CategoryItem[] = [];
  ngUnsubscribe$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.createProductForm();
    this.getCategories();
    if (this.isEditMode && this.productId) {
      this.productService
        .getProductById(this.productId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          if (res.data) {
            const product = res.data;
            this.productForm.setValue({
              name: product.name,
              description: product.description,
              categoryId: product.fkCategoryId,
              price: product.price,
              imagePath: product.imagePath,
              weight: product.weight,
              discount: product.discount,
            });
          }
        });
    }
  }

  createProductForm() {
    this.productForm = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      description: new FormControl<string>(''),
      price: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(10),
      ]),
      categoryId: new FormControl<number>(0, Validators.required),
      imagePath: new FormControl<string>(''),
      weight: new FormControl<number | null>(null),
      discount: new FormControl<number | null>(null),
    });
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (res.data.length) {
          this.categories = res.data;
        }
      });
  }
  closeModal() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    const productInfo = this.productForm.value;
    const productToAddOrUpdate: ProductInput = {
      name: productInfo.name,
      description: productInfo.description,
      price: productInfo.price,
      fkCategoryId: productInfo.categoryId,
      imagePath: productInfo.imagePath,
      discount: productInfo.discount,
      weight: productInfo.weight,
    };

    if (this.isEditMode && this.productId) {
      this.productService
        .updateProduct(this.productId, productToAddOrUpdate)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.showSuccessOrErrorPopup(
            res.data,
            this.bsModalRef,
            this.productId
          );
        });
    } else {
      this.productService
        .addProduct(productToAddOrUpdate)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.showSuccessOrErrorPopup(
            res.data,
            this.bsModalRef,
            this.productId
          );
        });
    }
  }

  showSuccessOrErrorPopup(
    isSaved: boolean,
    modalRef: BsModalRef,
    productId: number
  ) {
    if (isSaved) {
      modalRef.hide();
      this.toastrService.success(
        productId ? 'Updated' : 'Added' + ' Succeffully'
      );
      this.saveSuccess.emit();
    } else {
      this.toastrService.error(productId ? 'Updating' : 'Adding' + ' Failed!');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
