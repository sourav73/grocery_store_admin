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
import { Category, CategoryItem } from '../category-type';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgStyle } from '@angular/common';
import { CategoryService } from '../categor.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, FormsModule, NgStyle],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.scss',
})
export class CategoryModalComponent implements OnInit {
  categoryService = inject(CategoryService);
  bsModalRef = inject(BsModalRef);
  @Input() categoryForm: FormGroup = new FormGroup({});
  @Input() isEditMode: boolean = false;
  @Input() categoryId: number = 0;
  @Input() parentId: number = 0;
  @Input() selectedParentId: number | null = null;
  @Input() categories: CategoryItem[] = [];
  @Output() submitted: EventEmitter<void> = new EventEmitter();

  nestedCategories: Category[] = [];

  ngOnInit(): void {
    if (this.categoryId) {
      const category = this.categories.find((c) => c.id === this.categoryId);
      this.categoryForm
        .get('categoryName')
        ?.setValue(category?.categoryName || '');
      this.selectedParentId = this.parentId;
    }

    this.categoryService.getCategoriesWithNestedChild().subscribe(res => {
      if(res.data.length) {
        this.nestedCategories = res.data;
      }
    });
  }
  closeModal() {
    this.bsModalRef.hide();
  }

  onSubmit() {
    this.submitted.emit();
  }
}
