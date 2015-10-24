/* 
 * Algorithm by Nicholas Ooi
 *  - http://creativecommons.org/licenses/by-nc-sa/4.0/
 */

$(document).ready(function () {

    var appSettings = {};
    var contents = [];
    var appTitle = "";
    var rightButtonText = "";
    var rightButtonUrl = "";
    var coverImageUrl = "";

    if (typeof (Storage) !== "undefined") {

        try
        {
            initDataViaJson(JSON.parse(localStorage.getItem("appSettings")));
            populateData();
        }
        catch (e)
        {
        }
    } else {

        alert("Web Storage not supported!");

    }


    $(".settings").on('click', function () {

        window.location.replace("settings.html");

    });

    $(".donateButton").on('click', function () {

        window.location.replace(rightButtonUrl);

    });


    function initDataViaJson(json)
    {
        appSettings = json;
        appTitle = appSettings.appTitle;
        rightButtonText = appSettings.rightButtonText;
        coverImageUrl = appSettings.coverImageUrl;
        contents = appSettings.contents;
        rightButtonUrl = appSettings.rightButtonUrl;
        
        $(".coverImage").attr("src", coverImageUrl);
        $(".appTitle").text(appTitle);
        $(".donateButton").text(rightButtonText);
        for (var z = 0, len = contents.length; z < len; ++z)
        {
            var content = contents[z];
            $("                <div id=\"" + content.id + "\">\r\n                    <ul class=\'list\' style=\"border:none;\">\r\n                        <li class=\'comp\' style=\"background:#000;border:none;\">\r\n                            <div>\r\n                                \n\
<div style=\"position:relative;\"><img class=\"editableImg\" title=\"\" src=\"" + content.src + "\" style=\"height:235px;width:100%\" \/></div> \n\
\r\n                            <\/div>                        \r\n                        <\/li>\r\n                    <\/ul>\r\n                   \n\
 <p class=\"editableArea\" style=\"color: #fff;word-wrap:break-word;font-weight:normal;\">" + content.description + "<\/p>\n\
\r\n                <\/div>").insertBefore(".contentArea").hide().fadeIn();

        }
    }




});


