import { useMemo, useState } from 'react';
import { User, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';

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
    <div className="my-4 rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-300 uppercase">
          {language || 'code'}
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
        language={language || 'text'}
        PreTag="div"
        className="!m-0 !p-4 overflow-x-auto"
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: 0,
          fontSize: '0.875rem',
          background: '#1e1e1e',
          lineHeight: '1.5'
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {String(code).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

// Función para corregir tablas mal formateadas
function fixMalformedTable(content) {
  // Detectar tablas con formato incorrecto (con separadores de columnas vacíos)
  const tableRegex = /(\|.*\|)\n(\|.*\|)\n(\|.*\|)/g;
  
  return content.replace(tableRegex, (match, headerRow, separatorRow, dataRow) => {
    // Contar columnas en la fila de encabezado
    const headerColumns = headerRow.split('|').filter(col => col.trim() !== '');
    const columnCount = headerColumns.length;
    
    // Si el separador no tiene el número correcto de columnas, corregirlo
    const separatorColumns = separatorRow.split('|').filter(col => col.trim() !== '');
    if (separatorColumns.length !== columnCount) {
      // Crear un separador correcto
      const correctSeparator = '|' + Array(columnCount).fill('---').join('|') + '|';
      return `${headerRow}\n${correctSeparator}\n${dataRow}`;
    }
    
    return match;
  });
}

// Función para procesar y limpiar el contenido del mensaje
function processMessageContent(content) {
  let processedContent = content;
  
  // 1. Corregir tablas mal formateadas
  processedContent = fixMalformedTable(processedContent);
  
  // 2. Detectar y formatear tablas sin separadores de Markdown
  const potentialTableRegex = /^([^|\n]+\|[^|\n]+(\|[^|\n]+)*\n?)+$/gm;
  const lines = processedContent.split('\n');
  let inTable = false;
  let tableLines = [];
  let processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    
    // Detectar si es una línea de tabla potencial
    const isPotentialTableLine = line.includes('|') && line.split('|').length > 2;
    const isNextLinePotentialTable = nextLine && nextLine.includes('|') && nextLine.split('|').length > 2;
    
    if (isPotentialTableLine && (inTable || isNextLinePotentialTable)) {
      if (!inTable) {
        // Comenzar una nueva tabla
        inTable = true;
        tableLines = [];
        
        // Agregar separador de tabla si no existe
        const columnCount = line.split('|').length - 1;
        const separator = '|' + Array(columnCount).fill('---').join('|') + '|';
        tableLines.push(separator);
      }
      tableLines.push(line);
    } else {
      if (inTable && tableLines.length > 0) {
        // Finalizar la tabla actual
        processedLines.push(tableLines.join('\n'));
        tableLines = [];
        inTable = false;
      }
      processedLines.push(line);
    }
  }
  
  // Agregar cualquier tabla pendiente
  if (inTable && tableLines.length > 0) {
    processedLines.push(tableLines.join('\n'));
  }
  
  return processedLines.join('\n');
}

function MessageItem({ message, formatTime }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const contentLength = message.content?.length || 0;

  // Procesar el contenido del mensaje para corregir tablas
  const processedContent = useMemo(() => {
    return processMessageContent(message.content || '');
  }, [message.content]);

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
      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-ul:leading-relaxed prose-ol:leading-relaxed prose-li:leading-relaxed">
        <ReactMarkdown
          components={{
            // ========== BLOQUES DE CÓDIGO ==========
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

            pre({ children }) {
              return <div className="my-0">{children}</div>;
            },

            // ========== ELEMENTOS DE TEXTO ==========
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

            // ========== ENCABEZADOS ==========
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

            // ========== CITAS Y LÍNEAS ==========
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

            // ========== ENLACES ==========
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

            // ========== TABLAS MEJORADAS ==========
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
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800">
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
            th({ children, node }) {
              const isFirstColumn = node?.properties?.className?.includes('first-column');
              return (
                <th className={`
                  px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider
                  ${isFirstColumn ? 'border-r border-gray-200 dark:border-slate-600' : ''}
                `}>
                  {children}
                </th>
              );
            },
            td({ children, node }) {
              const isFirstColumn = node?.properties?.className?.includes('first-column');
              const isEmpty = !children || children === '';
              
              return (
                <td className={`
                  px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-slate-600
                  ${isFirstColumn ? 'border-r border-gray-200 dark:border-slate-600 font-medium' : ''}
                  ${isEmpty ? 'bg-gray-50 dark:bg-slate-700/50 italic text-gray-400 dark:text-gray-500' : ''}
                `}>
                  {isEmpty ? '—' : children}
                </td>
              );
            },
            tr({ children, node }) {
              const isHeaderRow = node?.properties?.className?.includes('header-row');
              return (
                <tr className={`
                  transition-colors
                  ${isHeaderRow ? 'hover:bg-gray-100 dark:hover:bg-slate-700' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'}
                `}>
                  {children}
                </tr>
              );
            },

            // ========== IMÁGENES ==========
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

            // ========== ELEMENTOS DE ÉNFASIS ==========
            strong({ children }) {
              return <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>;
            },
            
            em({ children }) {
              return <em className="italic text-gray-800 dark:text-gray-200">{children}</em>;
            },

            // ========== LISTAS DE TAREAS ==========
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
  }, [processedContent, message.isStreaming, message.type, contentLength]);

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
          // Logo del ITE que cambia según el tema
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={theme === 'dark' ? '/ite_dark.svg' : '/ite_light.svg'}
              alt="Instituto Tecnológico de Ensenada"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback icon */}
            <div className="hidden w-full h-full items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        ) : (
          // Avatar del usuario
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