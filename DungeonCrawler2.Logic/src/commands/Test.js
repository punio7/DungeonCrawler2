"use strict";
class Test extends Command {
    ExecuteBody(command) {
        Engine.Output(command.getCommand() + " " + command.getNumber(1) + command.getArgument(1) + " " + command.getNumber(2) + command.getArgument(2) + " " + Game.getName() + " aaa");

        Engine.Output("Nazywam się |b{0}|W. Tak |B{0}|W to właśnie moje imię. A nie, może to jednak |R{1}|W? Nieee, chyba |G{2}|W... Nie, to nie to... Wiem! |P{3}|W to moje prawdziwe imię!"
            .format("Game.Player.getName()", "Wojtek Pędziwór", "Skrzypek Nadachu", "Zdziocho Moczywąs"));
        Engine.Output("Czas na kolor test!");
        Engine.Output("|bDark Blue{0}|BBlue".format(Engine.NonBreakingSpace.repeat(3)));
        Engine.Output("|gDark Green{0}|GGreen".format(Engine.NonBreakingSpace.repeat(2)));
        Engine.Output("|cDark Cyan{0}|CCyan".format(Engine.NonBreakingSpace.repeat(3)));
        Engine.Output("|rDark Red{0}|RRed".format(Engine.NonBreakingSpace.repeat(4)));
        Engine.Output("|pDark Purple |PPurple".format(Engine.NonBreakingSpace));
        Engine.Output("|yDark Yellow |YYellow".format(Engine.NonBreakingSpace));
        Engine.Output("|sDark Grey{0}|SGrey".format(Engine.NonBreakingSpace.repeat(3)));
        throw "Test exception";
    }
};