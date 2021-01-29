import { ICreateError } from "../types";

export class ErrorResponse {
    public errorCode!: number;
    public code!: string;
    public description!: string;
    public parameter!: string;
    public type!: string;
    public id!: string;
    constructor() {

    }
}


export const errorFactory = (payload: ICreateError): ErrorResponse => {
    return Object.assign(new ErrorResponse(), payload);
};