// src/components/chat/MessageItem.jsx

import { useMemo, useState, useEffect } from 'react';
import { User, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

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

  const isDark = theme === 'dark';

  return (
    <div className={`my-4 rounded-lg overflow-hidden border shadow-sm ${
      isDark 
        ? 'border-slate-600 bg-slate-900' 
        : 'border-gray-300 bg-gray-50'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-gray-100 border-gray-300'
      }`}>
        <span className={`text-xs font-medium uppercase ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded transition-colors ${
            isDark
              ? 'text-gray-300 hover:text-white hover:bg-slate-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado
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
        style={isDark ? vscDarkPlus : vs}
        language={language || 'text'}
        PreTag="div"
        className="!m-0 !p-4 overflow-x-auto"
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: 0,
          fontSize: '0.875rem',
          background: isDark ? '#1e1e1e' : '#ffffff',
          lineHeight: '1.5'
        }}
        codeTagProps={{
          style: {
            background: 'transparent',
            fontFamily: 'monospace'
          }
        }}
        lineProps={{
          style: { background: 'transparent' }
        }}
        wrapLines={false}
        showLineNumbers={false}
      >
        {String(code).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

function cleanGeminiContent(content) {
  if (!content) return '';
  
  let cleaned = content;

  cleaned = cleaned.replace(
    /(\|[^\n]+\|)\s*(\|[\s\-:|]+\|)\s*(\|[^\n]+\|)/g,
    (match, header, separator, row) => {
      if (separator.includes('---')) {
        return `${header}\n${separator}\n${row}`;
      }
      return match;
    }
  );

  cleaned = cleaned.replace(
    /(\|[^\n]+\|\n\|[\s\-:|]+\|)\n(\|[\s\-:|]+\|\n)+/g,
    '$1\n'
  );

  cleaned = cleaned.replace(
    /\|\s*-{1,2}\s*\|/g,
    '| --- |'
  );

  cleaned = cleaned.replace(/(https?:\/\/[^\s\)]+?)(?:%5D|\])\((https?:\/\/[^\s\)]+)\)/gi, '$1');
  cleaned = cleaned.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s\)]+?)\)\]\(\2\)/gi, '![$1]($2)');

  return cleaned;
}

function MessageItem({ message, formatTime }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const processedContent = useMemo(() => {
    const content = message.content || '';
    
    if (message.isStreaming) {
      return content.replace(/(\|\s*---+\s*\|[\s\S]*?)(\|\s*---+\s*\|)+/g, '$1');
    }
    
    return cleanGeminiContent(content);
  }, [message.content, message.isStreaming]);

  const renderedContent = useMemo(() => {
    if (message.type === 'user') {
      return (
        <p className="whitespace-pre-wrap break-words">
          {message.content}
        </p>
      );
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-ul:leading-relaxed prose-ol:leading-relaxed prose-li:leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
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

            text({ node, children }) {
              if (typeof children !== 'string') return children;
              
              if (message.isStreaming) {
                return (
                  <>
                    {children}
                    <span 
                      className="inline-block w-1 h-4 ml-0.5 bg-blue-600 dark:bg-blue-400 align-middle"
                      style={{ 
                        animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' 
                      }}
                    />
                  </>
                );
              }

              const urlRegex = /(https?:\/\/[^\s\)]+?)(?=[\s,;.!?]|$)/g;
              const parts = children.split(urlRegex);
              
              if (parts.length === 1) return children;
              
              return parts.map((part, index) => {
                if (part && part.match(/^https?:\/\//)) {
                  return (
                    <a
                      key={index}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      {part}
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  );
                }
                return part;
              });
            },

            pre({ children }) {
              return <div className="my-0">{children}</div>;
            },

            p({ children }) {
              return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
            },
            
            ul({ children }) {
              return <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>;
            },
            
            ol({ children }) {
              return <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>;
            },
            
            li({ children }) {
              return <li className="mb-1 leading-relaxed">{children}</li>;
            },

            h1({ children }) {
              return <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-600 pb-2">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-600 pb-1">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="text-lg font-bold mb-3 mt-4 text-gray-900 dark:text-white">{children}</h3>;
            },
            h4({ children }) {
              return <h4 className="text-base font-bold mb-2 mt-3 text-gray-900 dark:text-white">{children}</h4>;
            },
            h5({ children }) {
              return <h5 className="text-sm font-bold mb-2 mt-3 text-gray-900 dark:text-white uppercase">{children}</h5>;
            },
            h6({ children }) {
              return <h6 className="text-xs font-bold mb-2 mt-3 text-gray-900 dark:text-white uppercase text-gray-500 dark:text-gray-400">{children}</h6>;
            },

            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 italic bg-blue-50 dark:bg-blue-900/20 rounded-r text-gray-700 dark:text-gray-300">
                  {children}
                </blockquote>
              );
            },
            
            hr() {
              return <hr className="my-6 border-gray-300 dark:border-slate-600" />;
            },

            a({ href, children }) {
              const isExternal = href?.startsWith('http');
              return (
                <a 
                  href={href} 
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  {children}
                  {isExternal && <ExternalLink className="w-3 h-3" />}
                </a>
              );
            },

            table({ children }) {
              return (
                <div className="overflow-x-auto my-4 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600 bg-white dark:bg-slate-800">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return (
                <thead className="bg-gray-50 dark:bg-slate-700">
                  {children}
                </thead>
              );
            },
            tbody({ children }) {
              return (
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600 bg-white dark:bg-slate-800">
                  {children}
                </tbody>
              );
            },
            th({ children }) {
              return (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-r border-gray-200 dark:border-slate-600">
                  {children}
                </th>
              );
            },
            td({ children }) {
              const isEmpty = !children || children === '';
              return (
                <td className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-600 ${
                  isEmpty ? 'bg-gray-50 dark:bg-slate-700/50 italic text-gray-400 dark:text-gray-500' : ''
                }`}>
                  {isEmpty ? '—' : children}
                </td>
              );
            },

            img({ src, alt, title }) {
              return (
                <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
                  <img 
                    src={src} 
                    alt={alt || 'Imagen'} 
                    title={title}
                    className="w-full h-auto max-w-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    loading="lazy"
                    onClick={() => window.open(src, '_blank')}
                  />
                  {alt && (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{alt}</p>
                    </div>
                  )}
                </div>
              );
            },

            strong({ children }) {
              return <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>;
            },
            
            em({ children }) {
              return <em className="italic text-gray-800 dark:text-gray-200">{children}</em>;
            },

            del({ children }) {
              return <del className="line-through text-gray-500 dark:text-gray-400">{children}</del>;
            },

            input({ checked, type }) {
              if (type === 'checkbox') {
                return (
                  <input 
                    type="checkbox" 
                    checked={checked} 
                    readOnly 
                    className="mr-2 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                  />
                );
              }
              return null;
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    );
  }, [processedContent, message.isStreaming, message.type, theme]);

  return (
    <div
      className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''} animate-fadeIn`}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden
        ${message.type === 'ai' 
          ? 'bg-white dark:bg-slate-800' 
          : 'bg-gradient-to-br from-blue-600 to-indigo-600'
        }
      `}>
        {message.type === 'ai' ? (
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={theme === 'dark' ? '/ite_dark.svg' : '/ite_light.svg'}
              alt="Instituto Tecnologico de Ensenada"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        ) : (
          user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar del usuario"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )
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