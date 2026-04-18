class TinkoffCard {
    // ...
}

class AlfaCard {
    // ...
}

class SberCard {
    // ...
}

type KnownCard = TinkoffCard | AlfaCard | SberCard;

class Bank {

    getMoney(card: KnownCard, amount: number) {
        // ...
    }
}