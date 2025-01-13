import {
  reactExtension,
  TextField,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from "@shopify/ui-extensions-react/checkout";
import React, { useState } from "react";
// Set the entry point for the extension
export default reactExtension("purchase.checkout.contact.render-after", () => (
  <App />
));

function App() {
  // Get the referrer or source from URL
  const [source, setSource] = useState("");
  const [age, setAge] = useState("");

  // Define age requirements for different sources
  const getAgeTarget = (age) => {
    switch (age.toLowerCase()) {
      case "alcohol":
        return 21;
      case "mature":
        return 18;
      case "teen":
        return 13;
      default:
        return 18; // default age requirement
    }
  };

  // Get the target age based on source
  const ageTarget = getAgeTarget(source);

  // Set up the app state
  const [validationError, setValidationError] = useState("");
  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const canBlockProgress = useExtensionCapability("block_progress");
  const label = canBlockProgress ? "Your age" : "Your age (optional)";
  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (canBlockProgress && !isAgeSet()) {
      return {
        behavior: "block",
        reason: "Age is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            setValidationError("Enter your age");
          }
        },
      };
    }

    if (canBlockProgress && !isAgeValid()) {
      return {
        behavior: "block",
        reason: `Age is less than ${ageTarget}.`,
        errors: [
          {
            // Show a validation error on the page
            message:
              "You're not legally old enough to buy some of the items in your cart.",
          },
        ],
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        // Ensure any errors are hidden
        clearValidationErrors();
      },
    };
  });
  function isAgeSet() {
    return age !== "";
  }

  function isAgeValid() {
    return Number(age) >= ageTarget;
  }

  function clearValidationErrors() {
    setValidationError("");
  }

  // Render the extension
  return (
    <>
      <TextField
        label={label}
        type="number"
        value={age}
        onChange={setAge}
        onInput={clearValidationErrors}
        required={canBlockProgress}
        error={validationError}
        helpText={`Age verification required (${ageTarget}+ years)`}
      />
    </>
  );
}
