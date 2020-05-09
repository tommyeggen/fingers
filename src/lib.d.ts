interface Score {
    timestamp?: number;
    date?: string;
    score?: any;
    actualTime?: number,
}

declare function ga(method: string, key: string, value: any): void;