import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: config } = await supabase
    .from('app_config')
    .select('key, value')

  const configObj = (config || []).reduce((acc: any, item) => {
    acc[item.key] = item.value
    return acc
  }, {})

  return NextResponse.json(configObj)
}
