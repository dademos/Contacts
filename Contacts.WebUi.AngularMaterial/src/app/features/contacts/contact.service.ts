import { ApiService } from '../../common/services/api.service';
import { inject, WritableSignal, Injectable } from '@angular/core';
import { SortedPageSearchRequest, PageResult } from '../../common/models/paging';
import { ContactSortBy, ContactResponse, ContactRequest } from './models';
import { Observable } from 'rxjs';

@Injectable()
export class ContactService {
  private readonly _apiService = inject(ApiService);

  search(request: SortedPageSearchRequest<ContactSortBy>): Observable<PageResult<ContactResponse>> {
    return this._apiService.post<PageResult<ContactResponse>>('Contacts/Search', request);
  }

  create(contact: ContactRequest): Observable<ContactResponse> {
    return this._apiService.post<ContactResponse>('Contacts', contact, {
      showSuccess: true,
      successMessage: 'Contact created successfully but may not appear on the current page.',
    });
  }

  update(contact: ContactRequest): Observable<ContactResponse> {
    return this._apiService.put<ContactResponse>('Contacts', contact);
  }

  delete(id: number, loading?: WritableSignal<boolean>): Observable<void> {
    return this._apiService.delete<void>(`Contacts/${id}`, { loading });
  }

  generate(loading?: WritableSignal<boolean>): Observable<void> {
    return this._apiService.post<void>('Contacts/Seed/10', undefined, { loading });
  }
}
