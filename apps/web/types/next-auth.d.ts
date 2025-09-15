import 'next-auth';
import { DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string | null;
      isOAuth: boolean;
    } & DefaultSession['user'];
  }

  interface AdapterUser extends DefaultUser {
    id: string;
    username: string | null;
    isOAuth: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    username: string | null;
    isOAuth: boolean;
  }
}
