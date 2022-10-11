

//#region Constants


const bakingTime = 1000 * 60 * 60 * 4; // 4 hours
const threshold = 1000 * 60 * 5; // 5 min +- threshold

const slots = [
    "slot1",
    "slot2",
    "slot3",
    "slot4",
    "slot5",
    "slot6",
    "slot7",
    "slot8",
    "slot9",
    "slot10",
    "slot11",
    "slot12",
    "slot13",
    "slot14"
];

const SlotState = {
    IDLE: 'IDLE',
    BAKING: 'BAKING',
    READY: 'READY',
    OVERBAKED: 'OVERBAKED',
};

//#endregion


//#region get elements from DOM

const dateField = document.getElementById("date");
const timeField = document.getElementById("time");
const slotsElements = slots.map(id => document.getElementById(id));


const nameOfSlot = document.getElementById("nameOfSlot");
const statusOfSlot = document.getElementById("statusOfSlot");

const saveButton = document.getElementById("saveButton");
const stopButton = document.getElementById("stopButton");

const operatorName = document.getElementById("operatorName");
const boardSerialNumber = document.getElementById("boardSerialNumber");

const mainFormElement = document.getElementById("mainForm");

//#endregion

//#region exportable data state
let exportableData = []

const addRecordToExportableData = (slot) => {
    const { id, isSelected, timeEnd, state, ...data } = slot;

    const { timeStarted } = data;

    const exportData = {
        ...data,
        date: getDateFromTimestamp(timeStarted),
        timeStarted: getTimeFromTimestamp(timeStarted),
        timeEnded: getTimeFromTimestamp(Date.now()),
        timeLapsed: getTimeLapsed(Date.now() - timeStarted),
    }


    exportableData.push(exportData);
    localStorage.setItem("exportableData", JSON.stringify(exportableData)); // save to local storage


}
//#endregion


//#region Persistant state in local storage

const saveState = () => {
    localStorage.setItem("state", JSON.stringify(state));
}

const loadState = () => {
    const state = localStorage.getItem("state");
    if (state) {
        setState(JSON.parse(state));
    }

    const expData = localStorage.getItem("exportableData");
    if (expData) {
        exportableData = JSON.parse(expData);
    }
}

loadState();

//#endregion


//#region Main state
const state = {};
const setState = (newState) => {

    const idElements = Object.keys(newState);
    idElements.forEach((id) => {

        const slotElement = document.getElementById(id);


        const keysState = Object.keys(newState[id]);
        keysState.forEach((key) => {

            if (state[id] && state[id][key] === newState[id][key]) return;

            if (key === 'isSelected') {
                if (newState[id][key]) {
                    slotElement.classList.add('selected');
                } else {
                    slotElement.classList.remove('selected');
                }
            }

            if (key === 'state') {
                if (state[id]?.state) {
                    slotElement.classList.remove(state[id].state);
                }
                slotElement.classList.add(newState[id][key]);
            }

            if (key === 'timer') {
                slotElement.querySelector('.timer').textContent = newState[id][key];
            }


            //update the state
            if (!state[id]) {
                state[id] = {};
            }
            state[id][key] = newState[id][key];
        })

    });
};

const initialState = slots.reduce((acc, id) => ({
    ...acc,
    [id]: {
        id,
        state: SlotState.IDLE,
        isSelected: false,
    }
}), {});

setState(initialState);


//#endregion


//#region SlotSelected state

let slotSelected = null;

const setSlotSelected = (dataSlot) => {
    if (!dataSlot) {
        nameOfSlot.style.visibility = "hidden";
        statusOfSlot.style.visibility = "hidden";
        operatorName.removeAttribute("disabled");
        operatorName.value = "";
        boardSerialNumber.removeAttribute("disabled");
        boardSerialNumber.value = "";
        saveButton.setAttribute("disabled", "");
        stopButton.setAttribute("disabled", "");

        slotSelected = null;
        return;
    }


    nameOfSlot.style.visibility = "visible";
    nameOfSlot.textContent = document.getElementById(dataSlot.id).querySelector('.nameSlot').textContent;

    statusOfSlot.style.visibility = "visible";
    statusOfSlot.textContent = dataSlot.state;

    if (dataSlot.state === SlotState.IDLE) {
        saveButton.removeAttribute("disabled");
    } else {
        operatorName.setAttribute("disabled", "");
        operatorName.value = dataSlot.operatorName;
        boardSerialNumber.setAttribute("disabled", "");
        boardSerialNumber.value = dataSlot.boardSerialNumber;
        stopButton.removeAttribute("disabled");
        dateField.value = getDateFromTimestamp(dataSlot.timeStarted);
        timeField.value = getTimeFromTimestamp(dataSlot.timeStarted);

    }



    slotSelected = dataSlot;
}

//#endregion


//#region Format date and time helper functions
const getDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString("en-GB", options);
}

const getTimeFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-GB");
}

const getTimeLapsed = (milliseconds) => {

    const entry = Math.abs(milliseconds);
    const seconds = Math.floor(entry / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const secondsLeft = seconds % 60;
    const minutesLeft = minutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

//#endregion


//#region Events


//#region Select Slot logic
slotsElements.forEach((slotElement) => {
    slotElement.addEventListener("click", (e) => {
        e.stopPropagation()

        if (slotSelected) {
            unselectSlots();
        }

        const newSelectedSlot = {
            ...state[slotElement.id],
            isSelected: true,
        }


        setState({
            ...state,
            [slotElement.id]: newSelectedSlot
        })


        setSlotSelected(newSelectedSlot);
    });
});

const unselectSlots = () => {
    const newState = Object.keys(state).reduce((acc, id) => ({
        ...acc,
        [id]: {
            ...state[id],
            isSelected: false,
        }
    }), {})

    setState(newState);

    setSlotSelected(null);

}

const wraper = document.getElementById("wraper");
wraper.addEventListener("click", () => {
    unselectSlots();
})
//#endregion


// Form click not trigger the click on the wraper
mainFormElement.addEventListener("click", (e) => {
    e.stopPropagation();
})


// Start baking button
mainFormElement.addEventListener("submit", (e) => {
    e.preventDefault();




    if (!slotSelected) return;

    const newSlot = {
        ...slotSelected,
        state: SlotState.BAKING,
        timeStarted: Date.now(),
        timeEnd: Date.now() + bakingTime,
        operatorName: operatorName.value,
        boardSerialNumber: boardSerialNumber.value,
    }

    setState({
        ...state,
        [slotSelected.id]: newSlot
    })

    setSlotSelected(newSlot);

    operatorName.value = "";
    boardSerialNumber.value = "";

    unselectSlots();
    saveState();
})



// Stop baking button
stopButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (!slotSelected) return;

    addRecordToExportableData(slotSelected);


    const newSlot = {
        ...slotSelected,
        state: SlotState.IDLE,
        timeStarted: null,
        timeEnd: null,
        operatorName: null,
        boardSerialNumber: null,
    }

    setState({
        ...state,
        [slotSelected.id]: newSlot
    })

    setSlotSelected(newSlot);

    operatorName.value = "";
    boardSerialNumber.value = "";

    unselectSlots();
    saveState();
})


//#region Export Data to xlsx

document.getElementById("exportButton").addEventListener("click", (e) => {

    const worksheet = XLSX.utils.json_to_sheet(exportableData, { header: ["operatorName", "boardSerialNumber", "date", "timeStarted", "timeEnded", "timeLapsed"] });
    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Board SN", "Date", "Start of Baking Process", "End of Baking Process", "Time Lapsed"]], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    ``
    /* calculate column width */

    worksheet["!cols"] = new Array(6).fill(0).map(() => ({ wch: 30 }))

    XLSX.writeFile(workbook, "Report.xlsx");

})

//#endregion

//#endregion


//#region Ticker

const tick = () => {
    const now = Date.now();

    if (!slotSelected || slotSelected.state == SlotState.IDLE) {
        dateField.value = getDateFromTimestamp(now);
        timeField.value = getTimeFromTimestamp(now);
    }

    slotsElements.forEach((slotElement) => {
        const slot = state[slotElement.id];
        if (slot.state !== SlotState.IDLE) {

            const diffTime = slot.timeEnd - now;

            const timeLapsed = getTimeLapsed(diffTime);

            const labelTimer = diffTime > 0 ? "BAKING" : "DONE";
            slotElement.querySelector('.timer').textContent = `${labelTimer} ${timeLapsed}`;


            if (Math.abs(diffTime) < threshold && slot.state !== SlotState.DONE) {
                const newSlot = {
                    ...slot,
                    state: SlotState.READY,
                }

                setState({
                    ...state,
                    [slot.id]: newSlot
                })


            }

            if (diffTime < 0 && Math.abs(diffTime) > threshold) {
                const newSlot = {
                    ...slot,
                    state: SlotState.OVERBAKED,
                }

                setState({
                    ...state,
                    [slot.id]: newSlot
                })
            }


        }
    })

}

const timer = setInterval(tick, 1000);

//#endregion
