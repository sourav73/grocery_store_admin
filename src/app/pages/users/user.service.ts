import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { User, UserInputDto } from './user-type';
import { Observable } from 'rxjs';
import { ListOutput, SingleObjectOutput } from '../../common/types/response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.baseApiUrl;
  http = inject(HttpClient);
  constructor() {}

  getUsers(): Observable<ListOutput<User>> {
    return this.http.get<ListOutput<User>>(`${this.apiUrl}/Account`);
  }

  addUser(user: UserInputDto): Observable<SingleObjectOutput<boolean>> {
    return this.http.post<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/Account`,
      user
    );
  }

  updateUser(
    id: number,
    user: UserInputDto
  ): Observable<SingleObjectOutput<boolean>> {
    return this.http.put<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/Account/${id}`,
      user
    );
  }

  deleteUser(id: number): Observable<SingleObjectOutput<boolean>> {
    return this.http.delete<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/Account/${id}`
    );
  }
}
