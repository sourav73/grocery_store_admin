import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Category } from '../../categories/category-type';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
})
export class ProductModalComponent {
  bsModalRef = inject(BsModalRef);
  @Input() productForm: FormGroup = new FormGroup({});
  @Input() isEditMode: boolean = false;
  @Input() productId: number = 0;
  @Input() selectedParentId: number = 0;
  @Input() categories: Category[] = [];
  @Output() submitted: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
    if (this.productId) {
      const category = this.categories.find((c) => c.id === this.productId);
      this.productForm
        .get('productName')
        ?.setValue(category?.categoryName || '');
    }
  }
  closeModal() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    this.submitted.emit();
  }
}
