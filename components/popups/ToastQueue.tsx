'use client'

import { useEventToasts } from '@/context/EventContext'
import EventToast from './EventToast'
import GlobalBroadcast from './GlobalBroadcast'
import { AnimatePresence } from 'framer-motion'

export default function ToastQueue() {
  const { state, dispatch } = useEventToasts()

  const dismissToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }

  const normalToasts = state.toasts.filter(t => !t.metadata?.isBroadcast && !t.metadata?.isEndEvent)
  const broadcasts = state.toasts.filter(t => t.metadata?.isBroadcast)

  return (
    <>
      {/* Normal Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {normalToasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <EventToast
                id={toast.id}
                event_type={toast.eventType}
                team_name={toast.teamName}
                secondary_team_name={toast.secondaryTeamName}
                triggered_by_role={toast.triggeredByRole}
                token_delta={toast.tokenDelta}
                metadata={toast.metadata}
                onDismiss={dismissToast}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Global Broadcast Overlays */}
      <AnimatePresence>
        {broadcasts.map((broadcast) => (
          <GlobalBroadcast 
            key={broadcast.id}
            message={broadcast.metadata?.message}
            onDismiss={() => dismissToast(broadcast.id)}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
