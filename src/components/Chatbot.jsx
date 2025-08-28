import { useState, useEffect, useRef } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { aiAPI } from '../services/api';
import { Send, X, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ onClose }) => {
  const { resumeData } = useResume();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const initialAnalysisRun = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (initialAnalysisRun.current || !resumeData || !resumeData.personalInfo) {
        setIsLoading(false);
        if (messages.length === 0) {
            setMessages([{ sender: 'ai', text: "Hello! Feel free to ask me anything about your resume." }]);
        }
        return;
    }

    const getInitialAnalysis = async () => {
      const systemPrompt = `
        You are an expert career coach. A user has opened your panel for resume advice.
        Analyze their resume data (provided in JSON) and provide 3 actionable, high-impact suggestions for improvement.
        Keep your response concise and start by greeting the user warmly.
        **Use Markdown for formatting**, such as bolding for emphasis and bullet points for lists.
      `;
      const finalPrompt = `${systemPrompt}\n\nResume Data:\n${JSON.stringify(resumeData)}`;
      
      try {
        const res = await aiAPI.askAI(finalPrompt);
        setMessages([{ sender: 'ai', text: res.response }]);
      } catch (error) {
        console.error("Initial analysis failed:", error);
        setMessages([{ sender: 'ai', text: "Sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment." }]);
      } finally {
        setIsLoading(false);
        initialAnalysisRun.current = true;
      }
    };

    getInitialAnalysis();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationPrompt = `
      The user is asking a follow-up question about their resume.
      Their resume data is: ${JSON.stringify(resumeData)}.
      Their question is: "${input}".
      Provide a helpful and concise answer based on their resume context.
      **Use Markdown for formatting**.
    `;
    
    try {
        const res = await aiAPI.askAI(conversationPrompt);
        setMessages(prev => [...prev, { sender: 'ai', text: res.response }]);
    } catch (error) {
        console.error("Follow-up question failed:", error);
        setMessages(prev => [...prev, { sender: 'ai', text: "I'm sorry, I encountered an error. Please try asking again." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-[440px] h-[600px] bg-white dark:bg-gray-800 shadow-2xl rounded-lg flex flex-col z-50 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
            <Bot className="text-blue-500" />
            <h3 className="font-bold text-gray-800 dark:text-white">AI Resume Assistant</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`}>
              {/* --- FIX: Wrap ReactMarkdown in a div with the styling classes --- */}
              {msg.sender === 'ai' ? (
                <div className="prose prose-sm dark:prose-invert">
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600">...</div></div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 px-3 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
            disabled={isLoading}
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-blue-300" disabled={isLoading}>
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
