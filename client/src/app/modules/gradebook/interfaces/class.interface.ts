import { Item } from 'gradebook/interfaces/item.interface';

export interface Class {
    id: number;
    isItemsLoaded: boolean;

    name: string;
    isWeighted: boolean;
    isActive: boolean;
    items: Item[];

    completed: number;
    remaining: number;
    total: number;

    dateLastViewed: Date;

    completedEarned: number;
    completedPossible: number;
    completedGrade: number;
    completedGradeColor: string;
    completedGradeText: string;

    totalEarned: number;
    totalPossible: number;
    totalGrade: number;
    totalGradeColor: string;
    totalGradeText: string;
}
