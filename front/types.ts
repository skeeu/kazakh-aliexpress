export type Category = {
    ID: string;
    CategoryName: string;
};

export type ItemOption = {
    OptionTitle: string;
    OptionOptions: string[];
};

export type Item = {
    ID: string;
    ItemName: string;
    Options: ItemOption[];
    Price: number;
    Photos: string[];
    Categories: Category[];
};

export type JWTPayload = {
    email: string;
    exp: Date;
    role: string;
    userId: string;
};
