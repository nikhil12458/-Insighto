import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  // Close sidebar on mobile when opening a chat
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [currentChatId]);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <main className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-2 xs:p-3 sm:p-4 md:p-5 text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 xs:top-40 left-5 xs:left-20 w-48 xs:w-72 h-48 xs:h-72 bg-purple-600/20 xs:bg-purple-600/20 rounded-full blur-2xl xs:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 xs:bottom-40 right-5 xs:right-20 w-48 xs:w-72 h-48 xs:h-72 bg-blue-600/20 xs:bg-blue-600/20 rounded-full blur-2xl xs:blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <section className="mx-auto flex h-[calc(100vh-1rem)] xs:h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-2.5rem)] w-full gap-2 xs:gap-3 sm:gap-4 md:gap-6">
        {/* Sidebar */}
        <aside
          className={`fixed md:static left-0 top-0 h-full w-64 xs:w-72 z-50 md:z-auto shrink-0 rounded-xl xs:rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 p-3 xs:p-4 sm:p-5 md:flex md:flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="mb-4 xs:mb-6 flex items-center justify-between">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Insighto
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white/60 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-white/40 mb-4 xs:mb-5">AI-Powered Chat</p>

          {/* New Chat Button */}
          <button className="w-full mb-3 xs:mb-4 sm:mb-5 rounded-lg xs:rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-3 xs:px-4 py-2 xs:py-3 text-xs xs:text-sm font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 active:scale-95 flex items-center justify-center gap-2 shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden xs:inline">New Chat</span>
            <span className="xs:hidden">New</span>
          </button>

          {/* Chat List */}
          <div className="space-y-1 xs:space-y-2 overflow-y-auto flex-1 pr-2">
            {Object.values(chats).length === 0 ? (
              <p className="text-white/40 text-xs text-center py-8">No chats yet</p>
            ) : (
              Object.values(chats).map((chat, index) => (
                <button
                  onClick={() => {
                    openChat(chat.id);
                  }}
                  key={index}
                  type="button"
                  className="w-full text-left rounded-lg xs:rounded-xl px-3 xs:px-4 py-2 xs:py-3 text-xs xs:text-sm font-medium text-white/80 transition group hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white hover:border hover:border-white/20 active:scale-95 truncate"
                >
                  <div className="truncate flex items-center gap-2">
                    <svg className="w-3 xs:w-4 h-3 xs:h-4 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="truncate">{chat.title}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="relative mx-auto flex h-full min-w-0 flex-1 flex-col">
          {/* Header with menu button */}
          <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white/60 hover:text-white transition p-2 -ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg xs:text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Chat
            </h2>
            <div className="w-5"></div>
          </div>

          {/* Messages Container */}
          <div className="messages flex-1 space-y-2 xs:space-y-3 sm:space-y-4 overflow-y-auto pr-1 xs:pr-2 pb-24 xs:pb-32 animate-fadeIn">
            {chats[currentChatId]?.messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-4">
                  <div className="w-12 xs:w-16 h-12 xs:h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-3 xs:mb-4 shadow-lg">
                    <svg className="w-6 xs:w-8 h-6 xs:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-white/80 mb-1 xs:mb-2">Start a conversation</h2>
                  <p className="text-xs xs:text-sm text-white/40">Ask me anything to get started</p>
                </div>
              </div>
            )}
            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex animate-slideIn ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] rounded-lg xs:rounded-2xl px-3 xs:px-4 sm:px-5 py-2 xs:py-3 text-xs xs:text-sm sm:text-base transition-all ${
                    message.role === "user"
                      ? "rounded-br-none bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/50"
                      : "rounded-bl-none bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 text-white/90 hover:border-white/20"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="leading-relaxed break-words">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 leading-relaxed last:mb-0 break-words">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-2 list-disc pl-5 space-y-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 list-decimal pl-5 space-y-1">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-white/90">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-purple-300 break-words">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="mb-2 overflow-x-auto rounded-lg xs:rounded-xl bg-black/40 p-2 xs:p-3 sm:p-4 border border-white/10 text-xs xs:text-sm">
                            {children}
                          </pre>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-base xs:text-lg font-bold text-white mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm xs:text-base font-bold text-white mb-2">{children}</h2>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-purple-500 pl-3 italic text-white/70 my-2">
                            {children}
                          </blockquote>
                        ),
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <footer className="absolute bottom-0 left-0 right-0 pt-3 xs:pt-4 sm:pt-6 pb-2 xs:pb-3 px-2 xs:px-3 sm:px-5 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
            <form
              onSubmit={handleSubmitMessage}
              className="mx-auto flex w-full flex-col gap-2 xs:gap-3 sm:gap-3 flex-col-reverse xs:flex-col md:flex-row md:max-w-3xl"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask anything..."
                  className="w-full rounded-lg xs:rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-3 xs:px-4 sm:px-5 py-2 xs:py-3 text-sm xs:text-base text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-lg xs:rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-3 xs:px-4 sm:px-6 py-2 xs:py-3 text-sm xs:text-base font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:from-purple-600/50 disabled:to-blue-600/50 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
