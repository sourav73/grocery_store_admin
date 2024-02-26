import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { ListOutput, SingleObjectOutput } from '../../common/types/response';
import { Observable } from 'rxjs';
import { Product, ProductInput } from './product-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = environment.baseApiUrl;
  http = inject(HttpClient);
  constructor() {}

  getProducts(): Observable<ListOutput<Product>> {
    return this.http.get<ListOutput<Product>>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<SingleObjectOutput<Product>> {
    return this.http.get<SingleObjectOutput<Product>>(
      `${this.apiUrl}/Product/${id}`
    );
  }

  addProduct(category: any): Observable<SingleObjectOutput<boolean>> {
    return this.http.post<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/Product`,
      category
    );
  }

  updateProduct(
    id: number,
    product: ProductInput
  ): Observable<SingleObjectOutput<boolean>> {
    return this.http.put<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/Product/${id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<SingleObjectOutput<boolean>> {
    return this.http.delete<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/Product/${id}`
    );
  }
}
