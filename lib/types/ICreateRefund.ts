import {
    IAmount,
    ISource,
    IReceipt
} from ".";


export interface ICreateRefund {
    payment_id: string;
    amount: IAmount;
    description?: string;
    receipt?: IReceipt;
    sources?: ISource[];
    deal?: {
        refund_settlements: {
            type: 'payout';
            amount: IAmount;
        }[];
    };
}