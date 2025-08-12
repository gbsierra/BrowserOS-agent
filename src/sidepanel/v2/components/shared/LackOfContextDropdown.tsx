import React from 'react'
import { InlineDropdown } from './InlineDropdown'

interface LackOfContextDropdownProps {
  jsonContent: string  // Raw JSON string from tool result
}

export function LackOfContextDropdown({ jsonContent }: LackOfContextDropdownProps) {
  // Parse structured fields from JSON content
  let parsed: any = null
  try {
    parsed = JSON.parse(jsonContent)
  } catch {
    // keep null; fall back to raw
  }

  const reason: string | undefined = parsed && typeof parsed.reason === 'string' ? parsed.reason : undefined
  const message: string | undefined = parsed && typeof parsed.message === 'string' ? parsed.message : undefined
  const requiredInfo: string[] = parsed && Array.isArray(parsed.requiredInfo) ? parsed.requiredInfo : []
  const suggestedPrompts: string[] = parsed && Array.isArray(parsed.suggestedPrompts) ? parsed.suggestedPrompts : []
  // No inline inputs: chat input will be used for follow-up

  return (
    <InlineDropdown title='lack_of_context_tool' defaultExpanded collapseKey='lack_of_context_tool'>
      <div className='rounded-xl p-3 bg-brand/10 border border-brand/20'>
        {/* Headline */}
        <div className='text-sm font-semibold text-foreground mb-1'>Action paused — input needed</div>
        {/* Message (prefer parsed.message; include messageBelow if provided) */}
        <div className='text-xs text-foreground/80 whitespace-pre-wrap'>
          {message || ''}
        </div>
        {/* Reason */}
        {reason && (
          <div className='mt-2 text-xs text-muted-foreground'>Reason: {reason}</div>
        )}
        {/* Required info list */}
        {requiredInfo.length > 0 && (
          <div className='mt-3'>
            <div className='text-xs font-medium text-foreground mb-1'>Required information</div>
            <ul className='list-disc list-inside text-sm text-foreground/90 space-y-0.5'>
              {requiredInfo.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Suggested prompts */}
        {/* Suggestions intentionally omitted. Users should reply via the main chat input. */}
      </div>
    </InlineDropdown>
  )
}


