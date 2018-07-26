"use strict";
class Test extends Command {
    ExecuteBody(command) {
        Engine.Output(command.getCommand() + " " + command.getNumber(1) + command.getArgument(1) + " " + command.getNumber(2) + command.getArgument(2) + " " + Game.getName() + " aaa");

        Engine.Output("Nazywam się |b{0}|W. Tak |B{0}|W to właśnie moje imię. A nie, może to jednak |R{1}|W? Nieee, chyba |G{2}|W... Nie, to nie to... Wiem! |P{3}|W to moje prawdziwe imię!"
            .format("Game.Player.getName()", "Wojtek Pędziwór", "Skrzypek Nadachu", "Zdziocho Moczywąs"));

        throw "Test exception";
    }
};