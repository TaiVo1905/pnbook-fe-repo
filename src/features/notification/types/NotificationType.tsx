export interface Notifications{
    id: string;
    receiverId: string;
    title: string;
    content: string
    targetDetails?: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationResponse<T>{
    statusCode: number;
    message?: string;
    data: T;
    meta?:{
        currentPage: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}