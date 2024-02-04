import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';
import { CategoryItem } from '../category-type';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationComponent } from '../../../common/confirmation/confirmation.component';
import { CategoryService } from '../categor.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [],
  providers: [ToastrService],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
})
export class CategoryItemComponent implements OnDestroy {
  modalService = inject(BsModalService);
  toaster = inject(ToastrService);
  categoryService = inject(CategoryService);
  ngUnsubscribe$: Subject<void> = new Subject();
  @Input() category: CategoryItem = {} as CategoryItem;
  @Output() editCategoryEmit: EventEmitter<{ id: number; parentId: number }> =
    new EventEmitter();

  openDeleteConfirmModal() {
    const initialState = {
      headingText: 'Warning',
      warningText: 'Are you sure you want to delete this category?',
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
        this.categoryService
          .deleteCategory(this.category.id)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((res) => {
            if (res) {
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
