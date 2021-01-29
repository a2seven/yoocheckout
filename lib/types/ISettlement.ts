import { IAmount, ISettlementType } from ".";

export interface ISettlement {
    type: ISettlementType;
    amount: IAmount;
}