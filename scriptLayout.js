const ovenSctructure = document.getElementById("ovenSctructure");
const SlotState = {
  IDLE: "IDLE",
  BAKING: "BAKING",
  READY: "READY",
  OVERBAKED: "OVERBAKED",
};

const BoardSource = {
  SMA: "SMA",
  FA: "FA",
  TRSH: "TRSH",
  CLAIM: "CLAIM",
  OTHER: "OTHER",
};

const ovenConstant = {
  horizontalSlots: 3,
  subSlotLetters: ["A", "B", "C", "D", "E"],
  totalNumberSlot: 13,
};

const createSlot = () => {
  const slot = document.createElement("div");
  slot.classList.add("slot");
  return slot;
};

const createSubslot = (
  slotNumber,
  subSlotLetter,
  active = false,
  state = "IDLE",
  time = ""
) => {
  const subSlot = document.createElement("div");
  subSlot.classList.add("subSlot", state);

  active && subSlot.classList.add("selected");
  subSlot.addEventListener("click", (e) => {
    subSlot.parentElement.querySelectorAll(".selected").forEach((selected) => {
      selected.classList.remove("selected");
    });

    subSlot.classList.add("selected");
  });

  const timeRemaining = document.createElement("div");
  timeRemaining.classList.add("timeRemaining");
  timeRemaining.innerText = time;

  const slotState = document.createElement("div");
  slotState.classList.add("slotState");
  slotState.innerText = state;

  subSlot.innerText = `SLOT ${slotNumber}.${subSlotLetter}`;
  subSlot.appendChild(timeRemaining);
  subSlot.appendChild(slotState);

  return subSlot;
};

const container = document.getElementById("container");

const printOven = (ovenState) => {
  // creating vertical slots
  for (let idSlot = 1; idSlot <= ovenConstant.horizontalSlots; idSlot++) {
    const slot = document.createElement("div");
    slot.classList.add("hSlot");
    slot.id = `slot${idSlot}`;

    // creating subslots
    ovenConstant.subSlotLetters.forEach((letter, index) => {
      const data = ovenState.find(
        (item) => item.slot === idSlot && item.subSlot === letter
      );

      const subSlot = data
        ? createSubslot(idSlot, letter, index === 0, data?.state, data?.time)
        : createSubslot(idSlot, letter, index === 0);

      slot.appendChild(subSlot);
    });

    ovenSctructure.appendChild(slot);
  }

  // creating horizontal slots

  const verticalSection = document.createElement("div");
  verticalSection.classList.add("verticalSection");

  for (
    let idSlot = ovenConstant.horizontalSlots + 1;
    idSlot <= ovenConstant.totalNumberSlot;
    idSlot++
  ) {
    const data = ovenState.find((item) => item.slot === idSlot);

    const time = data?.time || "";
    const state = data?.state || "IDLE";

    const slot = document.createElement("div");
    slot.classList.add("vSlot", state);
    slot.id = `slot${idSlot}`;


    const timeRemaining = document.createElement("div");
    timeRemaining.classList.add("timeRemaining");
    timeRemaining.innerText = time;

    const slotState = document.createElement("div");
    slotState.classList.add("slotState");
    slotState.innerText = state;

    // nameSlot

    const nameSlot = document.createElement("div");
    nameSlot.classList.add("nameSlot");
    nameSlot.innerText = `SLOT ${idSlot}`;

    slot.appendChild(nameSlot);
    slot.appendChild(timeRemaining);
    slot.appendChild(slotState);

    verticalSection.appendChild(slot);
  }

  ovenSctructure.appendChild(verticalSection);
};

const testOvenState = [
  {
    slot: 1,
    subSlot: "C",
    state: SlotState.BAKING,
    time: "00:59:01",
  },
  {
    slot: 10,
    state: SlotState.BAKING,
    time: "00:59:01",
  },
  {
    slot: 3,
    subSlot: "A",
    state: SlotState.BAKING,
    time: "00:09:01",
  },
];

printOven(testOvenState);
