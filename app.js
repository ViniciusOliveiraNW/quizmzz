const questions = [
  "Você acabou de logar na plataforma, mas não está conseguindo visualizar os atendimentos. O que pode estar acontecendo?",
  "Um novo cliente entrou em contato. Quais informações e quais ações você consegue realizar no dashboard nesse momento?",
  "Um cliente entrou pelo Instagram. Você pode criar um chamado ativo?",
  "Você adicionou outro atendente como participante. O que ele NÃO pode fazer?",
  "Cite algumas métricas do dashboard.",
  "Qual o período máximo para exportar relatórios?",
  "Por que os departamentos são importantes?",
  "Em que situação o bot envia a mensagem de "atendentes ausentes"?",
  "Qual a relação entre horário geral, departamento e atendente?",
  "Situação: O cliente diz que já falou com outro atendente ontem, mas o chat está vazio para você.\nIsso é erro do sistema ou configuração?",
  "Situação: O atendente marcou um card como "perdido" e diz que ele foi apagado.\nIsso realmente acontece?",
  "Situação: Atendente finalizou card, mas não apareceu motivo de perda.\nPor quê?",
  "Situação: Gestor não consegue ver métricas claras de vendas.\nO que pode estar faltando?",
  "Situação: Você criou um card pelo atendimento, mas ele não aparece no board esperado.\nO que pode ter acontecido?",
  "Departamento existe, mas não recebe nenhum cliente. O que pode estar errado?",
  "O número foi banido. Quais procedimentos devem ser realizados?",
  "O que são templates?",
  "Como é feita a abertura dos atendimentos e por quais canais posso realizar?",
  "Quais relatórios o atendente tem acesso?",
  "Quais funções o gestor e o supervisor não têm acesso na plataforma?"
];

/* ─── State ──────────────────────────────────────────────────── */
const STORAGE_KEY = 'quiz_opened_cards';

function getOpened() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch { return new Set(); }
}

function saveOpened(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

const openedCards = getOpened();

/* ─── DOM refs ───────────────────────────────────────────────── */
const grid        = document.getElementById('cardGrid');
const overlay     = document.getElementById('overlay');
const modalNumber = document.getElementById('modalNumber');
const modalQuestion = document.getElementById('modalQuestion');
const modalClose  = document.getElementById('modalClose');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

/* ─── Build cards ────────────────────────────────────────────── */
questions.forEach((q, i) => {
  const n = i + 1;
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.index = i;

  if (openedCards.has(i)) card.classList.add('opened');

  card.style.animationDelay = `${i * 35}ms`;

  card.innerHTML = `
    <span class="card-number">${String(n).padStart(2, '0')}</span>
    <span class="card-hint">Pergunta</span>
  `;

  card.addEventListener('click', () => openModal(i));
  grid.appendChild(card);
});

updateProgress();

/* ─── Modal logic ────────────────────────────────────────────── */
function openModal(index) {
  const n = index + 1;
  modalNumber.textContent   = String(n).padStart(2, '0');
  modalQuestion.textContent = questions[index];

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // Mark as opened
  if (!openedCards.has(index)) {
    openedCards.add(index);
    saveOpened(openedCards);
    const card = grid.querySelector(`[data-index="${index}"]`);
    if (card) card.classList.add('opened');
    updateProgress();
  }
}

function closeModal() {
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
}

function updateProgress() {
  const pct = (openedCards.size / questions.length) * 100;
  progressFill.style.width = pct + '%';
  progressText.textContent = `${openedCards.size} / ${questions.length} abertas`;
}

/* ─── Close triggers ─────────────────────────────────────────── */
modalClose.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
