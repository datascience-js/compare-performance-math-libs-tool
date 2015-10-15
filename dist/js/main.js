
function getTimeNumpy() {
    var statement = $("#statementnumpy select option:selected" ).text(),
        number = $("#numbernumpy").val();

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/getTime",
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify({statement: statement, number: number}),
        dataType: 'json'
    }).done(function (evt) {
        $("#lblTimenumpy").text(evt.res);
    });
}

function getTimeEigen(){
    var statement = $("#statementeigen select option:selected" ).text(),
        number = $("#numbereigen").val(),
        myobj = {statement: statement, number: number};

    $.ajax({
        type: "POST",
        url: "http://localhost:58572/api/GetTimeEigen/postMeasureTime",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(myobj),
        dataType: 'json'
    }).done(function(evt) {
        $("#lblTimeeigen").text(evt);
    });
}

function getTimeNumjs(){
    var statement = $("#statementnumjs select option:selected" ).text(),
        number = $("#numbernumjs").val();

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getTimeOfNumjsFunctions",
        crossDomain: true,
        data: {statement: statement, number: number},
        dataType: 'json'
    }).done(function(evt) {
        $("#lblTimenumjs").text(evt.time);
    });
}

function getListOfNumpyFunctions(statementContainer){
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/getListOfNumpyFuncs",
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    }).done(function(evt) {
        createDropDownList(statementContainer, evt.res);
    });
}

function getListOfEigenFunctions(statementContainer){
    $.ajax({
        type: "GET",
        url: "http://localhost:58572/api/GetFunctionsNames/GetFunctionsList",
        crossDomain: true,
        dataType: 'json'
    }).done(function(evt) {
        createDropDownList(statementContainer, evt);
    });
}
function getListOfNumjsFunctions(statementContainer){
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getListOfNumjsFuncs",
        crossDomain: true,
        dataType: 'json'
    }).done(function(evt) {
        createDropDownList(statementContainer, evt);
    });
}

function createDropDownList(statementContainer, arr){
    var select = $("<select/>");
    for(var i=0; i<arr.length; i++){
        var opt = $("<option/>");
        opt.text(arr[i]);
        opt.attr('id', i);
        select.append(opt);
    }

    statementContainer.append(select);
}

$(document).ready(function(){
    var subContainers = [
        {cssClass:'numjs', getTimeFunc: getTimeNumjs, getFancsNames: getListOfNumjsFunctions},
        {cssClass:'numpy', getTimeFunc: getTimeNumpy, getFancsNames: getListOfNumpyFunctions},
        {cssClass:'eigen', getTimeFunc: getTimeEigen, getFancsNames: getListOfEigenFunctions}];

    createSubContainers(subContainers);
});

function createSubContainers(subContainers) {

    for (var i = 0; i < subContainers.length; i++) {
        var cont = $('<div />');
        cont.addClass('containerDivided');

        var subContainer = $('<div />');
        subContainer.addClass(subContainers[i].cssClass);

        var logoContainer = $('<div />');
        logoContainer.addClass('logoContainer');
        var logo = $('<img />');
        logo.attr('src', '/img/'+ subContainers[i].cssClass + '_logo.png');
        logoContainer.append(logo);

        var label = $('<span />');
        label.text('Insert statement: ');

        var statementContainer = $('<div/>');
        subContainers[i].getFancsNames(statementContainer);
        statementContainer.addClass('statement');
        statementContainer.attr('id', 'statement'+subContainers[i].cssClass)

        var labelNum = $('<span />');
        labelNum.text('Insert number of tests: ');

        var txtbNumber = $('<input />');
        txtbNumber.attr('type', 'text');
        txtbNumber.addClass('txtnumber');
        txtbNumber.attr('id', 'number'+subContainers[i].cssClass);

        var divGetTime = $('<div />');
        divGetTime.addClass('divGetTime');
        var btnGetTime = $('<input />');
        btnGetTime.attr('type', 'button');
        btnGetTime.val('Get Time');
        $(btnGetTime).click(subContainers[i].getTimeFunc);
        divGetTime.append(btnGetTime);

        var labelTime = $('<span />');
        labelTime.text('');
        labelTime.attr('id', 'lblTime'+subContainers[i].cssClass);

        subContainer.append(logoContainer);
        subContainer.append(label);

        subContainer.append(statementContainer);

        subContainer.append(labelNum);
        subContainer.append(txtbNumber);
        subContainer.append(divGetTime);
        subContainer.append(labelTime);

        cont.append(subContainer);
        $("#container").append(cont);
    }
}
