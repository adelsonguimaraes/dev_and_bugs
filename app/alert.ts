interface AlertInterface {
    description: string,
    alerted: boolean
}

export class Alert {
    private static timeout: number|null
    static DROP_BUGS_3X = {
        description: 'Level 30:<br>Drop de Bugs aumenta 3x',
        alerted: false
    }
    static INSANE_MODE = {
        description: 'INSANE MODE',
        alerted: false
    }
    static PERFECT = {
        description: 'PERFECT',
        alerted: false
    }
    
    static isAlerted = (alert: AlertInterface) : boolean => alert.alerted
    static activeAlerted = (alert: AlertInterface) : boolean => alert.alerted = true
    static desactiveAlerted = (alert: AlertInterface) : boolean => alert.alerted = false

    static displayEventInfo = (alert : AlertInterface|string) => {
        if (alert==undefined) return false
        const msg = (typeof(alert) == 'string') ? alert : alert.description
        clearTimeout(this.timeout!)
        
        const divEventsInfo: HTMLDivElement = document.querySelector('div.events-info')!
        divEventsInfo.setAttribute("style", "display: flex;")
        divEventsInfo!.innerHTML = msg
        if (typeof(alert) != 'string') alert.alerted = true
        this.timeout = setTimeout((_)=>{
            this.timeout=null
            divEventsInfo!.setAttribute("style", "display: none;")
    }, 3000)
    }
}