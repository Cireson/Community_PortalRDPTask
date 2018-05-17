// Set permissions for the task for Incident
app.custom.formTasks.add('Incident', null, function (formObj, viewModel) {
	formObj.boundReady(function(){
		var vm = pageForm.viewModel;
		//If the user is not an analyst, hide the task
		if (!session.user.Analyst) { 
			$( ".taskmenu li:contains('Launch RDP')" ).hide();
		} 
	});
	return;
});

// Add task for Incident
app.custom.formTasks.add('Incident', "Launch RDP", function (formObj, viewModel) {

    RDP();
    
});

// Set permissions for the task for Change
app.custom.formTasks.add('ChangeRequest', null, function (formObj, viewModel) {
	formObj.boundReady(function(){
		var vm = pageForm.viewModel;
		//If the user is not an analyst, hide the task
		if (!session.user.Analyst) { 
			$( ".taskmenu li:contains('Launch RDP')" ).hide() ;
		} 
	});
	return;
});

// Add task for Change
app.custom.formTasks.add('ChangeRequest', "Launch RDP", function (formObj, viewModel) {

    RDP();
    
});

function RDP() {

    var CIList = [];

    pageForm.viewModel.HasRelatedWorkItems.forEach(function (CI) {
        // If Windows Computer or System Center Managed Computer (Server OS) Class
        if (CI.ClassTypeId == "ea99500d-8d52-fc52-b5a5-10dcd1e9d2bd" || CI.ClassTypeId == "e1ae9104-c9a3-467f-adba-33f801db7d37") {
            CIList.push({Text: CI.DisplayName, Id: CI.DisplayName});
        }
        else if (typeof(CI.ClassTypeId) == "undefined") { // Must have just been added to the form so we need to get its type
            $.ajax({
                url: "/api/v3/Dashboard/GetDashboardDataById/?BaseId=" + CI.BaseId + "&queryId=6d4ed0b1-6555-2a7a-5f25-c0a6295608a7",
                type: "GET",
                dataType: "json",
                contentType: 'application/json; charset=UTF-8',
                async: false,
                success: function (classType) {
                    if (classType[0].ObjectClassId == "ea99500d-8d52-fc52-b5a5-10dcd1e9d2bd" || classType[0].ObjectClassId == "e1ae9104-c9a3-467f-adba-33f801db7d37") {
                        CIList.push({Text: CI.DisplayName, Id: CI.DisplayName});
                    }
                }
            });
        }
    })

    if (CIList.length > 0) {

        $('body').find("#RDPHTML").remove();
        //use requirejs to load the HTML template first
        require(["text!/CustomSpace/RDPTask/RDPWindow.html"], function (template) {
            //make a jQuery obj
            cont = $(template);
                
            //create a view model to handle the UX
            var _RDPWindow = new kendo.observable({
                CIDropDown: CIList,
                okClick: function () {
                    //They clicked OK
                    var device = $('#CIDropDownSelect').val();
                    RDPWindow.close();
                    // Hitting the app-launcher url handler will make the browser think it is navigatng away.
                    // If the page is dirty, this will cause a popup
                    // Check the dirty status, if dirty, make a note of that and then set it false
                    // Reset to dirty after the call if needed
                    var dirty = false;
                    if (pageForm.viewModel.isDirty) {
                        dirty = true;
                        pageForm.viewModel.isDirty = false;
                    }
                    // This is the app-launcher call
                    window.location = 'cireson-app-launcher://launch/rdp?client=' + device;
                    if (dirty) {
                        setTimeout(function() {
                            pageForm.viewModel.isDirty = true;
                        }, 1000);
                    }
                },
                cancelClick: function () {
                    RDPWindow.close();
                }
            });
            
            //create the kendo window
            RDPWindow = cont.kendoWindow({
                title: "Launch RDP",
                resizable: false,
                modal: true,
                viewable: false,
                width: 500,
                height: 300,
                close: function () {
                },
                activate: function () {
                    //on window activate bind the view model to the loaded template content
                    kendo.bind(cont, _RDPWindow);
                }
            }).data("kendoWindow");
            
            //now open the window
            RDPWindow.open().center();
        });
    }
    else {
        $('body').find("#RDPHTML").remove();
        //use requirejs to load the HTML template first
        require(["text!/CustomSpace/RDPTask/RDPErrorWindow.html"], function (template) {
            //make a jQuery obj
            cont = $(template);
                
            //create a view model to handle the UX
            var _RDPErrorWindow = new kendo.observable({

                okClick: function () {
                    RDPErrorWindow.close();
                },
            });
            
            //create the kendo window
            RDPErrorWindow = cont.kendoWindow({
                title: "Launch RDP",
                resizable: false,
                modal: true,
                viewable: false,
                width: 500,
                height: 200,
                close: function () {
                },
                activate: function () {
                    //on window activate bind the view model to the loaded template content
                    kendo.bind(cont, _RDPErrorWindow);
                }
            }).data("kendoWindow");
            
            //now open the window
            RDPErrorWindow.open().center();
        });
    }
}