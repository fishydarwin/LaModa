export interface Article {
    id: number;
    id_author: number;
    id_category: number;

    name: string;
    summary: string;
    attachment_array: ArticleAttachment[];

    creation_date: Date;
}

export interface ArticleAttachment {
    id: number,
    id_article: number,

    attachment_url: string;
}

export class ArticleValidator {
    static validate(article: Article) {
        if (article.name.trim().length <= 0) {
            return "Vă rugăm să introduceți numele articolului.";
        }
        if (article.summary.trim().length <= 0) {
            return "Vă rugăm să introduceți descrierea articolului.";
        }
        if (article.attachment_array.length <= 0) {
            return "Trebuie să adaugați cel putin o imagine în articolul dvs.";
        }
        return "OK";
    }
}
