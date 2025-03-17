import React from "react";
import "./titleBox.scss";

interface TitleBoxProps {
  title: string;
  subTitle: string;
}

const TitleBox: React.FC<TitleBoxProps> = ({ title, subTitle }) => {
  return (
    <section className="titleBox">
      <h1 className="titleBox__title">{title}</h1>
      <h2 className="titleBox__sub-title">{subTitle}</h2>
    </section>
  );
};

export default TitleBox;