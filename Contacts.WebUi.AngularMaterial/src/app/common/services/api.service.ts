import { Service, inject, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

interface INotificationOptions {
  showSuccess?: boolean;
  successMessage?: string;
  showError?: boolean;
  errorMessage?: string;
  loading?: WritableSignal<boolean>;
}

interface IRequestOptions extends INotificationOptions {
  headers?: HttpHeaders | Headers;
  params?: HttpParams | Params; // Query string parameters
}

type Headers = Record<string, string | string[]>;

type Params = Record<
  string,
  string | number | false | true | readonly (string | number | false | true)[]
>;

@Service()
export class ApiService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _notificationService: NotificationService = inject(NotificationService);
  private readonly _apiPrefix = environment.apiUrl;
  private readonly _defaultOptions: INotificationOptions = {
    showSuccess: false,
    successMessage: 'Your request has been processed successfully.',
    showError: true,
  };

  get<T>(path: string, options?: IRequestOptions): Observable<T> {
    const ops = { ...this._defaultOptions, ...options };

    return this._http
      .get<T>(this.getUrl(path), this.extendOptions(ops))
      .pipe(this.tapResponse(ops));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<T>(path: string, body?: any, options?: IRequestOptions): Observable<T> {
    const ops = { ...this._defaultOptions, ...options };

    return this._http
      .post<T>(this.getUrl(path), body, this.extendOptions(ops))
      .pipe(this.tapResponse(ops));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put<T>(path: string, body?: any, options?: IRequestOptions): Observable<T> {
    const ops = { ...this._defaultOptions, ...options };

    return this._http
      .put<T>(this.getUrl(path), body, this.extendOptions(ops))
      .pipe(this.tapResponse(ops));
  }

  delete<T>(path: string, options?: IRequestOptions): Observable<T> {
    const ops = { ...this._defaultOptions, ...options };

    return this._http
      .delete<T>(this.getUrl(path), this.extendOptions(ops))
      .pipe(this.tapResponse(ops));
  }

  private getUrl(path: string): string {
    return path.toLowerCase().startsWith('https://') ? path : `${this._apiPrefix}${path}`;
  }

  private extendOptions(options: IRequestOptions): {
    headers?: HttpHeaders | Headers;
    params?: HttpParams | Params;
    observe?: 'body';
    responseType?: 'json';
  } {
    options.loading?.set(true);

    return { ...options };
  }

  private tapResponse<T>(options: IRequestOptions) {
    return tap<T>({
      next: () => this.onSuccess(options),
      error: (error) => this.onError(error, options),
      finalize: () => options.loading?.set(false),
    });
  }

  private onSuccess(options: IRequestOptions): void {
    if (options.showSuccess) {
      this._notificationService.showSuccessBar(options.successMessage!);
    }
  }

  private onError(response: HttpErrorResponse, options: IRequestOptions): void {
    if (options.showError) {
      let message = options.errorMessage;

      if (response.error instanceof Error) {
        // Likely a client-side or network error
        message = response.error.message;
        if (!navigator.onLine) {
          message += ' You might have lost internet connectivity.';
        }
      } else {
        // API returned an unsuccessful response code
        if (response.status === 400 && response.error?.errors) {
          // ASP.Net model validation error(s) - show the first error.
          // Ideally we should have frontend validation equivalent to backend,
          // so we should never get here, but just in case frontend missed some validation.
          message = Object.values(response.error.errors as Record<string, string[]>)[0][0];
        } else if (response.error?.detail && !message) {
          // Use API error message, if present, but only if client side error message was not provided
          // Our API uses standard problem details response structure
          // https://www.rfc-editor.org/rfc/rfc9457.html#name-detail
          message = response.error.detail;
        }
      }

      this._notificationService.showErrorBar(
        message ?? 'There was an error processing your request.',
      );
    }
  }
}
