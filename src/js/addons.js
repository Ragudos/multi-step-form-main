import { getParsedStoredItemInSessionStorage, setItemInSessionStorage } from "./utils.js";

const addOnBtns = document.querySelectorAll("#add-ons #list-of-add-ons li input[type='checkbox']");

function setActiveAddOn(addOn, isChosen) {
    const addOnEl = document.querySelector(
        `#add-ons #list-of-add-ons li label[for='${addOn}-addon']`,
    );
    const addOnInput = document.querySelector(
        `#add-ons #list-of-add-ons li input[type='checkbox'][id='${addOn}-addon']`
    )

    if (isChosen) {
        addOnEl?.setAttribute("data-active", "true");
        addOnInput.setAttribute("checked", "true");
    } else {
        addOnEl?.removeAttribute("data-active");
        addOnInput.removeAttribute("checked");
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
    btn.addEventListener("change", () => {
        const addOn = btn.getAttribute("name");
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
