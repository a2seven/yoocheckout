import {
    IAmount,
    IPaymentSubject,
    IPaymentMode,
    IAgentType
} from ".";

export interface IItem {
    description: string;
    quantity: string;
    amount: IAmount;
    vat_code: number;
    payment_subject?: IPaymentSubject;
    payment_mode?: IPaymentMode;
    product_code?: string;
    country_of_origin_code?: string;
    customs_declaration_number?: string;
    excise?: string;
    supplier?: {
        name?: string;
        phone?: string;
        inn?: string;
    };
    agent_type?: IAgentType;
}

export type IItemWithoutData = Omit<IItem, 'supplier' | 'agent_type'>;