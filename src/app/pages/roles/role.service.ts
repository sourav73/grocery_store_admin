import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Role } from './role-type';
import { ListOutput, SingleObjectOutput } from '../../common/types/response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  apiUrl = environment.baseApiUrl;
  http = inject(HttpClient);
  constructor() {}

  getRoles(): Observable<ListOutput<Role>> {
    return this.http.get<ListOutput<Role>>(`${this.apiUrl}/role`);
  }

  addRole(roleName: string): Observable<SingleObjectOutput<boolean>> {
    return this.http.post<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/role`,
      { roleName }
    );
  }

  updateRole(
    id: number,
    roleName: string
  ): Observable<SingleObjectOutput<boolean>> {
    return this.http.put<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/role/${id}`,
      { roleName }
    );
  }

  deleteRole(id: number): Observable<SingleObjectOutput<boolean>> {
    return this.http.delete<SingleObjectOutput<boolean>>(
      `${this.apiUrl}/role/${id}`
    );
  }
}
