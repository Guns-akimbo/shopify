import { ReactNode } from "react";
// const createdAt = new Date(someObject.createdAt ?? Date.now());

export type user = {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  password: string;
  isVerified: boolean;
//   createdAt?: string  | null;
};

export type RedirectProps = {
  children: ReactNode;
};
