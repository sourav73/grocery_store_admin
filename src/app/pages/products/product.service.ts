import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { ListOutput, SingleObjectOutput } from '../../common/types/response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = environment.baseApiUrl;
  http = inject(HttpClient);
  constructor() {}

  // getProducts(): Observable<ListOutput<Category>> {
  //   return this.http.get<ListOutput<Category>>(`${this.apiUrl}/categories`);
  // }

  // addProduct(category: any): Observable<SingleObjectOutput<boolean>> {
  //   return this.http.post<SingleObjectOutput<boolean>>(
  //     `${this.apiUrl}/categories`,
  //     category
  //   );
  // }

  // updateProduct(
  //   id: number,
  //   product: { categoryName: string; parentId: number }
  // ): Observable<SingleObjectOutput<boolean>> {
  //   return this.http.put<SingleObjectOutput<boolean>>(
  //     `${this.apiUrl}/categories/${id}`,
  //     category
  //   );
  // }

  deleteCategory(id: number): Observable<SingleObjectOutput<boolean>> {
    return this.http.delete<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/categories/${id}`
    );
  }
}
