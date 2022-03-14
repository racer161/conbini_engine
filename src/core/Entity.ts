export interface Entity{
    children?: Entity[];
    id: string;
    name?: string;
}

export interface Static
{
    static?: boolean;
}