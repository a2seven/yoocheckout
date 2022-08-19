import { IAmount, IPaymentDeal } from '../types';
import { IBankCard } from '../types/IBankCard';
import { IPayoutStatus } from '../types/IPayoutStatus';

export class Payout {
  id!: string;
  amount!: IAmount;
  status!: IPayoutStatus;
  payout_destination!:
    | {
        type: 'bank_card';
        card: IBankCard;
      }
    | {
        type: 'yoo_money';
        account_number: string;
      };
  description!: string;
  created_at!: string;
  deal?: IPaymentDeal;
  cancellation_details!: {
    party: string;
    reason: string;
  };
  metadata!: any;
  test!: boolean;
}

export const payoutFactory = (payload: unknown): Payout => {
  return Object.assign(new Payout(), payload);
};
