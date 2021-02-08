export class Me {
    public account_id!: string;
    public test!: boolean;
    public fiscalization_enabled!: boolean;
    public payment_methods!: string[];
    public status!: string;
    constructor() {}
}


export const meFactory = (payload: any): Me => {
    return Object.assign(new Me(), payload);
};