import {
    getParsedStoredItemInSessionStorage,
    hideElementAndRemoveItsText,
    setItemInSessionStorage,
} from "./utils.js";

const switchBtn = document.getElementById("yearly-monthly-switch");
const btnPlans = document.querySelectorAll("#plan #list-of-plans li button");

function setPlanMode(type) {
    const currentChosenPlan = document.querySelector(
        "#plan #yearly-monthly-switch-container [data-chosen='true']",
    );
    const chosenPlanInStoredSession = document.querySelector(
        `#plan #yearly-monthly-switch-container [data-plan='${type}']`,
    );
    const form = document.getElementById("subscription-form");

    form?.setAttribute("data-mode", type);
    currentChosenPlan?.removeAttribute("data-chosen");
    chosenPlanInStoredSession?.setAttribute("data-chosen", "true");

    if (type == "yearly") {
        switchBtn?.setAttribute("data-active", "true");
    } else {
        switchBtn?.removeAttribute("data-active");
    }
}

function setPlanTier(tier) {
    const activeBtn = document.querySelector("#plan #list-of-plans li button[data-active='true']");
    const btn = document.querySelector(`#plan #list-of-plans li button[data-tier='${tier}']`);

    activeBtn?.removeAttribute("data-active");
    btn.setAttribute("data-active", "true");
}

export function loadSavedPlanData() {
    const storedData = getParsedStoredItemInSessionStorage("formData");

    if (!storedData) {
        return;
    }

    const chosenPlan = storedData.data.plan;

    if (!chosenPlan) {
        return;
    }

    if (chosenPlan) {
        const type = chosenPlan.type;
        const tier = chosenPlan.tier;

        setPlanMode(type);
        setPlanTier(tier);
    }
}

export function getChosenPlan() {
    const activePlanEl = document.querySelector(
        "#yearly-monthly-switch-container [data-plan][data-chosen='true']",
    );
    const activePlan = activePlanEl?.getAttribute("data-plan");

    let chosenPlan;
    let chosenTier;

    if (!activePlan) {
        return;
    }

    const activeTierEl = document.querySelector(
        "#plan #list-of-plans li button[data-active='true']",
    );
    const activeTier = activeTierEl?.getAttribute("data-tier");

    if (!activeTier) {
        return;
    }

    chosenPlan = activePlan;
    chosenTier = activeTier;

    return {
        tier: chosenTier,
        type: chosenPlan,
    };
}

/** Session is assumed to be stored at this point. */

function handleSwitchPlan() {
    const activePlanEl = document.querySelector(
        "#yearly-monthly-switch-container [data-plan][data-chosen='true']",
    );
    const activePlan = activePlanEl?.getAttribute("data-plan");
    const storedData = getParsedStoredItemInSessionStorage("formData");

    hideElementAndRemoveItsText(document.querySelector("[data-error='plan']"));

    if (activePlan) {
        const newType = activePlan == "yearly" ? "monthly" : "yearly";

        if (!storedData.data["plan"]) {
            storedData.data["plan"] = {
                type: null,
                tier: null,
            };
        }

        storedData.data["plan"]["type"] = newType;
        setPlanMode(newType);
    } else {
        if (!storedData.data["plan"]) {
            storedData.data["plan"] = {
                type: null,
                tier: null,
            };
        }

        storedData.data["plan"]["type"] = newType;
        setPlanMode("yearly");
    }

    setItemInSessionStorage("formData", storedData);
}

switchBtn.addEventListener("click", handleSwitchPlan);

function handleChoosePlan(btn) {
    const storedData = getParsedStoredItemInSessionStorage("formData");

    if (!storedData.data["plan"]) {
        storedData.data["plan"] = {
            type: "monthly",
            tier: null,
        };
    }

    const tier = btn.getAttribute("data-tier");

    storedData.data["plan"]["tier"] = tier;
    setPlanTier(tier);
    setItemInSessionStorage("formData", storedData);
    hideElementAndRemoveItsText(document.querySelector("[data-error='plan']"));
}

btnPlans.forEach((btn) => {
    btn.addEventListener("click", () => handleChoosePlan(btn));
});
