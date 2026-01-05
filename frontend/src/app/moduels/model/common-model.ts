


export interface UserInfo {
    dept: string;
    email: string;
    employeeId: string;
    id: number;
    mobileNo: string;
    roles: Role[];
    status: string;
    username: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface ICustomer {
    id: number;
    name: string;
    gender: string;
    address: string;
    mobileNo: string;
    nid: string;
    accounts?: any[]
}

export interface IAccount {
    id?: number|null;
    customer?: any;
    accountNumber?: string;
    customerId: number;
    accountType: string;
    status: string;
    balance: number;
    dailyTransactionLimit: number;

}

export interface IAccountUpdate {
    accountType: string;
    status: string;
    dailyTransactionLimit: number;

}