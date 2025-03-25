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
            title="Vill du jobba med oss?"
            subTitle="Kolla de lediga tjänsterna eller skicka in en spontanansökan."
          />
          <AvailablePositionTable onSelectJob={handleSelectJob} />
          <ContactForm subjectFromCard={selectedJobId || "Klistra in tjänst-ID eller skriv 'Spontan ansökan'"} isJobApplication={true} />
        </div>
      </div>
    </Layout>
  );
};

export default WorkWithUs;
