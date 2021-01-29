
export interface IRecipient {
    account_id?: string;
    gateway_id: string;
}

export type IRecipientWithoutId = Omit<IRecipient, 'account_id'>;