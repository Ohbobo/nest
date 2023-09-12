export interface IBook {
    _id: string;
    userId: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    imageUrl: string;
    ratings: [{
        userId: string,
        grade: number,
    }],
    averageRating: number,
}