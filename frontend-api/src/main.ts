import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideHttpClient() // Proporcionar HttpClient en modo standalone
  ]
}).catch(err => console.error(err));
