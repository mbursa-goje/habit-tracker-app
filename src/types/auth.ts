export type User = {
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: string;
};

export type Session = {
    userId: string;
    email: string;
    name: string;
};