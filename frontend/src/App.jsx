import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  Send, UploadCloud, FileText, Bot, User, Loader2,
  BookOpen, CheckCircle2, Moon, Sun, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from './translations';

function App() {
  const [lang, setLang] = useState('ru'); 
  const [theme, setTheme] = useState('light'); 
  const t = translations[lang];

  const [messages, setMessages] = useState([
    { role: 'ai', content: translations['ru'].initial_greeting }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'ai') {
      setMessages([{ role: 'ai', content: t.initial_greeting }]);
    }
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'ru' ? 'en' : 'ru');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFiles(prev => [...prev, {
        name: file.name,
        chunks: response.data.chunks,
        status: 'success'
      }]);

      setMessages(prev => [...prev, {
        role: 'ai',
        content: t.success_upload(file.name, response.data.chunks)
      }]);
    } catch (error) {
      console.error(error);
      alert(t.error_upload);
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        question: userMsg
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: t.error_server }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-verba-bg dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      <div className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-verba-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600 dark:from-white dark:to-indigo-400 tracking-tight">
              {t.title}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggleLang} className="p-2 text-slate-400 hover:text-verba-accent dark:text-slate-500 dark:hover:text-white transition-colors">
              <Languages size={18} />
            </button>
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-orange-500 dark:text-slate-500 dark:hover:text-yellow-400 transition-colors">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">{t.kb_title}</h2>

            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-verba-accent hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all group relative overflow-hidden"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileUpload}
              />
              {uploading ? (
                <Loader2 className="w-8 h-8 text-verba-accent animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-verba-accent transition-colors" />
              )}
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium group-hover:text-verba-accent transition-colors z-10 relative">
                {uploading ? t.upload_processing : t.upload_btn}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {files.map((file, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3"
                >
                  <div className="bg-white dark:bg-slate-700 p-2 rounded border border-slate-100 dark:border-slate-600">
                    <FileText size={16} className="text-verba-accent dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{file.chunks} {t.chunks}</div>
                  </div>
                  <CheckCircle2 size={16} className="text-green-500" />
                </motion.div>
              ))}
            </AnimatePresence>

            {files.length === 0 && (
              <div className="text-center text-slate-400 dark:text-slate-600 text-sm py-10 whitespace-pre-line">
                {t.no_docs}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-600 text-center">
          {t.powered_by}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                    : 'bg-verba-accent text-white shadow-lg shadow-indigo-500/20'
                  }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}>
                  <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          return !inline ? (
                            <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-3 rounded-md my-2 overflow-x-auto border border-slate-700">
                              <code {...props}>{children}</code>
                            </div>
                          ) : (
                            <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-300 font-mono text-xs" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex max-w-[80%] gap-4">
                <div className="w-8 h-8 rounded-full bg-verba-accent text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 bg-verba-accent rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-verba-accent rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-verba-accent rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.input_placeholder}
              className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-5 py-4 pr-12 focus:ring-2 focus:ring-verba-accent/50 dark:focus:ring-verba-accent/30 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-verba-accent text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-slate-400 dark:text-slate-600">
            {t.disclaimer}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;