import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

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
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-3 text-white md:p-5">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <section className="mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 md:h-[calc(100vh-2.5rem)] md:gap-6">
        {/* Sidebar */}
        <aside className="hidden h-full w-72 shrink-0 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 p-5 md:flex md:flex-col shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Insighto
            </h1>
            <p className="text-xs text-white/40 mt-1">AI-Powered Chat</p>
          </div>

          {/* New Chat Button */}
          <button className="w-full mb-5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 active:scale-95 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>

          {/* Chat List */}
          <div className="space-y-2 overflow-y-auto flex-1">
            {Object.values(chats).length === 0 ? (
              <p className="text-white/40 text-sm text-center py-8">No chats yet</p>
            ) : (
              Object.values(chats).map((chat, index) => (
                <button
                  onClick={() => {
                    openChat(chat.id);
                  }}
                  key={index}
                  type="button"
                  className="w-full text-left rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition group hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white hover:border hover:border-white/20 active:scale-95"
                >
                  <div className="truncate flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{chat.title}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="relative mx-auto flex h-full min-w-0 flex-1 flex-col">
          {/* Messages Container */}
          <div className="messages flex-1 space-y-4 overflow-y-auto pr-2 pb-32 animate-fadeIn">
            {chats[currentChatId]?.messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white/80 mb-2">Start a conversation</h2>
                  <p className="text-white/40">Ask me anything to get started</p>
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
                  className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm md:text-base transition-all ${
                    message.role === "user"
                      ? "rounded-br-none bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/50"
                      : "rounded-bl-none bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 text-white/90 hover:border-white/20"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="leading-relaxed">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
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
                          <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-purple-300">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="mb-2 overflow-x-auto rounded-xl bg-black/40 p-4 border border-white/10">
                            {children}
                          </pre>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold text-white mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-bold text-white mb-2">{children}</h2>
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
          <footer className="absolute bottom-0 left-0 right-0 pt-6 pb-4 px-3 md:px-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
            <form
              onSubmit={handleSubmitMessage}
              className="mx-auto flex w-full flex-col gap-3 md:flex-row md:max-w-3xl"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask anything..."
                  className="w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-5 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:from-purple-600/50 disabled:to-blue-600/50 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
