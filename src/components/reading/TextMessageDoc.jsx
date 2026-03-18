// src/components/reading/TextMessageDoc.jsx
import styled from "styled-components";

/**
 * ✅ iPhone-frame Text Message Doc (mobile optimized)
 *
 * doc shape:
 * {
 *   title: "Messages",
 *   subtitle: "Jenna Kim · Office Admin",
 *   meta: "Tuesday · 9:12 AM",
 *   participants: [{ id:"jenna", name:"Jenna" }, { id:"admin", name:"Office Admin" }],
 *   meId: "jenna",
 *   messages: [
 *     { from:"admin", time:"9:12 AM", text:"..." },
 *     { from:"jenna", time:"9:14 AM", text:"..." },
 *   ],
 *   note: "Note: ..."
 * }
 */

export default function TextMessageDoc({ doc }) {
  const title = doc?.title ?? "Messages";
  const subtitle = doc?.subtitle ?? "";
  const meta = doc?.meta ?? "";
  const meId = doc?.meId ?? "me";
  const participants = Array.isArray(doc?.participants) ? doc.participants : [];
  const messages = Array.isArray(doc?.messages) ? doc.messages : [];

  const nameOf = (id) => participants.find((p) => p.id === id)?.name ?? String(id ?? "");
  const isMe = (from) => String(from) === String(meId);

  const headerLeftName = (() => {
    const other = participants.find((p) => String(p.id) !== String(meId));
    return other?.name || "Contact";
  })();

  return (
    <Outer>
      <Phone>
        <Bezel>
          <Screen>
            <NotchWrap aria-hidden="true">
              <Notch />
            </NotchWrap>

            <StatusBar aria-hidden="true">
              <StatusLeft>{meta || "9:41"}</StatusLeft>
              <StatusRight>
                <Sdot />
                <Bars />
                <Battery />
              </StatusRight>
            </StatusBar>

            <NavBar>
              <Back aria-hidden="true">‹</Back>
              <NavCenter>
                <NavTitle>{headerLeftName}</NavTitle>
                <NavSub>{subtitle || title}</NavSub>
              </NavCenter>
              <NavRight aria-hidden="true">⋯</NavRight>
            </NavBar>

            <ChatArea role="article" aria-label="Text message conversation">
              {messages.map((m, idx) => {
                const mine = isMe(m.from);
                const prevFrom = messages[idx - 1]?.from;
                const nextFrom = messages[idx + 1]?.from;

                const groupTop = idx === 0 || prevFrom !== m.from;
                const groupBottom = idx === messages.length - 1 || nextFrom !== m.from;

                const showAvatar = !mine && groupBottom;

                return (
                  <Row key={idx} $mine={mine}>
                    {!mine ? (
                      <LeftCol>
                        {showAvatar ? (
                          <Avatar aria-hidden="true">{initial(nameOf(m.from))}</Avatar>
                        ) : (
                          <AvatarSpacer aria-hidden="true" />
                        )}
                      </LeftCol>
                    ) : (
                      <LeftCol aria-hidden="true" />
                    )}

                    <MidCol $mine={mine}>
                     {groupTop ? <Sender $mine={mine}>{nameOf(m.from)}</Sender> : null}

                      <Bubble $mine={mine} $groupTop={groupTop} $groupBottom={groupBottom}>
                        <BubbleText>{m.text}</BubbleText>
                        {m.time ? <Time $mine={mine}>{m.time}</Time> : null}
                      </Bubble>
                    </MidCol>

                    <RightCol aria-hidden="true" />
                  </Row>
                );
              })}
            </ChatArea>

            {doc?.note ? <FooterNote>Note: {doc.note}</FooterNote> : null}

            <HomeIndicator aria-hidden="true" />
          </Screen>
        </Bezel>
      </Phone>
    </Outer>
  );
}

/* helpers */
function initial(name) {
  const n = String(name ?? "").trim();
  if (!n) return "•";
  return n.slice(0, 1).toUpperCase();
}

/* =========================
   Styles (iPhone-like frame)
   ========================= */

const Outer = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
`;

const Phone = styled.div`
  width: min(420px, 100%);
  padding: 14px;

  /* ✅ 모바일: 화면 폭 확보 (좌우 여백 최소) */
  @media (max-width: 520px) {
    width: 100%;
    padding: 6px;
  }
`;

const Bezel = styled.div`
  border-radius: 42px;
  padding: 12px;
  background: linear-gradient(180deg, #0b0f17, #0a0d14);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28), 0 8px 18px rgba(0, 0, 0, 0.22);

  /* ✅ 모바일: 베젤 얇게 */
  @media (max-width: 520px) {
    border-radius: 18px;
    padding: 6px;
    box-shadow: none;
  }
`;

const Screen = styled.div`
  position: relative;
  border-radius: 34px;
  overflow: hidden;
  background: #f6f7fb;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 560px;
  padding-bottom: 18px;

  @media (max-width: 520px) {
    border-radius: 14px;
    min-height: 62vh;
    padding-bottom: 14px;
  }
`;

const NotchWrap = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;

  /* ✅ 모바일: 노치 숨겨서 공간 확보 */
  @media (max-width: 520px) {
    display: none;
  }
`;

const Notch = styled.div`
  width: 164px;
  height: 34px;
  border-radius: 18px;
  background: #090b10;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
`;

const StatusBar = styled.div`
  position: relative;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 8px;
  color: rgba(17, 24, 39, 0.75);
  font-weight: 800;
  font-size: 12px;

  @media (max-width: 520px) {
    padding: 10px 12px 6px;
    font-size: 11px;
  }
`;

const StatusLeft = styled.div`
  padding-left: 6px;
`;

const StatusRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 6px;
`;

const Sdot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.35);
`;

const Bars = styled.div`
  width: 18px;
  height: 10px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.12);
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.12);
`;

const Battery = styled.div`
  width: 24px;
  height: 12px;
  border-radius: 4px;
  background: rgba(17, 24, 39, 0.12);
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.12);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: -3px;
    top: 3px;
    width: 3px;
    height: 6px;
    border-radius: 2px;
    background: rgba(17, 24, 39, 0.16);
  }
  &::before {
    content: "";
    position: absolute;
    left: 2px;
    top: 2px;
    right: 7px;
    bottom: 2px;
    border-radius: 3px;
    background: rgba(17, 24, 39, 0.22);
  }
`;

const NavBar = styled.div`
  position: relative;
  z-index: 30;
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  align-items: center;
  gap: 6px;
  padding: 10px 14px 12px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(17, 24, 39, 0.08);

  @media (max-width: 520px) {
    padding: 8px 10px 10px;
    grid-template-columns: 36px 1fr 36px;
  }
`;

const Back = styled.div`
  font-size: 26px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.55);
  line-height: 1;
  display: grid;
  place-items: center;
`;

const NavCenter = styled.div`
  display: grid;
  place-items: center;
  gap: 2px;
`;

const NavTitle = styled.div`
  font-weight: 950;
  font-size: 14px;
  color: rgba(17, 24, 39, 0.92);
`;

const NavSub = styled.div`
  font-weight: 800;
  font-size: 11px;
  color: rgba(17, 24, 39, 0.55);
`;

const NavRight = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.45);
  display: grid;
  place-items: center;
`;

const ChatArea = styled.div`
  padding: 12px 12px 0;
  background: linear-gradient(180deg, rgba(236, 239, 246, 0.75), rgba(246, 247, 251, 1));

  /* scroll inside phone */
  max-height: 520px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 520px) {
    padding: 10px 8px 0;  /* ✅ 좌우 패딩 최소 */
    max-height: 62vh;
  }

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(17, 24, 39, 0.1);
    border-radius: 999px;
    border: 3px solid rgba(246, 247, 251, 1);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin: 8px 0;

  ${({ $mine }) =>
    $mine
      ? `
    justify-content: flex-end;
  `
      : `
    justify-content: flex-start;
  `}

  @media (max-width: 520px) {
    gap: 6px;
    margin: 6px 0;
  }
`;

const LeftCol = styled.div`
  width: 34px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 520px) {
    width: 30px;
  }
`;

const RightCol = styled.div`
  width: 6px;

  @media (max-width: 520px) {
    width: 2px;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(17, 24, 39, 0.12);
  display: grid;
  place-items: center;
  font-weight: 950;
  color: rgba(17, 24, 39, 0.7);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
`;

const AvatarSpacer = styled.div`
  width: 30px;
  height: 30px;
`;

const MidCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  flex: 1;
  min-width: 0; /* ✅ flex children 줄바꿈/overflow 안정 */
`;

const Sender = styled.div`
  font-size: 11px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.55);
  margin: 0 0 6px 4px;
`;

const Bubble = styled.div`
  max-width: 78%;
  width: fit-content;
  padding: 10px 12px;
  border: 1px solid rgba(17, 24, 39, 0.1);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
  background: ${({ $mine }) => ($mine ? "#FDE68A" : "rgba(255,255,255,0.92)")};

  border-top-left-radius: ${({ $mine, $groupTop }) => ($mine ? "18px" : $groupTop ? "18px" : "10px")};
  border-top-right-radius: ${({ $mine, $groupTop }) => ($mine ? ($groupTop ? "18px" : "10px") : "18px")};
  border-bottom-left-radius: ${({ $mine, $groupBottom }) => ($mine ? "18px" : $groupBottom ? "18px" : "10px")};
  border-bottom-right-radius: ${({ $mine, $groupBottom }) => ($mine ? ($groupBottom ? "18px" : "10px") : "18px")};

  /* ✅ 모바일: 말풍선 폭 확장 */
  @media (max-width: 520px) {
    max-width: 96%;
  }
`;

const BubbleText = styled.div`
  font-size: 14px;
  line-height: 1.45;
  font-weight: 750;
  color: rgba(17, 24, 39, 0.92);
  white-space: pre-wrap;

  /* ✅ 핵심: “단어 단위 줄바꿈” + “URL 같은 초장문만 강제 컷” */
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const Time = styled.div`
  margin-top: 6px;
  font-size: 11px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.55);
  opacity: 0.75;
  text-align: ${({ $mine }) => ($mine ? "right" : "left")};
`;

const FooterNote = styled.div`
  margin: 10px 14px 0;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(17, 24, 39, 0.08);
  font-weight: 750;
  font-size: 12px;
  color: rgba(17, 24, 39, 0.62);

  @media (max-width: 520px) {
    margin: 8px 10px 0;
  }
`;

const HomeIndicator = styled.div`
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  width: 134px;
  height: 5px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.2);
  z-index: 60;

  @media (max-width: 520px) {
    bottom: 8px;
    width: 110px;
  }
`;