

window.onload = function() {
    Init();

    $('#executeButton').click(() => {
        let message = $('#consoleInput').val();
        $('#consoleInput').val('');
        Engine.Output(message);
        Engine.Input = message;
        Execute(Engine.Input);
    });

    $("#consoleInput").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#executeButton").click();
        }
    });
}
