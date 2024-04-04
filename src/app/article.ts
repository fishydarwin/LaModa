export interface Article {
    id: number;
    idAuthor: number;
    idCategory: number;

    name: string;
    summary: string;
    attachmentArray: ArticleAttachment[];

    // creationDate: Date;
}

export interface ArticleAttachment {
    id: number,
    idArticle: number,

    attachmentUrl: string;
}

export class ArticleValidator {
    static validate(article: Article) {
        if (article.name.trim().length <= 0) {
            return "Vă rugăm să introduceți numele articolului.";
        }
        if (article.summary.trim().length <= 0) {
            return "Vă rugăm să introduceți descrierea articolului.";
        }
        if (article.attachmentArray.length <= 0) {
            return "Trebuie să adaugați cel putin o imagine în articolul dvs.";
        }
        return "OK";
    }
}
