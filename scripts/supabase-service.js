// =============================================
// SUPABASE SERVICE - Wrapper para LocalStorage
// =============================================

const supabaseInstance = window.supabaseClient;

// Helper para adicionar header com email do usuário logado (para RLS)
function getAuthHeaders() {
    const session = sessionStorage.getItem('eletrolight_session');
    if (session) {
        const user = JSON.parse(session);
        return {
            'x-user-email': user.email
        };
    }
    return {};
}

// ============================================
// USUÁRIOS (substitui eletrolight_users)
// ============================================

async function getUsers() {
    const { data, error } = await supabaseInstance
        .from('users')
        .select('*');
    if (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
    return data || [];
}

async function findUserByEmail(email) {
    console.log('Buscando usuário por email:', email.toLowerCase());
    const { data, error } = await supabaseInstance
        .from('users')
        .select('id, nome, cpf, nascimento, email, senha, whatsapp, foto, is_admin, bloqueio_publicacao, bloqueio_chat, created_at, updated_at')
        .eq('email', email.toLowerCase())
        .maybeSingle();
    if (error) {
        console.error('Erro Supabase:', error);
    }
    console.log('Dados retornados:', data);
    return data;
}

async function findUserByCPF(cpf) {
    const cleanCPF = cpf.replace(/\D/g, '');
    const { data, error } = await supabaseInstance
        .from('users')
        .select('*')
        .eq('cpf', cleanCPF)
        .single();
    if (error && error.code !== 'PGRST116') {
        console.error('Erro:', error);
    }
    return data;
}

async function findUserById(userId) {
    const { data, error } = await supabaseInstance
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar usuário por ID:', error);
    }
    return data;
}

async function saveUser(user) {
    const { data, error } = await supabaseInstance
        .from('users')
        .insert([{
            nome: user.nome,
            cpf: user.cpf.replace(/\D/g, ''),
            nascimento: user.nascimento,
            email: user.email.toLowerCase(),
            senha: user.senha,
            whatsapp: user.whatsapp || null,
            foto: user.foto || null
        }])
        .select()
        .single();
    
    if (error) {
        console.error('Erro ao salvar usuário:', error);
        throw error;
    }
    return data;
}

async function updateUser(userId, updates) {
    const { data, error } = await supabaseInstance
        .from('users')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();
    
    if (error) {
        console.error('Erro ao atualizar:', error);
        throw error;
    }
    
    if (!data || data.length === 0) {
        const err = new Error('Nenhum usuário atualizado. Verifique permissões (RLS) ou se o usuário existe.');
        err.code = 'PGRST116';
        throw err;
    }
    
    return data[0];
}

// ============================================
// SESSÃO (substitui eletrolight_user)
// ============================================

function setSession(user) {
    sessionStorage.setItem('eletrolight_session', JSON.stringify({
        nome: user.nome,
        email: user.email,
        is_admin: user.is_admin || false
    }));
}

function getSession() {
    const stored = sessionStorage.getItem('eletrolight_session');
    return stored ? JSON.parse(stored) : null;
}

function clearSession() {
    sessionStorage.removeItem('eletrolight_session');
}

// ============================================
// ANÚNCIOS (substitui eletrolight_anuncios)
// ============================================

async function getAnuncios() {
    const { data, error } = await supabaseInstance
        .from('anuncios')
        .select('*')
        .eq('status', 'aprovado')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Erro ao buscar anúncios:', error);
        return [];
    }
    return data || [];
}

async function getAnunciosByEmail(email) {
    const { data, error } = await supabaseInstance
        .from('anuncios')
        .select('*')
        .eq('email', email.toLowerCase())
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Erro:', error);
        return [];
    }
    return data || [];
}

async function adicionarAnuncio(anuncio) {
    const { data, error } = await supabaseInstance
        .from('anuncios')
        .insert([{
            titulo: anuncio.titulo,
            categoria: anuncio.categoria,
            tipo: anuncio.tipo,
            condicao: anuncio.condicao,
            marca: anuncio.marca || null,
            descricao: anuncio.descricao,
            foto: anuncio.foto || null,
            nome: anuncio.nome,
            email: anuncio.email.toLowerCase(),
            whatsapp: anuncio.whatsapp,
            bairro: anuncio.bairro
        }])
        .select()
        .single();
    
    if (error) {
        console.error('Erro ao criar anúncio:', error);
        throw error;
    }
    return data;
}

async function atualizarAnuncio(id, updates) {
    console.log('=== DEBUG atualizarAnuncio ===');
    console.log('ID:', id);
    console.log('Updates:', updates);
    
    // Faz o update sem .select() para evitar problemas de retorno
    const { error } = await supabaseInstance
        .from('anuncios')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);
    
    if (error) {
        console.error('Erro ao atualizar:', error);
        throw error;
    }
    
    console.log('Update executado sem erro');
    return { id, ...updates };
}

async function deletarAnuncio(id) {
    console.log('=== DEBUG deletarAnuncio ===');
    console.log('ID para deletar:', id);
    
    const { error } = await supabaseInstance
        .from('anuncios')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Erro ao deletar:', error);
        throw error;
    }
    
    console.log('Delete executado sem erro');
    return true;
}

// ============================================
// MENSAGENS (Chat entre usuários)
// ============================================

const MENSAGENS_KEY = 'eletrolight_mensagens';

function _getMensagensLS(anuncioId, emailA, emailB) {
    const all = JSON.parse(localStorage.getItem(MENSAGENS_KEY) || '[]');
    return all
        .filter(m =>
            String(m.anuncio_id) === String(anuncioId) &&
            ((m.remetente_email === emailA.toLowerCase() && m.destinatario_email === emailB.toLowerCase()) ||
             (m.remetente_email === emailB.toLowerCase() && m.destinatario_email === emailA.toLowerCase()))
        )
        .sort((a, b) => a.id - b.id);
}

function _getConversasLS(anuncioId, ownerEmail) {
    const all = JSON.parse(localStorage.getItem(MENSAGENS_KEY) || '[]');
    const pessoas = {};
    all.filter(m => String(m.anuncio_id) === String(anuncioId)).forEach(m => {
        const outroEmail = m.remetente_email === ownerEmail.toLowerCase() ? m.destinatario_email : m.remetente_email;
        const outroNome  = m.remetente_email === ownerEmail.toLowerCase() ? (m.destinatario_nome || outroEmail) : (m.remetente_nome || m.remetente_email);
        if (outroEmail !== ownerEmail.toLowerCase()) {
            pessoas[outroEmail] = outroNome;
        }
    });
    return Object.entries(pessoas).map(([email, nome]) => ({ email, nome }));
}

async function getMensagens(anuncioId, emailA, emailB) {
    if (supabaseInstance) {
        try {
            const { data, error } = await supabaseInstance
                .from('mensagens')
                .select('*')
                .eq('anuncio_id', String(anuncioId))
                .order('id', { ascending: true });
            if (!error && data) {
                return data.filter(m =>
                    (m.remetente_email === emailA.toLowerCase() && m.destinatario_email === emailB.toLowerCase()) ||
                    (m.remetente_email === emailB.toLowerCase() && m.destinatario_email === emailA.toLowerCase())
                );
            }
        } catch (e) {}
    }
    return _getMensagensLS(anuncioId, emailA, emailB);
}

async function getConversasDoAnuncio(anuncioId, ownerEmail) {
    if (supabaseInstance) {
        try {
            const { data, error } = await supabaseInstance
                .from('mensagens')
                .select('remetente_email, remetente_nome, destinatario_email, destinatario_nome')
                .eq('anuncio_id', String(anuncioId));
            if (!error && data) {
                const pessoas = {};
                data.forEach(m => {
                    const outroEmail = m.remetente_email === ownerEmail.toLowerCase() ? m.destinatario_email : m.remetente_email;
                    const outroNome  = m.remetente_email === ownerEmail.toLowerCase() ? (m.destinatario_nome || outroEmail) : (m.remetente_nome || m.remetente_email);
                    if (outroEmail !== ownerEmail.toLowerCase()) pessoas[outroEmail] = outroNome;
                });
                return Object.entries(pessoas).map(([email, nome]) => ({ email, nome }));
            }
        } catch (e) {}
    }
    return _getConversasLS(anuncioId, ownerEmail);
}

async function enviarMensagem(anuncioId, remetenteEmail, remetenteNome, destinatarioEmail, destinatarioNome, texto) {
    const base = {
        anuncio_id:        String(anuncioId),
        remetente_email:   remetenteEmail.toLowerCase(),
        remetente_nome:    remetenteNome,
        destinatario_email: destinatarioEmail.toLowerCase(),
        destinatario_nome: destinatarioNome,
        texto
    };
    if (supabaseInstance) {
        try {
            const { data, error } = await supabaseInstance
                .from('mensagens')
                .insert([base])
                .select()
                .single();
            if (!error && data) return data;
        } catch (e) {}
    }
    // localStorage fallback
    const msg = { ...base, created_at: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem(MENSAGENS_KEY) || '[]');
    msg.id = Date.now();
    all.push(msg);
    localStorage.setItem(MENSAGENS_KEY, JSON.stringify(all));
    return msg;
}

// ============================================
// ADMIN — Anúncios
// ============================================

async function getAnunciosPendentes() {
    const { data, error } = await supabaseInstance
        .from('anuncios')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
}

async function aprovarAnuncio(id) {
    const { error } = await supabaseInstance
        .from('anuncios')
        .update({ status: 'aprovado', updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
    return true;
}

async function rejeitarAnuncio(id) {
    const { error } = await supabaseInstance
        .from('anuncios')
        .update({ status: 'rejeitado', updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
    return true;
}

// ============================================
// ADMIN — Denúncias
// ============================================

async function getDenuncias() {
    const { data, error } = await supabaseInstance
        .from('denuncias')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

async function enviarDenuncia(denuncia) {
    const { data, error } = await supabaseInstance
        .from('denuncias')
        .insert([denuncia])
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function resolverDenuncia(id) {
    const { error } = await supabaseInstance
        .from('denuncias')
        .update({ status: 'resolvida' })
        .eq('id', id);
    if (error) throw error;
    return true;
}

// ============================================
// ADMIN — Conteúdo Educativo
// ============================================

async function getConteudoEducativo() {
    const { data, error } = await supabaseInstance
        .from('conteudo_educativo')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

async function adicionarConteudo(conteudo) {
    const { data, error } = await supabaseInstance
        .from('conteudo_educativo')
        .insert([{ ...conteudo, ativo: true }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function atualizarConteudo(id, updates) {
    const { error } = await supabaseInstance
        .from('conteudo_educativo')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
    return true;
}

async function deletarConteudo(id) {
    const { error } = await supabaseInstance
        .from('conteudo_educativo')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
}

// ============================================
// ADMIN — Punições
// ============================================

async function aplicarPunicao(email, tipo) {
    const updates = {};
    if (tipo === 'publicacao' || tipo === 'ambos') updates.bloqueio_publicacao = true;
    if (tipo === 'chat'      || tipo === 'ambos') updates.bloqueio_chat = true;
    const { error } = await supabaseInstance
        .from('users')
        .update(updates)
        .eq('email', email.toLowerCase());
    if (error) throw error;
    return true;
}

async function removerPunicao(email, tipo) {
    const updates = {};
    if (tipo === 'publicacao' || tipo === 'ambos') updates.bloqueio_publicacao = false;
    if (tipo === 'chat'      || tipo === 'ambos') updates.bloqueio_chat = false;
    const { error } = await supabaseInstance
        .from('users')
        .update(updates)
        .eq('email', email.toLowerCase());
    if (error) throw error;
    return true;
}

async function excluirConta(email) {
    await supabaseInstance.from('anuncios').delete().eq('email', email.toLowerCase());
    const { error } = await supabaseInstance
        .from('users')
        .delete()
        .eq('email', email.toLowerCase());
    if (error) throw error;
    return true;
}

async function getUsuariosBloqueados() {
    const { data, error } = await supabaseInstance
        .from('users')
        .select('id, nome, email, bloqueio_publicacao, bloqueio_chat')
        .or('bloqueio_publicacao.eq.true,bloqueio_chat.eq.true')
        .order('nome', { ascending: true });
    if (error) throw error;
    return data || [];
}

// ============================================
// EXPORTS
// ============================================

window.SupabaseService = {
    getUsers,
    findUserByEmail,
    findUserByCPF,
    findUserById,
    saveUser,
    updateUser,
    setSession,
    getSession,
    clearSession,
    getAnuncios,
    getAnunciosByEmail,
    adicionarAnuncio,
    atualizarAnuncio,
    deletarAnuncio,
    getMensagens,
    getConversasDoAnuncio,
    enviarMensagem,
    getAnunciosPendentes,
    aprovarAnuncio,
    rejeitarAnuncio,
    getDenuncias,
    enviarDenuncia,
    resolverDenuncia,
    getConteudoEducativo,
    adicionarConteudo,
    atualizarConteudo,
    deletarConteudo,
    aplicarPunicao,
    removerPunicao,
    excluirConta,
    getUsuariosBloqueados
};
