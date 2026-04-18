interface PrintedItem {
    name: string;
    isbn: string;
    pagesCount: number;
    hasHardCover: boolean;
}

class Book implements PrintedItem {
    name: string;
    isbn: string;
    pagesCount: number;
    hasHardCover = true;
}

class ComicsBook implements PrintedItem {
    name: string;
    isbn: string;
    pagesCount: number;
    hasHardCover = false;
}