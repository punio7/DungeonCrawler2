"use strict";
class ItemsListPrinterClass  {
    PrintLongFormat(itemsList) {
        let returnString = "";
        itemsList.forEach(item => {
            if (returnString !== "") {
                returnString +=  Engine.EndLine;
            }
            returnString += "    " + item.getName().startWithUpper() + " " + item.Idle;
        });
        return returnString;
    }
};

var ItemsListPrinter = new ItemsListPrinterClass();