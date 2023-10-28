import { getParsedStoredItemInSessionStorage, setItemInSessionStorage } from "./utils.js";

const addOnBtns = document.querySelectorAll("#add-ons #list-of-add-ons li button");

function setActiveAddOn(addOn, isChosen) {
    const addOnEl = document.querySelector(
        `#add-ons #list-of-add-ons li button[data-addon='${addOn}']`,
    );

    if (isChosen) {
        addOnEl?.setAttribute("data-active", "true");
    } else {
        addOnEl?.removeAttribute("data-active");
    }
}

export function loadSavedAddOnData() {
    const storedData = getParsedStoredItemInSessionStorage("formData");
    const addOns = storedData.data["add-ons"];

    if (addOns) {
        for (const addOn in addOns) {
            const isChosen = storedData.data["add-ons"][addOn];
            setActiveAddOn(addOn, isChosen);
        }
    }
}

addOnBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const addOn = btn.getAttribute("data-addon");
        const storedData = getParsedStoredItemInSessionStorage("formData");

        if (!storedData.data["add-ons"]) {
            storedData.data["add-ons"] = {
                [addOn]: true,
            };

            setActiveAddOn(addOn, true);
        } else {
            const oppositeVal = !storedData.data["add-ons"][addOn] ?? true;

            storedData.data["add-ons"][addOn] = oppositeVal;
            setActiveAddOn(addOn, oppositeVal);
        }

        setItemInSessionStorage("formData", storedData);
    });
});
