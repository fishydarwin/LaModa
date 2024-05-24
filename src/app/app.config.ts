import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideCharts(withDefaultRegisterables()), 
    provideStore(), 
    importProvidersFrom(HttpClientModule)
  ]
};

export const requestUrl = "http://localhost:8080";
