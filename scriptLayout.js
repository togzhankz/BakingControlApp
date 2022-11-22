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
  verticalSlots: 10,
};

const createSlot = () => {
  const slot = document.createElement("div");
  slot.classList.add("slot");
  return slot;
};

const createSubslot = (
  slotNumber,
  subSlotLetter,
  state = "IDLE",
  time = ""
) => {
  const subSlot = document.createElement("div");
  subSlot.classList.add("subSlot", state);

  subSlot.addEventListener("click", (e) => {
    subSlot.classList.toggle("selected");
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

    ovenConstant.subSlotLetters.forEach((letter) => {
      const subSlot = createSubslot(idSlot, letter);

      slot.appendChild(subSlot);
    });

    ovenSctructure.appendChild(slot);
  }
};

const testOvenState = [
  {
    id: "1-1",
    slot: 1,
    subSlot: 1,
    state: SlotState.BAKING,
    timeStarted: new Date(),
    timeEnd: new Date(),
    operatorName: "John",
    boardSerialNumber: "1234567890",
    boardSource: BoardSource.SMA,
  },
];

printOven(testOvenState);
