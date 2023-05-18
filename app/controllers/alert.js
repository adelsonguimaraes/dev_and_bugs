var _a;
class Alert {
}
_a = Alert;
Alert.DROP_BUGS_3X = {
    description: 'Level 30:<br>Drop de Bugs aumenta 3x',
    alerted: false
};
Alert.INSANE_MODE = {
    description: 'INSANE MODE',
    alerted: false
};
Alert.PERFECT = {
    description: 'PERFECT',
    alerted: false
};
Alert.isAlerted = (alert) => alert.alerted;
Alert.activeAlerted = (alert) => alert.alerted = true;
Alert.desactiveAlerted = (alert) => alert.alerted = false;
Alert.displayEventInfo = (alert) => {
    if (alert == undefined)
        return false;
    const msg = (typeof (alert) == 'string') ? alert : alert.description;
    clearTimeout(_a.timeout);
    const divEventsInfo = document.querySelector('div.events-info');
    divEventsInfo.setAttribute("style", "display: flex;");
    divEventsInfo.innerHTML = msg;
    if (typeof (alert) != 'string')
        alert.alerted = true;
    _a.timeout = setTimeout((_) => {
        _a.timeout = null;
        divEventsInfo.setAttribute("style", "display: none;");
    }, 3000);
};
export { Alert };
