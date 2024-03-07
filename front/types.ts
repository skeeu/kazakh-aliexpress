export type Category = {
    ID: string;
    CategoryName: string;
};

export type ItemOption = {
    Title: string;
    Options: string[];
};

export type ItemInfo = {
    Title: string;
    Content: string;
};

export type Item = {
    ID: string;
    ItemName: string;
    Options: ItemOption[];
    Price: number;
    Photos: string[];
    Categories: Category[];
    Infos: ItemInfo[];
};

export type JWTPayload = {
    email: string;
    exp: Date;
    role: string;
    userId: string;
};
