class User {
    name: string;
    email: string;
}

class BaseTariff {
    user: User;
    firstDay = true;
    type = 'base';
    constructor(user: User) {
        this.user = user;
    }
}

class BaseTariffPlus extends BaseTariff {
    secondDay = true;
    recording = true;
    type = 'base-plus';
}

class PremiumTariff extends BaseTariffPlus {
    dinner = true;
    networking = true;
    type = 'premium';
}