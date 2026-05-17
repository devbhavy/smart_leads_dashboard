export interface Lead {
    _id: string;
    name: string;
    email: string;
    status: "New" | "Contacted" | "Qualified" | "Lost";
    source: "Website" | "Instagram" | "Referral";
    createdAt: string;
    createdBy: string;
}

export interface Meta {
    total: number;
    page: number;
    totalPages: number;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "sales";
}