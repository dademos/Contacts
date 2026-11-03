import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NotificationService } from './notification.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let sut: ApiService;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: NotificationService,
          useValue: {
            showSuccessBar: vi.fn(),
            showErrorBar: vi.fn(),
          },
        },
      ],
    });

    sut = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('triggers loading signal on and off', () => {
    it('on success', () => {
      const loading = signal(false);

      sut.get('test', { loading }).subscribe();

      // Request started
      expect(loading()).toBe(true);

      const req = httpMock.expectOne(`${environment.apiUrl}test`);

      req.flush({ data: 'success' });

      // Request completed successfully
      expect(loading()).toBe(false);
    });

    it('on error', () => {
      const loading = signal(false);

      sut.get('test', { loading }).subscribe({
        error: () => {},
      });

      // Request started
      expect(loading()).toBe(true);

      const req = httpMock.expectOne(`${environment.apiUrl}test`);

      req.flush(
        { message: 'error' },
        {
          status: 500,
          statusText: 'Internal Server Error',
        },
      );

      // Request completed with an error
      expect(loading()).toBe(false);
    });
  });

  it('passes params and headers to HTTP request', () => {
    const params = {
      search: 'angular',
      page: 2,
    };

    const headers = {
      Authorization: 'Bearer token',
      'Custom-Header': 'value',
    };

    sut.get('test', { params, headers }).subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${environment.apiUrl}test` &&
        request.params.get('search') === 'angular' &&
        request.params.get('page') === '2',
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    expect(req.request.headers.get('Custom-Header')).toBe('value');

    req.flush({});
  });

  it('uses URL starting with https:// as is', () => {
    const url = 'https://external-api.com/test';

    sut.get(url).subscribe();

    const req = httpMock.expectOne(url);

    expect(req.request.url).toBe(url);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  describe('when showSuccess=true', () => {
    it.each([
      {
        description: 'shows provided successMessage',
        options: { showSuccess: true, successMessage: 'Custom success message' },
        expectedMessage: 'Custom success message',
      },
      {
        description: 'shows default success message when successMessage is not provided',
        options: { showSuccess: true },
        expectedMessage: 'Your request has been processed successfully.',
      },
    ])('$description', ({ options, expectedMessage }) => {
      sut.get('test', options).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}test`);
      req.flush({});

      expect(notificationService.showSuccessBar).toHaveBeenCalledOnce();
      expect(notificationService.showSuccessBar).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe('doesn`t show success notification', () => {
    it.each([
      {
        description: 'when showSuccess=false',
        options: { showSuccess: false },
      },
      {
        description: 'when showSuccess is not provided',
        options: {},
      },
    ])('should not show success message $description', ({ options }) => {
      sut.get('/test', options).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.flush({});

      expect(notificationService.showSuccessBar).not.toHaveBeenCalled();
    });
  });

  it('shows the first API validation error when status code is 400', () => {
    const apiErrors = {
      Name: ['Name is required', 'Name must be at least 3 characters'],
      Email: ['Invalid email address'],
    };

    sut.post('test', { email: 'abc' }).subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne(`${environment.apiUrl}test`);

    req.flush(
      {
        errors: apiErrors,
      },
      {
        status: 400,
        statusText: 'Bad Request',
      },
    );

    expect(notificationService.showErrorBar).toHaveBeenCalledOnce();
    expect(notificationService.showErrorBar).toHaveBeenCalledWith('Name is required');
  });

  describe('shows error notification', () => {
    it.each([
      {
        description: 'using response detail when errorMessage is not provided',
        options: {},
        expectedMessage: 'API error detail',
      },
      {
        description: 'uses errorMessage when provided',
        options: { errorMessage: 'Custom error message' },
        expectedMessage: 'Custom error message',
      },
    ])('$description', ({ options, expectedMessage }) => {
      sut.get('test', options).subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne(`${environment.apiUrl}test`);

      req.flush(
        {
          detail: 'API error detail',
        },
        {
          status: 500,
          statusText: 'Internal Server Error',
        },
      );

      expect(notificationService.showErrorBar).toHaveBeenCalledOnce();
      expect(notificationService.showErrorBar).toHaveBeenCalledWith(expectedMessage);
    });
  });

  it('doesn`t show error notification when showError=false', () => {
    sut.get('test', { showError: false }).subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne(`${environment.apiUrl}test`);

    req.flush(
      {
        detail: 'API error detail',
      },
      {
        status: 500,
        statusText: 'Internal Server Error',
      },
    );

    expect(notificationService.showErrorBar).not.toHaveBeenCalled();
  });
});
