import React from "react";
import EntityReportFlow from "./EntityReportFlow";

const DestinationReportFlow = ({ onClose, destinationId, userId }) => {
  return (
    <EntityReportFlow
      onClose={onClose}
      userId={userId}
      entityId={destinationId}
      entityKey="destination"
      reasonsEndpoint="destination-report-reasons"
      submitEndpoint="destination-reports"
      titles={{
        step1: "What would you like to report about this destination?",
        step2: "Select the specific issue:",
        thanks: "Thank you for your feedback",
      }}
    />
  );
};

export default DestinationReportFlow;
