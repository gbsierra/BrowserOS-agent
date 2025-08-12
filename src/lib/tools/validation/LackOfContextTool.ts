import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { ExecutionContext } from '@/lib/runtime/ExecutionContext'
import { toolError } from '@/lib/tools/Tool.interface'
import { lackOfContextToolDescription } from '@/lib/tools/validation/LackOfContextTool.prompt'

// Input schema describing why execution should pause and what is needed
export const LackOfContextInputSchema = z.object({
  reason: z.string().min(1),  // Generic reason for pausing (human-readable)
  message: z.string().min(1),  // Short user-facing message
  requiredInfo: z.array(z.string()).optional(),  // Specific info needed from the user
  suggestedPrompts: z.array(z.string()).optional(),  // Optional prompts to speed user input
  tags: z.array(z.string()).optional()  // e.g., ['ambiguous', 'login_required']
}).strict()

export type LackOfContextInput = z.infer<typeof LackOfContextInputSchema>

// Factory function to create LackOfContextTool
export function createLackOfContextTool (_executionContext: ExecutionContext): DynamicStructuredTool {
  const ToolCtor = DynamicStructuredTool as unknown as new (config: any) => DynamicStructuredTool
  return new ToolCtor({
    name: 'lack_of_context_tool',
    description: lackOfContextToolDescription,
    schema: LackOfContextInputSchema,
    func: async (args: LackOfContextInput): Promise<string> => {
      try {
        // Basic shaping only; gating is handled by the agent orchestration
        return JSON.stringify({
          ok: true,
          output: {
            pause: true,
            reason: args.reason,
            message: args.message,
            requiredInfo: args.requiredInfo,
            suggestedPrompts: args.suggestedPrompts,
            tags: args.tags
          }
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        return JSON.stringify(toolError(`Failed to prepare pause gate: ${msg}`))
      }
    }
  })
}


