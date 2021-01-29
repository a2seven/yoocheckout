import { IConfirmationType } from ".";

export interface IConfirmation {
    type: IConfirmationType;
    locale?: string;
    confirmation_token?: string;
    confirmation_data?: string;
    confirmation_url?: string;
    enforce?: boolean;
    return_url?: string;
}


export type IConfirmationWithoutData = Omit<IConfirmation, 'confirmation_token' | 'confirmation_data' | 'confirmation_url'>;