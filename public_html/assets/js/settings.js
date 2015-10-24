/* 
 * Algorithm by Nicholas Ooi
 *  - http://creativecommons.org/licenses/by-nc-sa/4.0/
 */



$(document).ready(function () {

    var appSettings = {};
    var contents = [];
    var incrementId = 0;
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
// save button press save into localStorage.
        $(".saveButton").on('click', function () {

            appSettings = {"incrementId": incrementId, "appTitle": appTitle,"rightButtonUrl":rightButtonUrl, "rightButtonText": rightButtonText, "coverImageUrl": coverImageUrl, "contents": contents};
            $("#shareContent").html(JSON.stringify(appSettings));
            localStorage.setItem("appSettings", JSON.stringify(appSettings));
            toastMsg("Content and data are successfully saved!");
        });

        $(".importButton").on('click', function () {
            try
            {
                initDataViaJson(JSON.parse($("#importContent").val()));
                populateData();
                toastMsg("Content and data are successfully imported!");
            }
            catch (e)
            {
                toastMsg("Content and data are invalid.");
            }
        });

        $(".clearButton").on('click', function () {

            if (confirm("Are you sure to remove every content and data?"))
            {
                localStorage.clear();
                appSettings = {};
                contents = [];
                incrementId = 0;
                appTitle = "";
                rightButtonUrl = "";
                rightButtonText = "";
                coverImageUrl = "";
                window.location.replace("settings.html");
            }
        });

        var previewImage = " <div style=\"border: dashed;color:#eee;height:100px;width:100%;\">\r\n                                    <p style=\"text-align: center\">Cover Image Preview<\/p>\r\n                                <\/div>";

// Change app title
        $(".titleBox").change(function () {
            var title = $(this).val();
            $(".appTitle").hide().text(title).fadeIn();
            appTitle = title;
        });

        // Change right button text
        $(".rightHandButton").change(function () {
            var buttonText = $(this).val();
            $(".donateButton").hide().text(buttonText).fadeIn();
            rightButtonText = buttonText;
        });
        // Change right button text
        $(".rightHandButtonUrl").change(function () {
            var buttonUrl = $(this).val();
            rightButtonUrl = buttonUrl;
        });

// change cover image
        $(".coverImageUrl").change(function () {
            var imgUrl = $(this).val();
            coverImageUrl = imgUrl;

            $(".coverImage").hide().html("<img style=\"height:235px;width:100%;\" id=\"image_id\" src=\"" + imgUrl + "\" title=\"\" />").fadeIn();
            $("#image_id").error(function () {
                toastMsg("The image URL is invalid or does not exist, please make sure it is correct.");
                $(".coverImage").html(previewImage);
            });
        });

        $(".appTitle").on('click', function () {
            if (confirm("Have you saved? Are you sure to go back to home?")) {
                return true;
            } else {
                return false;
            }
        });


// add new Content
        $(".addNewButton").on('click', function () {

            var newImgUrl = $(".addContentImgUrl").val();
            var detail = $(".addDescription").val();


            incrementId++;

            generateContent(incrementId, newImgUrl, detail);

            var content = {"id": incrementId, "src": newImgUrl, "description": detail};

            contents.push(content);

        });

    } else {

        alert("Web Storage not supported!");

    }


    function generateContent(incrementId, newImgUrl, detail)
    {

        var handler = $("                <div id=\"" + incrementId + "\">\r\n                    <ul class=\'list\' style=\"border:none;\">\r\n                        <li class=\'comp\' style=\"background:#000;border:none;\">\r\n                            <div>\r\n                                \n\
<div style=\"position:relative;\"><img src=\"assets/img/Close.png\" style=\"width:50px;height:50px;position:absolute;right:-5px;top:0px;\" class=\"closeButton\" /><img class=\"editableImg\" title=\"\" src=\"" + newImgUrl + "\" style=\"height:235px;width:100%;\" \/></div> \n\
\r\n                            <\/div>                        \r\n                        <\/li>\r\n                    <\/ul>\r\n                   \n\
 <p class=\"editableArea\" style=\"color: #fff;word-wrap:break-word;font-weight:normal;\">" + detail + "<\/p>\n\
\r\n                <\/div>").insertBefore(".addContentArea").hide().fadeIn();

        var contentId = incrementId;



        var editableImgHandler = handler.find(".editableImg");

        // appearing the 
        editableImgHandler.on('click', function () {
            $(this).parent().find(".closeButton").hide();
        });


        // appearing close button
        editableImgHandler.on('hidden', function (e, reason) {
            $(this).parent().find(".closeButton").fadeIn("fast");
        });

        // Edit content Image url
        var imgVal = handler.find(".editableImg").attr("src");

        editableImgHandler.editable({
            type: 'text',
            mode: "inline",
            defaultValue: imgVal,
            emptytext: 'Enter Image URL',
            success: function (response, newValue) {

                $(this).attr("src", newValue);

                var id = $(this).parent().attr("id");

                for (var z = 0, l = contents.length; z < l; ++z)
                {
                    content = contents[z];
                    if (id == content.id)
                    {
                        content.src = newValue;
                        break;
                    }
                }

                $(this).parent().find(".closeButton").show();
            }
        });


// Edit Content Details
        handler.find(".editableArea").editable({
            type: 'textarea',
            mode: "inline",
            emptytext: "Enter your description",
            success: function (response, newValue) {

                var id = $(this).parent().attr("id");

                for (var z = 0, l = contents.length; z < l; ++z)
                {
                    content = contents[z];
                    if (id == content.id)
                    {
                        content.description = newValue;
                        break;
                    }
                }


            }
        });


//Delete Content
        handler.find(".closeButton").on('click', function () {
            if (confirm("Are you sure to remove?")) {
                handler.remove();
                contents = removeObjectFromArray(contents, parseInt(handler.attr("id")));
            }
        });

        handler.find(".editableImg").error(function () {
            toastMsg("The image URL is invalid or does not exist, please make sure it is correct.");
            $(handler).remove();
            contents = removeObjectFromArray(contents, contentId);
        });
    }

    function populateData()
    {
        try
        {
            $(".titleBox").val(appTitle);
            $(".rightHandButton").val(rightButtonText);
            $(".rightHandButtonUrl").val(rightButtonUrl);
            $(".coverImageUrl").val(coverImageUrl);
            
            $(".appTitle").hide().text(appTitle).fadeIn();
            $(".donateButton").hide().text(rightButtonText).fadeIn();
            $(".coverImage").hide().html("<img style=\"height:235px;width:100%;\" id=\"image_id\" src=\"" + coverImageUrl + "\" title=\"\" />").fadeIn();
            $("#image_id").error(function () {
                toastMsg("The image URL is invalid or does not exist, please make sure it is correct.");
                $(".coverImage").html(previewImage);
            });
            for (var z = 0, len = contents.length; z < len; ++z)
            {
                var content = contents[z];
                generateContent(content.id, content.src, content.description);
            }

        }
        catch (e)
        {
            toastMsg("There is an error populating the data.");
        }


    }

    function initDataViaJson(json)
    {
        appSettings = json;
        incrementId = appSettings.incrementId;
        appTitle = appSettings.appTitle;
        rightButtonText = appSettings.rightButtonText;
        rightButtonUrl = appSettings.rightButtonUrl;
        coverImageUrl = appSettings.coverImageUrl;
        contents = appSettings.contents;
        $("#shareContent").html(JSON.stringify(appSettings));
    }



    function removeObjectFromArray(arr, id)
    {
        return $.grep(arr, function (data, index) {
            return data.id !== id;
        });
    }

    function toastMsg(msg)
    {

        $('.error').text(msg).fadeIn(400).delay(2000).fadeOut(400);
    }


});