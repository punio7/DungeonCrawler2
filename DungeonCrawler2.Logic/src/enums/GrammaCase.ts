import { EnumHelper } from "./EnumHelper";

export enum GrammaCase {
    Mianownik = 0, //kogo co jest
    Dopelniacz = 1, //kogo czego nie ma
    Celownik = 2, //komu czemu sie przygladam
    Biernik = 3, //kogo co widze, upuszczam
    Narzednik = 4, //z kim z czym ide
    Miejscownik = 5, //o kim o czym mowie
    Wolacz = 6, //o kogoz to moje skromne oczy maja zaszczyt postrzegac
}

class GrammaCaseHelperClass extends EnumHelper<GrammaCase> {
    constructor() {
        super(GrammaCase);
    }
}

export var GrammaCaseHelper = new GrammaCaseHelperClass();
