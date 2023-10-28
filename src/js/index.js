import {
    getParsedStoredItemInSessionStorage,
    setItemInSessionStorage,
    setSubmitBtnToBeSteps,
    setSubmitBtnToSubmit,
    showElementAndAddText,
} from "./utils.js";
import { validateInputValuesInASection } from "./validators.js";
import { DEFAULT_SESSION_DATA } from "./consts.js";

function removeBackBtn() {
    const backBtn = document.getElementById("back-btn");
    const btnStepsContainer = document.getElementById("button-steps-container");

    if (backBtn && btnStepsContainer) {
        backBtn.style.display = "none";
        btnStepsContainer.style.justifyContent = "end";
    }
}

function addBackBtn() {
    const btnStepsContainer = document.getElementById("button-steps-container");
    const backBtn = document.getElementById("back-btn");

    if (backBtn && btnStepsContainer) {
        backBtn.style.display = "inline-flex";
        btnStepsContainer.style.justifyContent = "space-between";
    }
}

function removeCurrentActiveList() {
    const activeList = document.querySelector("#current-step-indicator-list [aria-current='step']");
    const stepFor = activeList.getAttribute("data-step");
    const currentSection = document.getElementById(stepFor);

    activeList.removeAttribute("aria-current");
    currentSection.setAttribute("aria-hidden", "true");
}

function emptyPersonalInfo() {
    const personalInfoInputs = document.querySelectorAll("#personal-info input");

    personalInfoInputs.forEach((input) => {
        input.value = "";
    });
}

async function loadSavedData() {
    const storedData = getParsedStoredItemInSessionStorage("formData");

    const nextBtn = document.getElementById("submit-btn");

    if (!storedData || storedData.currentStep <= 3) {
        setSubmitBtnToBeSteps();
    } else {
        setSubmitBtnToSubmit();
    }

    if (!storedData) {
        emptyPersonalInfo();

        return;
    }

    const currentStep = storedData.currentStep;
    const sections = document.querySelectorAll("#subscription-form > section");
    const currentListBasedOnCurrentStep = document.querySelector(
        `#current-step-indicator-list li:nth-child(${currentStep <= sections.length ? currentStep : sections.length})`,
    );
    const isThankYou = currentStep > sections.length
    const currentSectionBasedOnCurrentStep = !isThankYou ? sections[currentStep - 1] : document.getElementById("thank-you");

    removeCurrentActiveList();

    currentListBasedOnCurrentStep.setAttribute("aria-current", "step");
    currentSectionBasedOnCurrentStep.setAttribute("aria-hidden", "false");
    currentSectionBasedOnCurrentStep.removeAttribute("hidden");

    if (isThankYou) {
        const form = document.getElementById("subscription-form");

        form.setAttribute("hidden", "true");
    }

    switch (currentStep) {
        case 1:
            {
                const { loadSavedPersonalInfoData } = await import("./personal-info.js");

                loadSavedPersonalInfoData();
            }
            break;
        case 2:
            {
                const { loadSavedPersonalInfoData } = await import("./personal-info.js");
                const { loadSavedPlanData } = await import("./plan.js");

                loadSavedPersonalInfoData();
                loadSavedPlanData();
            }
            break;
        case 3:
            {
                const { loadSavedPersonalInfoData } = await import("./personal-info.js");
                const { loadSavedPlanData } = await import("./plan.js");
                const { loadSavedAddOnData } = await import("./addons.js");

                loadSavedPersonalInfoData();
                loadSavedPlanData();
                loadSavedAddOnData();
            }
            break;
        case 4: {
            const { loadSavedPersonalInfoData } = await import("./personal-info.js");
            const { loadSavedPlanData } = await import("./plan.js");
            const { loadSavedAddOnData } = await import("./addons.js");
            const { showSummary } = await import("./summary.js");

            loadSavedPersonalInfoData();
            loadSavedPlanData();
            loadSavedAddOnData();
            showSummary();
        }
    }

    if (currentStep > 1) {
        addBackBtn();
    }
}

function showPreviousStep() {
    const activeList = document.querySelector("#current-step-indicator-list [aria-current='step']");
    const stepFor = activeList.getAttribute("data-step");
    const previousList = activeList.previousElementSibling;

    const currentSection = document.getElementById(stepFor);
    const previousSection = currentSection.previousElementSibling;

    currentSection.setAttribute("aria-hidden", "true");
    activeList.removeAttribute("aria-current");

    previousList.setAttribute("aria-current", "step");
    previousSection.setAttribute("aria-hidden", "false");
}

function showNextStep() {
    const activeList = document.querySelector("#current-step-indicator-list [aria-current='step']");
    const stepFor = activeList.getAttribute("data-step");
    const nextList = activeList.nextElementSibling;

    const currentSection = document.getElementById(stepFor);
    const nextSection = currentSection.nextElementSibling;

    currentSection.setAttribute("aria-hidden", "true");
    activeList.removeAttribute("aria-current");

    nextList.setAttribute("aria-current", "step");
    nextSection.setAttribute("aria-hidden", "false");
}

async function handleNextBtnClick() {
    const storedData = getParsedStoredItemInSessionStorage("formData") || {
        ...DEFAULT_SESSION_DATA,
    };
    const sections = document.querySelectorAll("#subscription-form > section");

    switch (storedData.currentStep) {
        case 1:
            {
                const firstSectionId = sections[0].id;

                if (!validateInputValuesInASection(firstSectionId)) {
                    return;
                }

                const { loadSavedPlanData } = await import("./plan.js");
                const { getPersonalInfo } = await import("./personal-info.js");
                const inputValues = getPersonalInfo();

                storedData.data["personal-info"] = inputValues;
                loadSavedPlanData();
                addBackBtn();
            }
            break;
        case 2:
            {
                const { getChosenPlan } = await import("./plan.js");
                const chosenPlan = getChosenPlan();

                if (!chosenPlan) {
                    showElementAndAddText(
                        document.querySelector("[data-error='plan']"),
                        "Please choose a plan",
                    );

                    return;
                }

                const { loadSavedAddOnData } = await import("./addons.js");

                loadSavedAddOnData();
                storedData.data.plan = chosenPlan;
            }
            break;
        case 3:
        case 4:
            {
               const { showSummary } = await import("./summary.js");

                showSummary();
                setSubmitBtnToSubmit();
            }
            break;
        case 5: {
            const form = document.querySelector("#subscription-form");
            const thankYouContainer = document.getElementById("thank-you");

            form.setAttribute("hidden", "true");
            thankYouContainer.removeAttribute("hidden");
        }
            break;
    }

    if (storedData.currentStep < 3) {
        setSubmitBtnToBeSteps();
    }

    storedData.currentStep += 1;
    setItemInSessionStorage("formData", storedData);

    if (storedData.currentStep == sections.length + 1) {
        const form = document.getElementById("subscription-form");

        if (form) {
            return form.requestSubmit();
        }
    }

    showNextStep();
}

function handlePreviousBtnClick() {
    const storedData = getParsedStoredItemInSessionStorage("formData") || {
        ...DEFAULT_SESSION_DATA,
    };
    const currentStep = storedData.currentStep;

    if (currentStep > 1) {
        showPreviousStep();
        storedData["currentStep"] -= 1;
        setItemInSessionStorage("formData", storedData);

        if (currentStep == 2) {
            removeBackBtn();
        }
    }

    if (storedData.currentStep == 3) {
        setSubmitBtnToBeSteps();
    }
}

function attachListenerToPersonalInfoInputs() {
    const personalInfoInputs = document.querySelectorAll("#personal-info input");

    personalInfoInputs.forEach((input) => {
        input.addEventListener("keyup", () => {
            const storedData = getParsedStoredItemInSessionStorage("formData") || {
                ...DEFAULT_SESSION_DATA,
            };
            const name = input.getAttribute("name");
            const personalInfo = storedData.data["personal-info"];

            if (personalInfo) {
                storedData.data["personal-info"][name] = input.value;
            } else {
                storedData.data["personal-info"] = {};
                storedData.data["personal-info"][name] = input.value;
            }

            setItemInSessionStorage("formData", storedData);
        });

        input.addEventListener("change", () => {
            const storedData = getParsedStoredItemInSessionStorage("formData") || {
                ...DEFAULT_SESSION_DATA,
            };
            const name = input.getAttribute("name");
            const personalInfo = storedData.data["personal-info"];

            if (personalInfo) {
                storedData.data["personal-info"][name] = input.value;
            } else {
                storedData.data["personal-info"] = {};
                storedData.data["personal-info"][name] = input.value;
            }

            setItemInSessionStorage("formData", storedData);
        });
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const thankYouContainer = document.getElementById("thank-you");
    const form = document.getElementById("subscription-form");

    form.setAttribute("hidden", "true");
    thankYouContainer.removeAttribute("hidden");

    console.log("Your data:", getParsedStoredItemInSessionStorage("formData").data);
}

window.addEventListener("DOMContentLoaded", async () => {
    await loadSavedData();
    document.body.style.display = "block";

    const nextBtn = document.getElementById("submit-btn");
    const backBtn = document.getElementById("back-btn");
    const form = document.getElementById("subscription-form");

    attachListenerToPersonalInfoInputs();
    nextBtn.addEventListener("click", handleNextBtnClick);
    backBtn.addEventListener("click", handlePreviousBtnClick);
    form.addEventListener("submit", handleFormSubmit);

    const resetBtn = document.getElementById("reset-btn");

    resetBtn.addEventListener("click", async () => {
        sessionStorage.removeItem("formData");
        location.reload();
        await loadSavedData();
    });
});
