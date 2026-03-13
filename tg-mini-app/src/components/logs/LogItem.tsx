import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, MessageSquare, Forward } from 'lucide-react';
import type { LogEntry } from '@/types';
import { MessageTypeBadge } from '@/components/ui';
import { formatDate, formatFileSize, truncate, chatTypeLabel } from '@/utils/format';
import { haptic } from '@/utils/telegram';

interface LogItemProps {
  log: LogEntry;
  index?: number;
}

const MAX_PREVIEW = 120;

export function LogItem({ log, index = 0 }: LogItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = log.messageText.length > MAX_PREVIEW;
  const preview = isLong && !expanded ? truncate(log.messageText, MAX_PREVIEW) : log.messageText;
  const isMedia = log.messageType !== 'text' && log.messageType !== 'forward';

  function toggle() {
    if (!isLong) return;
    haptic('light');
    setExpanded(e => !e);
  }

  return (
    <motion.div
      style={styles.card}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.28 }}
      whileTap={{ scale: 0.992 }}
    >
      {/* Top row: type badge + date */}
      <div style={styles.topRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MessageTypeBadge type={log.messageType} />
          {log.forwarded && (
            <span style={styles.forwardTag}>
              <Forward size={9} />
              Fwd
            </span>
          )}
        </div>
        <span style={styles.date}>{formatDate(log.savedAt)}</span>
      </div>

      {/* Message text / filename */}
      <div style={styles.messageWrap} onClick={toggle}>
        <p style={{
          ...styles.messageText,
          ...(isMedia ? styles.mediaText : {}),
          cursor: isLong ? 'pointer' : 'default',
        }}>
          {isMedia ? (
            <span style={{ color: 'var(--text-secondary)' }}>{preview}</span>
          ) : preview}
        </p>

        {isLong && (
          <motion.button
            style={styles.expandBtn}
            onClick={toggle}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.button>
        )}
      </div>

      {/* Metadata row */}
      <AnimatePresence>
        <div style={styles.meta}>
          {/* Sender */}
          {(log.senderName || log.senderUsername) && (
            <div style={styles.metaItem}>
              <User size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={styles.metaText}>
                {log.senderName ?? ''}
                {log.senderUsername && (
                  <span style={{ color: 'var(--text-muted)' }}> @{log.senderUsername}</span>
                )}
              </span>
            </div>
          )}

          {/* Chat */}
          {log.chatName && (
            <div style={styles.metaItem}>
              <MessageSquare size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={styles.metaText}>
                {log.chatName}
                <span style={styles.chatType}>{chatTypeLabel(log.chatType)}</span>
              </span>
            </div>
          )}

          {/* File size if media */}
          {log.fileSize && (
            <span style={styles.fileSize}>{formatFileSize(log.fileSize)}</span>
          )}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'border-color var(--transition)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  date: {
    fontSize: '0.6875rem',
    color: 'var(--text-muted)',
    flexShrink: 0,
    fontWeight: 500,
  },
  forwardTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.6rem',
    color: 'var(--accent)',
    background: 'var(--accent-dim)',
    borderRadius: 'var(--radius-full)',
    padding: '1px 6px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  messageWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
  },
  messageText: {
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
    flex: 1,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  mediaText: {
    fontStyle: 'italic',
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '2px 0',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '4px 12px',
    paddingTop: 4,
    borderTop: '1px solid var(--border)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
  },
  metaText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 160,
  },
  chatType: {
    marginLeft: 5,
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    background: 'rgba(255,255,255,0.05)',
    padding: '1px 5px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    verticalAlign: 'middle',
  },
  fileSize: {
    fontSize: '0.6875rem',
    color: 'var(--text-muted)',
    marginLeft: 'auto',
  },
};
