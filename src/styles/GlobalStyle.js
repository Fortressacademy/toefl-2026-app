import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    height: 100%;
    width: 100%;
    max-width: 100%;
    margin: 0;

    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    font-family:
      "Malgun Gothic",
      "맑은 고딕",
      ui-sans-serif,
      system-ui,
      -apple-system,
      "Segoe UI",
      Roboto,
      "Noto Sans KR",
      Arial,
      "Apple SD Gothic Neo",
      sans-serif;

    background: #f5f7fb;
    color: #0f172a;

    /* ✅ 가로 삐져나옴 차단 */
    overflow-x: clip;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* ✅ transform 기본값 보장 */
    transform: none;
  }

  @supports not (overflow-x: clip) {
    body { overflow-x: hidden; }
  }

  #root {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow-x: clip;
  }

  @supports not (overflow-x: clip) {
    #root { overflow-x: hidden; }
  }

  img, video, canvas {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button { font-family: inherit; }

  /* ✅ iOS 줌 방지 */
  input, textarea, select { font-size: 16px; }
`;

export default GlobalStyle;