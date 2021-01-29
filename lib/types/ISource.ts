import { IAmount } from ".";

export interface ISource {
    account_id: string;
    amount: IAmount;
    platform_fee_amount: IAmount;
}