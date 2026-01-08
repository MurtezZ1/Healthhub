"use client";

import React, { useState, useRef, useEffect } from "react";

const preConfiguredQA = [
  {
    question: "What are the hospital's visiting hours?",
    answer:
      "Visiting hours vary by department, but general access is allowed from 9 AM to 6 PM. Please check your specific appointment or department page for exact times.",
  },
  
  {
    question: "What insurance plans does the hospital accept?",
    answer:
      "You can find accepted insurance plans listed in your patient profile section after logging in. For specific questions, contact the billing team via the portal.",
  },
  {
    question: "Is emergency care available 24/7?",
    answer:
      "This platform is designed for appointment management and patient records. For emergencies, please contact the hospital directly or visit the ER.",
  },
  {
    question: "How do I get my medical test results?",
    answer:
      "After logging in, navigate to the 'Appointments' or 'Medical Records' section. Test results will be listed under completed appointments if uploaded by your doctor",
  },
  {
    question: "Are there any COVID-19 safety protocols in place?",
    answer:
      "Yes, we follow strict COVID-19 safety protocols including mask mandates, social distancing, and sanitization procedures.",
  },
  {
    question: "Can I request a second opinion from another doctor?",
    answer:
      "Yes, you can request a second opinion by using the messaging feature in your patient dashboard or by booking a new appointment with a different specialist.",
  },
  {
    question: "What services are offered at the hospital?",
    answer:
      "The hospital offers general consultation, diagnostics, internal medicine, pediatrics, and specialty services — all manageable through the appointments section.",
  },
  {
    question: "How do I contact my doctor’s office?",
    answer:
      "Log in to the portal, go to 'Appointments', and select the relevant doctor to send a secure message or view contact details.",
  },
  {
    question: "What should I bring for my hospital visit?",
    answer:
      "Bring your national ID, appointment confirmation (can be shown from the portal), and any previous medical reports. Insurance cards are also required if applicable.",
  },
];

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageIdRef = useRef(0);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setMessages([]);
      messageIdRef.current = 0;
    }
  };

  const addMessage = (type, text) => {
    messageIdRef.current += 1;
    setMessages((prev) => {
      const newMessages = [...prev, { id: messageIdRef.current, type, text }];
      setTimeout(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
      return newMessages;
    });
  };

  const [isTyping, setIsTyping] = React.useState(false);
  const [typingText, setTypingText] = React.useState("");

  const chatWindowRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (chatWindowRef.current) {
      const rect = chatWindowRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, [isOpen]);

  const handleQuestionClick = (qa) => {
    const count = messages.filter(
      (msg) => msg.type === "user" && msg.text === qa.question
    ).length;

    if (count >= 3) {
      return;
    }

    addMessage("user", qa.question);
    setTimeout(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);

    setIsTyping(true);
    const answer = qa.answer;
    let currentIndex = 0;

    const typeNextChar = () => {
      currentIndex++;
      setTypingText(answer.slice(0, currentIndex));
      // Removed scrollIntoView on messagesEndRef to prevent scrolling down
      if (currentIndex < answer.length) {
        setTimeout(typeNextChar, 50);
      } else {
        addMessage("system", answer);
        setIsTyping(false);
        setTypingText("");
        setTimeout(() => {
          if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 100);
      }
    };

    typeNextChar();
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [messages]);

  // Remove all scrollIntoView calls on messagesEndRef to prevent scrolling down

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        aria-label="Toggle Live Chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          borderRadius: '9999px',
          background: 'linear-gradient(to right, #22c55e, #16a34a)',
          color: 'white',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgba(34,197,94,0.5), 0 4px 6px -2px rgba(34,197,94,0.3)',
          cursor: 'pointer',
          transition: 'transform 0.7s ease-in-out',
          outline: 'none',
          border: 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 4px rgba(34,197,94,0.5)'}
        onBlur={e => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(34,197,94,0.5), 0 4px 6px -2px rgba(34,197,94,0.3)'}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: '24px', width: '24px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: '24px', width: '24px' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.888L3 20l1.888-4.255A9.863 9.863 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            zIndex: 9999,
            width: '300px',
            maxWidth: '90vw',
            maxHeight: '420px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#f0fdf4',
            border: '1px solid #34d399',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '2px solid #34d399',
              fontWeight: '700',
              fontSize: '1.25rem',
              color: 'white',
              background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ position: 'relative', zIndex: 10 }}>Live Chat</span>
            <button
              onClick={toggleChat}
              aria-label="Close Live Chat"
              style={{
                color: 'white',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: '24px', width: '24px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#22c55e',
                opacity: 0.3,
                transform: 'skewX(-12deg)',
                transformOrigin: 'top left',
                zIndex: 5,
              }}
            />
          </div>
          <div
            style={{
              padding: '16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
              maxHeight: '320px',
              background: 'linear-gradient(to bottom, #f0fdf4, #d1fae5)',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              boxShadow: 'inset 0 0 10px #a7f3d0',
              border: '1px solid #34d399',
              position: 'relative',
            }}
          >
            {messages.length === 0 && (
              <>
              </>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    maxWidth: '75%',
                    padding: '12px 20px',
                    borderRadius: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.type === 'user' ? '#22c55e' : 'white',
                    color: msg.type === 'user' ? 'white' : '#111827',
                    border: msg.type === 'user' ? 'none' : '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    lineHeight: '1.3',
                    wordBreak: 'break-word',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '12px 20px',
                    borderRadius: '24px',
                    backgroundColor: 'white',
                    color: '#111827',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem',
                    lineHeight: '1.3',
                    wordBreak: 'break-word',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    whiteSpace: 'pre-wrap',
                    fontStyle: 'italic',
                  }}
                >
                  {typingText}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '12px',
                borderTop: '2px solid #34d399',
              }}
            >
              <div
                style={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginBottom: '8px',
                  color: '#111827',
                }}
              >
                How can we help you today? Choose a question:
              </div>
              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                }}
              >
                {preConfiguredQA.map((qa, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleQuestionClick(qa)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        color: '#111827',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d1fae5'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                      onFocus={e => e.currentTarget.style.backgroundColor = '#d1fae5'}
                      onBlur={e => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {qa.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual effect: subtle animated background */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(90deg, #d1fae5, #a7f3d0, #d1fae5)',
                opacity: 0.2,
                borderRadius: '16px',
                animation: 'gradient-x 3s ease infinite',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
