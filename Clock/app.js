function setCurrentTime() {
    if (settings.is24HourClock && settings.isShowSeconds)
        $("#current-time").text(
            DateTime.local().toLocaleString(DateTime.TIME_24_WITH_SECONDS)
        );
    else if (settings.is24HourClock && !settings.isShowSeconds)
        $("#current-time").text(
            DateTime.local().toLocaleString(DateTime.TIME_24_SIMPLE)
        );
    else if (!settings.is24HourClock && !settings.isShowSeconds)
        $("#current-time").text(
            DateTime.local().toLocaleString(DateTime.TIME_SIMPLE)
        );
    else if (!settings.is24HourClock && settings.isShowSeconds)
        $("#current-time").text(
            DateTime.local().toLocaleString(DateTime.TIME_WITH_SECONDS)
        );

    let hour = DateTime.local().hour;
    if (hour >= 6 && hour < 12) {
        $("#greeting").html("Good Morning, Its' Currently");
    } else if (hour > +12 && hour < 18) {
        $("#greeting").html("Good Afternoon, Its' Currently");
    } else {
        $("#greeting").html("Good Evening, Its' Currently");
    }

    if (settings.isShowDate)
        $("#current-date").html(
            DateTime.local().toLocaleString(DateTime.DATE_FULL)
        );
    else {
        $("#current-date").html("");
    }
    updateMoreSettings();
}

let settings = JSON.parse(localStorage.getItem("settings")) || {
    is24HourClock: true,
    isShowSeconds: false,
    isShowDate: false,
};

let DateTime = luxon.DateTime;

$(document).ready(() => {
    $.get(
        "https://api.nasa.gov/planetary/apod?api_key=MrmSi6vmWcVstIpL7yKWovNiIzLm3Bs6sBpg8k02",
        (data, status) => {
            $("#app").css("background-image", `url('${data.url}')`);
            $("#app").css("background-image", `url(${data})`);
        }
    );
    updateSettingsButtons();
    setCurrentTime();
    setInterval(() => {
        setCurrentTime();
        updateMoreSettings();
    }, 100);
});

function showMore() {
    $("#moreMenu").css("visibility", "visible");
    var myPane = new CupertinoPane(
        "#moreMenu", // Pane container selector
        {
            parentElement: "body", // Parent container
            draggableOver: false,
            simulateTouch: false,
            pushMinHeight: 0,
            breaks: {
                bottom: { enabled: true, height: 1000 },
            },
        }
    );
    myPane.present({ animate: true });
}

function updateMoreSettings() {
    $("#currentDayOfWeek").html(
        DateTime.fromISO(DateTime.local()).toFormat("cccc")
    );
    $("#currentDateOfMonth").html(
        DateTime.fromISO(DateTime.local()).toFormat("dd")
    );
    $("#currentDayOfYear").html(
        DateTime.fromISO(DateTime.local()).toFormat("ooo")
    );
    $("#currentWeekOfYear").html(
        DateTime.fromISO(DateTime.local()).toFormat("WW")
    );
}

function updateSettingsButtons() {
    const showDateSettingsRadio = $("input[name='showDateSettings']");
    const showSecondsSettingsRadio = $("input[name='showSecondsSettings']");
    const hourClockSettingsRadio = $("input[name='hourClockSettings']");

    if (showDateSettingsRadio.is(":checked") === false) {
        showDateSettingsRadio
            .filter(settings.isShowDate ? "[value=yes]" : "[value=no]")
            .prop("checked", true);
    }
    if (showSecondsSettingsRadio.is(":checked") === false) {
        showSecondsSettingsRadio
            .filter(settings.isShowSeconds ? "[value=yes]" : "[value=no]")
            .prop("checked", true);
    }
    if (hourClockSettingsRadio.is(":checked") === false) {
        hourClockSettingsRadio
            .filter(settings.is24HourClock ? "[value=yes]" : "[value=no]")
            .prop("checked", true);
    }

    settings.is24HourClock =
        hourClockSettingsRadio.filter(":checked").val() == "yes" ? true : false;
    settings.isShowSeconds =
        showSecondsSettingsRadio.filter(":checked").val() == "yes" ? true : false;
    settings.isShowDate =
        showDateSettingsRadio.filter(":checked").val() == "yes" ? true : false;

    localStorage.setItem("settings", JSON.stringify(settings));
}

function openSettings() {
    $("#mainSidebar").addClass("show");
    $("#main").css("marginLeft", "250px");
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function saveSettings(e) {
    e.preventDefault();
    updateSettingsButtons();
    setCurrentTime();
    $("#mainSidebar").removeClass("show");
    $("#main").css("marginLeft", "0");
}