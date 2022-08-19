import { IAmount, IDealFeeMoment, IDealType } from '../types';

export class Deal {
    id!: string;
    type!: IDealType;
    fee_moment!: IDealFeeMoment;
    balance!: IAmount;
    payout_balance!: IAmount;
    status!: 'opened' | 'closed';
    created_at!: string;
    expired_at!: string;
    metadata!: any;
    description!: string;
    test!: boolean;
}

export const dealFactory = (payload: unknown): Deal => {
    return Object.assign(new Deal(), payload);
};
