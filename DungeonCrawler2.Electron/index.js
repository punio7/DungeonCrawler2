

window.onload = function() {
    Init();

    $('#executeButton').click(() => {
        let message = $('#consoleInput').val();
        $('#consoleInput').val('');
        Engine.Output(message);
        Engine.Input = message;
        Execute(Engine.Input);
    });

    //Enter key on input
    $("#consoleInput").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#executeButton").click();
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
