export interface Entity{
    children?: Entity[];
    id: string;
    static?: boolean;
    name?: string;
}
