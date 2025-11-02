import { useMemo, useState } from 'react';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const codeString = String(code).replace(/\n$/, '');
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-300 uppercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="overflow-x-auto"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.875rem',
          background: '#1e1e1e'
        }}
      >
        {String(code).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

function MessageItem({ message, formatTime }) {
  const contentLength = message.content?.length || 0;

  const renderedContent = useMemo(() => {
    if (message.type === 'user') {
      return (
        <p className="whitespace-pre-wrap break-words">
          {message.content}
        </p>
      );
    }

    if (message.isStreaming) {
      return (
        <p className="whitespace-pre-wrap break-words">
          {message.content}
          <span 
            className="inline-block w-1 h-5 ml-0.5 bg-blue-600 dark:bg-blue-400 align-middle"
            style={{ 
              animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' 
            }}
          />
        </p>
      );
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              
              if (!inline && match) {
                return (
                  <CodeBlock 
                    language={match[1]} 
                    code={codeString} 
                  />
                );
              }
              
              return (
                <code 
                  className="bg-gray-100 dark:bg-slate-700 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-xs font-mono" 
                  {...props}
                >
                  {children}
                </code>
              );
            },
            
            p({ children }) {
              return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
            },
            
            ul({ children }) {
              return <ul className="list-disc list-inside mb-3 space-y-1 ml-2">{children}</ul>;
            },
            
            ol({ children }) {
              return <ol className="list-decimal list-inside mb-3 space-y-1 ml-2">{children}</ol>;
            },
            
            li({ children }) {
              return <li className="mb-1 leading-relaxed">{children}</li>;
            },
            
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-3 italic bg-blue-50 dark:bg-blue-900/20 rounded-r">
                  {children}
                </blockquote>
              );
            },
            
            h1({ children }) {
              return <h1 className="text-2xl font-bold mb-3 mt-5 text-gray-900 dark:text-white">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="text-xl font-bold mb-3 mt-4 text-gray-900 dark:text-white">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-lg font-bold mb-2 mt-3 text-gray-900 dark:text-white">{children}</h3>;
            },
            h4({ children }) {
              return <h4 className="text-base font-bold mb-2 mt-2 text-gray-900 dark:text-white">{children}</h4>;
            },
            
            a({ href, children }) {
              return (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {children}
                </a>
              );
            },
            
            hr() {
              return <hr className="my-4 border-gray-300 dark:border-slate-600" />;
            },
            
            table({ children }) {
              return (
                <div className="overflow-x-auto my-3">
                  <table className="min-w-full border border-gray-300 dark:border-slate-600">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-gray-100 dark:bg-slate-700">{children}</thead>;
            },
            th({ children }) {
              return (
                <th className="px-4 py-2 text-left border border-gray-300 dark:border-slate-600 font-semibold">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-4 py-2 border border-gray-300 dark:border-slate-600">
                  {children}
                </td>
              );
            },
            
            strong({ children }) {
              return <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>;
            },
            
            em({ children }) {
              return <em className="italic">{children}</em>;
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    );
  }, [message.content, message.isStreaming, message.type, contentLength]);

  return (
    <div
      className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''} animate-fadeIn`}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
        ${message.type === 'ai' 
          ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
          : 'bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800'
        }
      `}>
        {message.type === 'ai' ? (
          <Sparkles className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={`
        flex flex-col flex-1 max-w-3xl
        ${message.type === 'user' ? 'items-end' : 'items-start'}
      `}>
        <div className={`
          px-5 py-4 rounded-2xl shadow-sm w-full
          ${message.type === 'ai'
            ? 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          }
        `}>
          <div className={`text-sm ${
            message.type === 'ai' 
              ? 'text-gray-900 dark:text-gray-100' 
              : 'text-white'
          }`}>
            {renderedContent}
          </div>

          {message.files && message.files.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
              <p className="text-xs opacity-75 mb-2 font-medium">Archivos adjuntos:</p>
              <div className="space-y-1">
                {message.files.map((file, idx) => (
                  <div 
                    key={idx} 
                    className="text-xs opacity-75 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded"
                  >
                    {file}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default MessageItem;