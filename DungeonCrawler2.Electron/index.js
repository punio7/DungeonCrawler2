var comHistory = [];
var historyIndex = -1;

window.onload = function () {
    Init();

    $('#executeButton').click(() => {
        let message = $('#consoleInput').val();
        $('#consoleInput').val('');
        Engine.Output(message);
        Engine.Input = message;
        Execute(Engine.Input);
        if (message != '') {
            comHistory.push(message);
        }
        historyIndex = comHistory.length - 1;
    });

    $("#consoleInput").keyup(function (event) {
        //Enter key on input
        if (event.keyCode === 13) {
            $("#executeButton").click();
        }
        //Up and down keys to navigate command history
        else if (event.keyCode === 38) {
            if (historyIndex > -1) {
                $("#consoleInput").val(comHistory[historyIndex--]);
            }
        }
        else if (event.keyCode === 40) {
            if (historyIndex < comHistory.length - 1) {
                $("#consoleInput").val(comHistory[++historyIndex]);
            }
            else {
                $("#consoleInput").val('');
            }
        }
    });

    //ESC to skip printert
    $(document).keyup((event) => {
        if (event.keyCode === 27) {
            SkipPrinter();
        }
    });

    window.addEventListener('error', (event) => {
        Engine.Output("|RWystąpił błąd, szczegóły w oknie konsoli.");
        ResumeExecution();
    });

    $("#consoleInput").focus();
}
