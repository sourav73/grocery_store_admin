import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { ListOutput, SingleObjectOutput } from '../../common/types/response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  getCategories(): Observable<ListOutput<any>>{
    return this.http.get<ListOutput<any>>(`${this.apiUrl}/categories`);
  }

  addCategory(category: any) : Observable<SingleObjectOutput<boolean>> {
    return this.http.post<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/categories`,
      category
    )
  }

  updateCategory(id: number, category: any) : Observable<SingleObjectOutput<boolean>> {
    return this.http.post<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/categories/${id}`,
      category
    )
  }

  deleteCategory(id: number) : Observable<SingleObjectOutput<boolean>> {
    return this.http.delete<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/categories/${id}`
    )
  }
}
