import {IAmount} from '.';

export interface IPaymentDeal {
    id: string;
    settlements: {
        type: 'payout';
        amount: IAmount;
    }[];
}
