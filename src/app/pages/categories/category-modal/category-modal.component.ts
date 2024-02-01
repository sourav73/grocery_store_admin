import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Category } from '../category-type';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, FormsModule],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss',
})
export class CategoryModalComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  @Input() categoryForm: FormGroup = new FormGroup({});
  @Input() isEditMode: boolean = false;
  @Input() categoryId: number = 0;
  @Input() selectedParentId: number = 0;
  @Input() categories: Category[] = [];
  @Output() submitted: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
    if (this.categoryId) {
      const category = this.categories.find((c) => c.id === this.categoryId);
      this.categoryForm
        .get('categoryName')
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
