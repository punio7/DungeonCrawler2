"use strict";
class GrammaCaseEnum {
    constructor() {
        this.Mianownik = 0;     //kogo co jest
        this.Dopelniacz = 1;    //kogo czego nie ma
        this.Celownik = 2;      //komu czemu sie przygladam
        this.Biernik = 3;       //kogo co widze
        this.Narzednik = 4;     //z kim z czym ide
        this.Miejscownik = 5;   //o kim o czym mowie
        this.Wolacz = 6;        //o kogoz to moje skromne oczy maja zaszczyt postrzegac
    }

    parse(grammaCaseString) {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if (key == grammaCaseString) {
                    return this[key];
                }
            }
        }
        return null;
    }
}

var GrammaCase = new GrammaCaseEnum();
Object.freeze(GrammaCase);