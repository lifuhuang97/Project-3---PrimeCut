export default class Recipe {
    constructor(...details) {
        this.name = details.name;
        this.p = details.p;
        this.f = details.f;
        this.c = details.c;
        if (!details.cal) {
            this.cal = this.calcCalories();
        } else {
            this.cal = details.cal;
        }
    }

    calcCalories() {
        let totalCal = 0;
        totalCal += this.p * 4 + this.c * 4 + this.f * 9;
        return totalCal;
    }

    convertToObject() {
        return { name, p, c, f, cal };
    }
}
