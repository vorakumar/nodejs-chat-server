var sessionId = "";
var baseURL = 'http://localhost:8080/';

var disableLoginWhenUsernameMissing = function (usernameField, loginButton) {
    if (usernameField.val().trim().length === 0) {
        loginButton.attr('disabled', 'disable');
    } else {
        loginButton.removeAttr('disabled');
    }
};

var onSuccessfulLogin = function (data) {
    console.log(data);
    sessionId = data["sessionId"];
    $('#chat_container').show();
    $('#login_container').hide();
    getNewMessages(new Date());
};

var loginUser = function () {
    var url = baseURL + 'join/' + $('#username').val();
    $.ajax({
        url:url,
        dataType:'json',
        success:onSuccessfulLogin
    });
};

var sendMessageToServer = function (message) {
    var url = baseURL + 'send/' + sessionId;
    $.ajax({
        url:url,
        dataType:'json',
        type: 'POST',
        data: 'msg='+message,
        success:function () {
            $('#chat_area').val($('#chat_area').val() + "\nme: " + message);
        }
    });
};

var sendMessage = function () {
    var messageField = $('#message');
    var message = messageField.val().trim();
    if (message.length !== 0) {
        sendMessageToServer(message);
    }
};

var getNewMessages = function (lastMessageTimestamp) {
    var url = baseURL + 'recv/' + sessionId + '?since='+lastMessageTimestamp;
    $.ajax({
        url:url,
        dataType:'json',
        success:function (messages) {
            var out = "\n";
            var lastMessageTimestamp;
            while(messages.length > 0) {
                var m = messages.shift();
                out += m.sender+": "+ m.text+" \n";
                lastMessageTimestamp = m.timestamp;
            }
            $('#chat_area').val($('#chat_area').val() +out);
            setTimeout(function() {
                getNewMessages(lastMessageTimestamp);
            },1);
        }
    });
};


$(document).ready(function () {
    var usernameField = $('#username');
    var loginButton = $('#login');
    var sendMessageButton = $('#sendMessage');

    $('#chat_container').hide();
    disableLoginWhenUsernameMissing(usernameField, loginButton);

    usernameField.change(function () {
        disableLoginWhenUsernameMissing(usernameField, loginButton);
    });

    loginButton.click(loginUser);
    sendMessageButton.click(sendMessage);

});