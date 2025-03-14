import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import ContactForm from "../../components/ContactForm/ContactForm";
import TitleBox from "../../components/TitleBox/TitleBox";
import AvailablePositionTable from "../../components/AvailablePositionTable/AvailablePositionTable";
import "./workWithUs.scss";

const WorkWithUs = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobApplication, setIsJobApplication] = useState<boolean>(false);

  const handleSelectJob = (jobId: string, isJob: boolean) => {
    setSelectedJobId(jobId);
    setIsJobApplication(isJob);
  };

  return (
    <Layout>
      <div className="workWithUs_wrapper">
        <div className="workWithUs_container">
          <TitleBox
            title="Skicka ett meddelande till oss"
            subTitle="Har du frågor eller funderingar? Vi är här för att svara på dem"
          />
          <AvailablePositionTable onSelectJob={handleSelectJob} />
          <ContactForm 
            subjectFromCard={selectedJobId || "Spontan ansökan"} 
            isJobApplication={isJobApplication}  
          />
        </div>
      </div>
    </Layout>
  );
};

export default WorkWithUs;
