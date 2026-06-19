(() => {
  const cfg = window.TIMEGUARD_SUPABASE_CONFIG || {};
  const ready = Boolean(cfg.url && cfg.key && window.supabase);
  const client = ready ? window.supabase.createClient(cfg.url, cfg.key) : null;

  async function signUp(email, password, name) {
    if (!client) throw new Error('Supabase is not configured');
    const result = await client.auth.signUp({ email, password, options: { data: { name } } });
    return result;
  }

  async function signIn(email, password) {
    if (!client) throw new Error('Supabase is not configured');
    return client.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    if (!client) return;
    return client.auth.signOut();
  }

  async function getSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session;
  }

  async function upsertProfile(profile) {
    if (!client) throw new Error('Supabase is not configured');
    return client.from('profiles').upsert(profile).select().single();
  }

  async function loadTasks(userId, date) {
    if (!client) throw new Error('Supabase is not configured');
    return client.from('tasks').select('*').eq('user_id', userId).eq('task_date', date).order('start_time', { ascending: true });
  }

  async function createTask(task) {
    if (!client) throw new Error('Supabase is not configured');
    return client.from('tasks').insert(task).select().single();
  }

  async function updateTask(id, patch) {
    if (!client) throw new Error('Supabase is not configured');
    return client.from('tasks').update(patch).eq('id', id).select().single();
  }

  async function deleteTask(id) {
    if (!client) throw new Error('Supabase is not configured');
    return client.from('tasks').delete().eq('id', id);
  }

  window.TimeGuardSupabase = {
    ready,
    client,
    signUp,
    signIn,
    signOut,
    getSession,
    upsertProfile,
    loadTasks,
    createTask,
    updateTask,
    deleteTask
  };
})();
