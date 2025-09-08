// skip-interceptor.token.ts
import { HttpContextToken } from '@angular/common/http';

export const SKIP_INTERCEPT = new HttpContextToken<boolean>(() => false);
