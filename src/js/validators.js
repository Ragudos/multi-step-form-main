import { isEmailValid, isNameValid, isPhoneNumberPhilippineValid } from "./utils.js";

const validatorsForEachInput = {
    "personal-info": {
        "name-input": isNameValid,
        "email-input": isEmailValid,
        "phone-number-input": isPhoneNumberPhilippineValid,
    },
};

function setInputToRemoveErrorOnKeyUp(input, errorContainer) {
    input.addEventListener(
        "keyup",
        () => {
            if (errorContainer) {
                errorContainer.textContent = "";
                errorContainer.style.display = "none";

                input.removeAttribute("data-invalid");
            }
        },
        {
            once: true,
        },
    );
}

export function validateInputValuesInASection(sectionId) {
    const allInputsInThisSection = document.querySelectorAll(`#${sectionId} input`);
    let isAnyInputInvalid = false;

    for (const input of allInputsInThisSection) {
        const inputId = input.id;
        const validator = validatorsForEachInput[sectionId][inputId];

        if (input.value && !validator) {
            continue;
        }

        const errorContainer = document.querySelector(`[data-error='${inputId}']`);
        const inputName = input.getAttribute("data-label");

        if (input.value) {
            if (validator(input.value)) {
                continue;
            }

            if (errorContainer) {
                errorContainer.textContent = `Valid ${inputName.toLowerCase()} is required.`;
                errorContainer.style.display = "block";

                input.setAttribute("data-invalid", "true");

                setInputToRemoveErrorOnKeyUp(input, errorContainer);
                isAnyInputInvalid = true;

                continue;
            }
        }

        if (!input.value) {
            if (errorContainer) {
                errorContainer.textContent = `${inputName} cannot be empty.`;
                errorContainer.style.display = "block";

                input.setAttribute("data-invalid", "true");
                setInputToRemoveErrorOnKeyUp(input, errorContainer);

                isAnyInputInvalid = true;
            }
        }
    }

    return !isAnyInputInvalid;
}
