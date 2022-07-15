import { ICreateError } from '../types';
import { AxiosError } from 'axios';

export class ErrorResponse {
  payload: unknown;

  constructor(payload: unknown) {
    this.payload = payload;
  }
}

export const errorFactory = (
  payload: ICreateError | unknown,
): ErrorResponse | unknown => {
  if (isAxiosError(payload) && payload.response) {
    return new ErrorResponse(payload.response.data);
  }
  return payload;
};
function isAxiosError(err: any): err is AxiosError {
  return err?.isAxiosError;
}