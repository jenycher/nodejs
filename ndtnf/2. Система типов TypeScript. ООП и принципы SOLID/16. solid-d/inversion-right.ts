interface BankCard {
    isDebit: boolean;
    issuedAt: number;
}

class TinkoffCard implements BankCard {
    isDebit = true;
    issuedAt = 153892187;
    // ...
}

class AlfaCard implements BankCard {
    isDebit = false;
    issuedAt = 253892187;
    // ...
}

class SberCard implements BankCard {
    isDebit = true;
    issuedAt = 253892187;
    // ...
}

class Bank {
    getMoney(card: BankCard, amount: number) {
        // ...
    }
}