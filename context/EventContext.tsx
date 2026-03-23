'use client'

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { subscribeToEvents } from '@/lib/realtime/channels'
import { ToastPayload, GameEvent } from '@/types'

type EventContextState = {
  toasts: ToastPayload[]
}

type EventAction =
  | { type: 'ADD_TOAST'; payload: ToastPayload }
  | { type: 'REMOVE_TOAST'; id: string }

const EventContext = createContext<{
  state: EventContextState
  dispatch: React.Dispatch<EventAction>
} | null>(null)

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer((state: EventContextState, action: EventAction) => {
    switch (action.type) {
      case 'ADD_TOAST':
        // Keep max 3 toasts, pushing out the oldest
        const nextToasts = [...state.toasts, action.payload]
        if (nextToasts.length > 3) {
          nextToasts.shift()
        }
        return { toasts: nextToasts }
      case 'REMOVE_TOAST':
        return { toasts: state.toasts.filter(t => t.id !== action.id) }
      default:
        return state
    }
  }, { toasts: [] })

  useEffect(() => {
    const channel = subscribeToEvents((payload) => {
      const newEvent = payload.new as GameEvent
      
      const toastPayload: ToastPayload = {
        id: newEvent.id, // using db row id
        eventType: newEvent.event_type,
        teamId: newEvent.team_id || '',
        teamName: newEvent.metadata?.teamName || 'Team',
        secondaryTeamName: newEvent.metadata?.secondaryTeamName,
        triggeredByRole: newEvent.triggered_by_role,
        tokenDelta: newEvent.token_delta || undefined,
        metadata: newEvent.metadata
      }

      dispatch({ type: 'ADD_TOAST', payload: toastPayload })
      
      if (newEvent.metadata?.isEndEvent) {
        // If the event has ended, we force a refresh so all clients pick up the new state
        setTimeout(() => window.location.reload(), 3000)
      } else if (newEvent.metadata?.isBroadcast) {
        // Broadcasts stay for 15 seconds
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', id: newEvent.id })
        }, 15000)
      } else {
        // Normal toasts auto dismiss after 4 seconds
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', id: newEvent.id })
        }, 4000)
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEventToasts = () => {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error('useEventToasts must be used inside EventProvider')
  return ctx
}
