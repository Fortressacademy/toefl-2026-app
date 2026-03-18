import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../layout/AppShell";
import RouteReset from "../layout/RouteReset";

import Home from "../pages/Home";

// Reading
import Reading from "../pages/Reading";
import ReadingCTWEntry from "../pages/ReadingCTWEntry";
import DailyLifeList from "../pages/DailyLifeList";
import DailyLifeSet from "../pages/DailyLifeSet";
import AcademicList from "../pages/AcademicList";
import AcademicSet from "../pages/AcademicSet";
// Reading MOCK
import ReadingMockEngine from "../pages/ReadingMockEngine";
import ReadingMockResult from "../pages/ReadingMockResult";

// Listening
import Listening from "../pages/Listening";
import ListeningSet from "../pages/ListeningSet";
import ListeningMockEngine from "../pages/ListeningMockEngine";
import ListeningMockResult from "../pages/ListeningMockResult";

// Speaking
import Speaking from "../pages/Speaking";
import SpeakingSetRouter from "../pages/SpeakingSetRouter";

// Writing
import Writing from "../pages/Writing";
import WritingMock from "../pages/WritingMock";
import WritingReport from "../pages/WritingReport";

// Vocab / etc
import Vocab from "../pages/Vocab";
import MyVocab from "../pages/MyVocab";
import Template from "../pages/Template";

export default function App() {
  return (
    <>
      <RouteReset />
      <AppShell>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Reading */}
          <Route path="/reading" element={<Reading />} />
          <Route path="/reading/ctw/:trackKey" element={<ReadingCTWEntry />} />

          <Route path="/reading/daily/:type" element={<DailyLifeList />} />
          <Route path="/reading/daily/:type/set" element={<DailyLifeSet />} />

          <Route path="/reading/academic" element={<AcademicList />} />
          <Route path="/reading/academic/:typeKey" element={<AcademicList />} />
          <Route path="/reading/academic/:typeKey/set" element={<AcademicSet />} />

          {/* Reading Mock */}
          <Route path="/reading/mock/:mockId" element={<ReadingMockEngine />} />
          <Route path="/reading/mock/:mockId/result" element={<ReadingMockResult />} />

          {/* Listening */}
          <Route path="/listening" element={<Listening />} />
          <Route path="/listening/:partKey/set" element={<ListeningSet />} />

          {/* Listening Mock */}
          <Route path="/listening/mock/:mockId" element={<ListeningMockEngine />} />
          <Route path="/listening/mock/:mockId/result" element={<ListeningMockResult />} />

          {/* Speaking */}
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/speaking/:partKey/set" element={<SpeakingSetRouter />} />

          {/* Writing */}
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/mock/:mockId" element={<WritingMock />} />
          <Route path="/writing/report" element={<WritingReport />} />

          {/* Vocab / MyVocab / Template */}
          <Route path="/vocab" element={<Vocab />} />
          <Route path="/myvocab" element={<MyVocab />} />
          <Route path="/template" element={<Template />} />

          {/* ADMIN */}
          <Route path="/admin-writing" element={<AdminWriting />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </>
  );
}