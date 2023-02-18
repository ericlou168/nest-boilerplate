import { E } from '@common';

export interface JWTPayload {
  id: number;
  type: E.AccountTypeEnum;
  phone: string;
  loginDate: string;
}
