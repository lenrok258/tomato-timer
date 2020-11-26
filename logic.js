const TOMATO_MINUTES = 30;

var timerTaskId;
var flashScreenTaskId;
var timerOn = false;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function startTimer(duration, display) {
    timerOn = true;
    var timer = duration, minutes, seconds;
    timerTaskId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timerOn = false;
            clearInterval(timerTaskId);
            flashScreenTaskId = setInterval(flashScreen, 300);
            increaseCherryNumber();
            showLogsHistory();
            playSuccess();
        }
    }, 1000);
}

var flashStep = 1;
function flashScreen() {
    if (flashStep == 1) {
        document.bgColor = getRandomColor();
        flashStep = 2;
    } else {
        document.bgColor = getRandomColor();
        flashStep = 1;
    }
}

function startTheWorld() {
    $('div#message').show()
    var display = document.querySelector('#time');
    startTimer(60 * TOMATO_MINUTES, display);
    $('button#btn-start').attr("disabled", true);
    $('button#btn-stop').attr("disabled", false);
}

function stopTheWorld() {
    clearInterval(timerTaskId);
    clearInterval(flashScreenTaskId);
    document.bgColor = "FFFFFF";
    $('div#message').hide()
    if (timerOn) {
        increaseGhostNumber();
    }
    timerOn = false;
    showLogsHistory();
    $('button#btn-start').attr("disabled", false);
    $('button#btn-stop').attr("disabled", true);
}

function increaseCherryNumber() {
    if (readCherryNumber()) {
        writeCherryNumber(Number(readCherryNumber()) + 1);
    } else {
        writeCherryNumber(1);
    }
    refreshNumbers();
}

function cherryNumberVarName() {
    var d = new Date();
    return 'cherryNumber_' + d.getDate() + d.getMonth() + d.getFullYear();
}

function readCherryNumber() {
    return localStorage.getItem(cherryNumberVarName());
}

function writeCherryNumber(number) {
    localStorage.setItem(cherryNumberVarName(), number);
}

function increaseGhostNumber() {
    if (readGhostNumber()) {
        writeGhostNumber(Number(readGhostNumber()) + 1);
    } else {
        writeGhostNumber(1);
    }
    refreshNumbers();
}

function ghostNumberVarName() {
    var d = new Date();
    return 'ghostNumber_' + d.getDate() + d.getMonth() + d.getFullYear();
}

function readGhostNumber() {
    return localStorage.getItem(ghostNumberVarName());
}

function writeGhostNumber(number) {
    localStorage.setItem(ghostNumberVarName(), number);
}

function refreshNumbers() {
    $('#cherryNumber').html(readCherryNumber() || 0);
    $('#ghostNumber').html(readGhostNumber() || 0);
}

function getLogsHistory() {
    var results = [];
    var d = new Date();
    for (var day = d.getDate(); day >= 0; day--) {
        var cherry = localStorage.getItem('cherryNumber_' + day + d.getMonth() + d.getFullYear());
        var ghost = localStorage.getItem('ghostNumber_' + day + d.getMonth() + d.getFullYear());
        if (cherry || ghost) {
            results.push(day + ': ' + (cherry || 0) + '/' + (ghost || 0));
        }
    }
    return results;
}

function showLogsHistory() {
    var $daysLog = $('#daysLog');
    $daysLog.html('');
    getLogsHistory().forEach(function (element, index, array) {
        $daysLog.append(element + '<br/>');
    });
}

function playSuccess() {
    var audio = new Audio('applause.wav');
    audio.play();
    notifyMe('Hey there!', 'Another pomodoro finished. Good job!');
}

$(function () {
    refreshNumbers();
    showLogsHistory()
})

// Notifications

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function notifyMe(title, text) {
    if (!Notification) {
        alert('Desktop notifications not available in your browser');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: 'http://lenrok258.github.io/tomato-timer/images/cherry_icon.png',
            body: text,
        });

        notification.onclick = function () {
            notification.close();
            stopTheWorld();
        };

        notification.onclose = function () {
            stopTheWorld();
        };

    }
}
