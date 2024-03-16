export interface Article {
    id: number;
    id_author: number;
    id_category: number;

    name: string;
    summary: string;
    attachment_array: ArticleAttachment[];

    //TODO: creation date, sort by it
}

export interface ArticleAttachment {
    id: number,
    id_article: number,

    attachment_url: string;
}
