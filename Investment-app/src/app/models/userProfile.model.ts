export interface UserProfile {
    id: string;
    name: string;
    viewOptions: {
        detailsView: {
            table:{
                orderBy: number;
                ascending: boolean;
            }
        }
    }
}

export const enum TableCollumns {
    Date = 1,
    Value
}