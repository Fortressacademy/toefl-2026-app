import listeningMock1 from "./mocks/listeningMock1";

const MOCK_MAP = {
  listening_mock_1: listeningMock1,
};

export function loadListeningMockById(mockId) {
  return MOCK_MAP[mockId] || listeningMock1;
}