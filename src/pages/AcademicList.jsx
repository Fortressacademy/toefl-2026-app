import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ACADEMIC_BANK } from "../data/reading/academic";

export default function AcademicList() {
  const nav = useNavigate();

  const [openMap, setOpenMap] = useState({
    detail: false,
    inference: false,
    purpose: false,
    vocabulary: false,
    summary: false,
  });

  const toggle = (key) => {
    setOpenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSets = (type) => {
    return ACADEMIC_BANK[type].map((_, idx) => (
      <SetCard
        key={idx}
        onClick={() =>
          nav(`/reading/academic/${type}/${idx + 1}`)
        }
      >
        연습 {idx + 1}
      </SetCard>
    ));
  };

  return (
    <Wrapper>
      {Object.keys(ACADEMIC_BANK).map((type) => (
        <Folder key={type}>
          <FolderHeader onClick={() => toggle(type)}>
            {type.toUpperCase()}
          </FolderHeader>

          {openMap[type] && (
            <SetGrid>
              {renderSets(type)}
            </SetGrid>
          )}
        </Folder>
      ))}
    </Wrapper>
  );
}