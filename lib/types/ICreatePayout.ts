import { IAmount } from '.';
import { IPayoutDeal } from './IPayoutDeal';

export interface ICreatePayout {
  amount: IAmount;
  payout_token: string;
  description?: string;
  metadata?: any;
  deal?: IPayoutDeal;
}
