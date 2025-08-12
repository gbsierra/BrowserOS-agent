import { describe, it, expect } from 'vitest'
import { createLackOfContextTool } from '@/lib/tools/validation/LackOfContextTool'
import { ExecutionContext } from '@/lib/runtime/ExecutionContext'
import BrowserContext from '@/lib/browser/BrowserContext'
import { MessageManager } from '@/lib/runtime/MessageManager'

describe('LackOfContextTool', () => {
  it('returns ok=true with pause output and echoes fields', async () => {
    const executionContext = new ExecutionContext({
      browserContext: new BrowserContext({ useVision: false }),
      messageManager: new MessageManager(8000),
      debugMode: false
    })

    const tool = createLackOfContextTool(executionContext)
    const resultStr = await tool.func({
      reason: 'ambiguous',
      message: 'Please specify which item to open',
      requiredInfo: ['exact item name'],
      suggestedPrompts: ['Open the “MacBook Air M2” product page'],
      tags: ['ambiguous']
    } as any)
    const result = JSON.parse(resultStr)
    expect(result.ok).toBe(true)
    expect(result.output.pause).toBe(true)
    expect(result.output.reason).toBe('ambiguous')
    expect(result.output.message).toContain('specify')
    expect(Array.isArray(result.output.requiredInfo)).toBe(true)
    expect(Array.isArray(result.output.suggestedPrompts)).toBe(true)
    expect(Array.isArray(result.output.tags)).toBe(true)
  })
})


