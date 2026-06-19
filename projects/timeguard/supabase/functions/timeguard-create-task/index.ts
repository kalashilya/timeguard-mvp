import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const PLAN_LIMITS: Record<string, { perDay: number; daysAhead: number }> = {
  free: { perDay: 5, daysAhead: 3 },
  plus: { perDay: 30, daysAhead: 14 },
  team: { perDay: 100, daysAhead: 60 },
}

const RATE_LIMIT_WINDOW_MINUTES = 10
const RATE_LIMIT_MAX_CREATES = 20

type TaskPayload = {
  local_id?: string
  task_date?: string
  title?: string
  start_time?: string
  end_time?: string
  priority?: 'high' | 'medium' | 'low'
  category?: string
  notes?: string
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isValidTime(value: string) {
  return /^\d{2}:\d{2}$/.test(value)
}

function daysAhead(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${date}T00:00:00`)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return jsonResponse({ error: 'Missing authorization header' }, 401)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authData.user) return jsonResponse({ error: 'Unauthorized' }, 401)

    const userId = authData.user.id
    const payload = await req.json() as TaskPayload

    const task = {
      local_id: String(payload.local_id ?? crypto.randomUUID()),
      task_date: String(payload.task_date ?? '').trim(),
      title: String(payload.title ?? '').trim(),
      start_time: String(payload.start_time ?? '').slice(0, 5),
      end_time: String(payload.end_time ?? '').slice(0, 5),
      priority: payload.priority ?? 'medium',
      category: String(payload.category ?? 'personal').trim(),
      notes: String(payload.notes ?? '').trim(),
    }

    if (!isValidDate(task.task_date)) return jsonResponse({ error: 'Invalid task date' }, 400)
    if (!isValidTime(task.start_time) || !isValidTime(task.end_time)) return jsonResponse({ error: 'Invalid time format' }, 400)
    if (toMinutes(task.end_time) <= toMinutes(task.start_time)) return jsonResponse({ error: 'End time must be after start time' }, 400)
    if (!task.title || task.title.length > 140) return jsonResponse({ error: 'Task title is required and must be shorter than 140 characters' }, 400)
    if (task.notes.length > 800) return jsonResponse({ error: 'Notes are too long' }, 400)
    if (!['high', 'medium', 'low'].includes(task.priority)) return jsonResponse({ error: 'Invalid priority' }, 400)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, plan')
      .eq('id', userId)
      .single()

    if (profileError || !profile) return jsonResponse({ error: 'Profile not found' }, 404)

    const plan = String(profile.plan ?? 'free').toLowerCase()
    const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free

    const dayShift = daysAhead(task.task_date)
    if (dayShift > limit.daysAhead) {
      return jsonResponse({ error: `Your plan allows planning only ${limit.daysAhead} days ahead` }, 402)
    }

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()
    const { count: recentCreates, error: rateError } = await supabase
      .from('task_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('event_type', 'task_created')
      .gte('created_at', windowStart)

    if (rateError) throw rateError
    if ((recentCreates ?? 0) >= RATE_LIMIT_MAX_CREATES) {
      return jsonResponse({ error: 'Too many task creations. Try again later.' }, 429)
    }

    const { data: dayTasks, error: dayTasksError } = await supabase
      .from('tasks')
      .select('id, title, start_time, end_time')
      .eq('user_id', userId)
      .eq('task_date', task.task_date)

    if (dayTasksError) throw dayTasksError

    if ((dayTasks ?? []).length >= limit.perDay) {
      return jsonResponse({ error: `Your plan allows only ${limit.perDay} tasks per day` }, 402)
    }

    const conflict = (dayTasks ?? []).find((row) => {
      const existingStart = toMinutes(String(row.start_time).slice(0, 5))
      const existingEnd = toMinutes(String(row.end_time).slice(0, 5))
      return toMinutes(task.start_time) < existingEnd && toMinutes(task.end_time) > existingStart
    })

    if (conflict) {
      return jsonResponse({
        error: 'Task time conflict',
        conflict: {
          id: conflict.id,
          title: conflict.title,
          start_time: conflict.start_time,
          end_time: conflict.end_time,
        },
      }, 409)
    }

    const { data: createdTask, error: createError } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        local_id: task.local_id,
        task_date: task.task_date,
        title: task.title,
        start_time: task.start_time,
        end_time: task.end_time,
        priority: task.priority,
        category: task.category,
        notes: task.notes || null,
        done: false,
      })
      .select('*')
      .single()

    if (createError) throw createError

    await supabase.from('task_events').insert({
      user_id: userId,
      event_type: 'task_created',
      payload: { task_id: createdTask.id, source: 'edge_function' },
    })

    return jsonResponse({ ok: true, task: createdTask })
  } catch (error) {
    console.error(error)
    return jsonResponse({ error: 'Unexpected server error' }, 500)
  }
})
