import { supabase } from './supabaseClient';

// =============================================
// SESSION ID (anonymous vote tracking)
// =============================================
function getSessionId() {
  let sessionId = localStorage.getItem('ark_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('ark_session_id', sessionId);
  }
  return sessionId;
}

// =============================================
// PAINS
// =============================================

export async function fetchPains() {
  const sessionId = getSessionId();

  const { data: pains, error } = await supabase
    .from('pains')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pains:', error);
    return [];
  }

  // Check which pains the current session has voted for
  const { data: votes } = await supabase
    .from('pain_votes')
    .select('pain_id')
    .eq('session_id', sessionId);

  const votedIds = new Set((votes || []).map(v => v.pain_id));

  // Check which pains have pending solutions
  const { data: pendingSolutions } = await supabase
    .from('solutions')
    .select('pain_id')
    .eq('status', 'pending');

  const pendingPainIds = new Set((pendingSolutions || []).map(s => s.pain_id));

  return pains.map(p => ({
    ...p,
    voted: votedIds.has(p.id),
    hasPendingSolution: pendingPainIds.has(p.id),
  }));
}

export async function addPain(title, description = '') {
  const { data, error } = await supabase
    .from('pains')
    .insert({
      text: `"${title.trim()}"`,
      description: description.trim(),
      status: 'open',
      votes: 1,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding pain:', error);
    return null;
  }

  // Also add a vote for the creator
  const sessionId = getSessionId();
  await supabase.from('pain_votes').insert({
    pain_id: data.id,
    session_id: sessionId,
  });

  return { ...data, voted: true };
}

export async function toggleVote(painId) {
  const sessionId = getSessionId();

  // Check if already voted
  const { data: existing } = await supabase
    .from('pain_votes')
    .select('id')
    .eq('pain_id', painId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (existing) {
    // Remove vote
    await supabase.from('pain_votes').delete().eq('id', existing.id);
    await supabase.rpc('decrement_votes', { pain_id_param: painId }).catch(() => {
      // Fallback: manual update
      return supabase
        .from('pains')
        .update({ votes: supabase.rpc ? undefined : 0 })
        .eq('id', painId);
    });

    // Manual decrement fallback
    const { data: pain } = await supabase.from('pains').select('votes').eq('id', painId).single();
    if (pain) {
      await supabase.from('pains').update({ votes: Math.max(0, pain.votes - 1) }).eq('id', painId);
    }

    return false; // unvoted
  } else {
    // Add vote
    await supabase.from('pain_votes').insert({
      pain_id: painId,
      session_id: sessionId,
    });

    const { data: pain } = await supabase.from('pains').select('votes').eq('id', painId).single();
    if (pain) {
      await supabase.from('pains').update({ votes: pain.votes + 1 }).eq('id', painId);
    }

    return true; // voted
  }
}

// =============================================
// SOLUTIONS
// =============================================

export async function submitSolution(painId, { toolName, toolUrl, toolDescription, contributorName, contributorEmail, photoFile }) {
  let photoUrl = null;

  // Upload photo if provided
  if (photoFile) {
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `solution_${painId}_${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool-images')
      .upload(fileName, photoFile);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
    } else {
      const { data: urlData } = supabase.storage
        .from('tool-images')
        .getPublicUrl(fileName);
      photoUrl = urlData.publicUrl;
    }
  }

  // Ensure URL has protocol
  let formattedUrl = toolUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  const { data, error } = await supabase
    .from('solutions')
    .insert({
      pain_id: painId,
      tool_name: toolName.trim(),
      tool_url: formattedUrl,
      tool_description: (toolDescription || '').trim(),
      contributor_name: (contributorName || '').trim(),
      contributor_email: (contributorEmail || '').trim(),
      photo_url: photoUrl,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting solution:', error);
    return null;
  }

  return data;
}

// =============================================
// TOOLS (community submissions)
// =============================================

export async function submitTool({ name, url, description, category, contributorName, contributorEmail, photoFile }) {
  let photoUrl = null;

  if (photoFile) {
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `tool_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('tool-images')
      .upload(fileName, photoFile);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
    } else {
      const { data: urlData } = supabase.storage
        .from('tool-images')
        .getPublicUrl(fileName);
      photoUrl = urlData.publicUrl;
    }
  }

  let formattedUrl = url.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  const { data, error } = await supabase
    .from('tools')
    .insert({
      name: name.trim(),
      url: formattedUrl,
      description: (description || '').trim(),
      category: category || 'tool',
      contributor_name: (contributorName || '').trim(),
      contributor_email: (contributorEmail || '').trim(),
      photo_url: photoUrl,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting tool:', error);
    return null;
  }

  return data;
}

export async function fetchApprovedTools() {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tools:', error);
    return [];
  }

  return data;
}

// =============================================
// SEARCH (agentic search across pains & tools)
// =============================================

export async function searchAll(query) {
  if (!query || query.trim().length === 0) return { pains: [], tools: [] };

  const searchTerm = query.trim().toLowerCase();

  // Search pains
  const { data: pains } = await supabase
    .from('pains')
    .select('*')
    .or(`text.ilike.%${searchTerm}%,tool_name.ilike.%${searchTerm}%,tool_description.ilike.%${searchTerm}%`)
    .order('votes', { ascending: false })
    .limit(10);

  // Search approved tools
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'approved')
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    pains: pains || [],
    tools: tools || [],
  };
}

// =============================================
// ADMIN FUNCTIONS
// =============================================

export async function fetchPendingSolutions() {
  const { data, error } = await supabase
    .from('solutions')
    .select('*, pains(text)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending solutions:', error);
    return [];
  }

  return data;
}

export async function fetchPendingTools() {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending tools:', error);
    return [];
  }

  return data;
}

export async function approveSolution(solutionId) {
  // Get the solution details first
  const { data: solution } = await supabase
    .from('solutions')
    .select('*')
    .eq('id', solutionId)
    .single();

  if (!solution) return false;

  // Update the solution status
  await supabase
    .from('solutions')
    .update({ status: 'approved' })
    .eq('id', solutionId);

  // Update the associated pain to solved with tool info
  await supabase
    .from('pains')
    .update({
      status: 'solved',
      tool_name: solution.tool_name,
      tool_url: solution.tool_url,
      tool_description: solution.tool_description,
      tool_photo_url: solution.photo_url,
    })
    .eq('id', solution.pain_id);

  return true;
}

export async function rejectSolution(solutionId) {
  const { error } = await supabase
    .from('solutions')
    .update({ status: 'rejected' })
    .eq('id', solutionId);

  return !error;
}

export async function approveTool(toolId) {
  const { error } = await supabase
    .from('tools')
    .update({ status: 'approved' })
    .eq('id', toolId);

  return !error;
}

export async function rejectTool(toolId) {
  const { error } = await supabase
    .from('tools')
    .update({ status: 'rejected' })
    .eq('id', toolId);

  return !error;
}
