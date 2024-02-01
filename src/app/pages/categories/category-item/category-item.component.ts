import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Category } from '../category-type';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationComponent } from '../../../common/confirmation/confirmation.component';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [],
  providers: [BsModalService],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
})
export class CategoryItemComponent {
  modalService = inject(BsModalService);
  @Input() category: Category = {} as Category;
  @Output() editCategoryEmit: EventEmitter<number> = new EventEmitter();

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
        // make delete request
      } else {
        // just hide the modal
        modalRef.hide();
      }
    });
  }
}
