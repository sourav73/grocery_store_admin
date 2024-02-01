import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HeadingComponent } from '../../common/heading/heading.component';
import { Subject, takeUntil } from 'rxjs';
import { Category } from './category-type';
import { CategoryService } from './categor.service';
import { CategoryItemComponent } from './category-item/category-item.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { ToastrService } from 'ngx-toastr';
import { SingleObjectOutput } from '../../common/types/response';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [HeadingComponent, CategoryItemComponent],
  providers: [BsModalService],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  toastrService = inject(ToastrService);
  modalService = inject(BsModalService);
  // bsModalRef = inject(BsModalRef);
  categories: Category[] = [];
  categoryService = inject(CategoryService);
  categoryForm: FormGroup = new FormGroup({});
  isEditMode: boolean = false;
  selectedParentId: number = 0;
  ngUnsubscribe$ = new Subject<void>();

  constructor() {}
  ngOnInit(): void {
    this.getCategories();
    this.categoryForm = new FormGroup({
      categoryName: new FormControl('', Validators.required),
      parentId: new FormControl(),
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

  toggleModalState(isEdit: boolean) {
    this.isEditMode = isEdit;
  }

  openModal(categoryId: number) {
    const initialState = {
      categoryForm: this.categoryForm,
      isEditMode: categoryId ? true : false,
      categoryId,
      selectedParentId: this.selectedParentId,
      categories: this.categories,
    };
    const modalRef = this.modalService.show(CategoryModalComponent, {
      class: 'modal-md modal-dialog-center',
      initialState,
      backdrop: true,
      ignoreBackdropClick: true,
    });

    modalRef.content?.submitted.subscribe(() => {
      const categoryToAddOrUpdate = {
        categoryName: this.categoryForm.value.categoryName,
        parentId: this.selectedParentId,
      };
      if (categoryId) {
        this.categoryService
          .updateCategory(categoryId, categoryToAddOrUpdate)
          .subscribe((res) => {
            this.showSuccessOrErrorPopup(res, modalRef, categoryId);
          });
      } else {
        this.categoryService
          .addCategory(categoryToAddOrUpdate)
          .subscribe((res) => {
            this.showSuccessOrErrorPopup(res, modalRef, categoryId);
          });
      }
    });
  }

  showSuccessOrErrorPopup(
    res: SingleObjectOutput<boolean>,
    modalRef: BsModalRef,
    categoryId: number
  ) {
    if (res.data) {
      modalRef.hide();
      this.toastrService.success(
        categoryId ? 'Updated' : 'Added' + ' Succeffully'
      );
      this.getCategories();
    } else {
      this.toastrService.error(categoryId ? 'Updating' : 'Adding' + ' Failed!');
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
