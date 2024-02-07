import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { ListOutput, SingleObjectOutput } from '../../common/types/response';
import { Observable } from 'rxjs';
import { Category, CategoryItem } from './category-type';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = environment.baseApiUrl;
  http = inject(HttpClient);
  constructor() {}

  getCategoriesWithNestedChild(): Observable<ListOutput<Category>> {
    return this.http.get<ListOutput<Category>>(`${this.apiUrl}/categories`);
  }

  getCategories(): Observable<ListOutput<CategoryItem>> {
    return this.http.get<ListOutput<CategoryItem>>(`${this.apiUrl}/categories/all`);
  }

  addCategory(category: any): Observable<SingleObjectOutput<boolean>> {
    return this.http.post<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/categories`,
      category
    );
  }

  updateCategory(
    id: number,
    category: { categoryName: string; parentId: number }
  ): Observable<SingleObjectOutput<boolean>> {
    return this.http.put<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/categories/${id}`,
      category
    );
  }

  deleteCategory(id: number): Observable<SingleObjectOutput<boolean>> {
    return this.http.delete<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/categories/${id}`
    );
  }
}
