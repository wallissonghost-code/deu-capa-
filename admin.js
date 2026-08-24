const DEMO_PARTICIPANTS = [
  { id: 'p1', name: 'Participante 01', role: 'Destaque da edição', bio: 'Espaço reservado para uma apresentação curta da pessoa, do ensaio ou do momento divulgado nesta edição.', social: '', photo: '' },
  { id: 'p2', name: 'Participante 02', role: 'Ensaio especial', bio: 'Aqui pode entrar um pequeno texto sobre a pessoa, cidade, projeto, evento, estilo ou motivo da participação.', social: '', photo: '' },
  { id: 'p3', name: 'Participante 03', role: 'Talento em destaque', bio: 'O perfil é simples e direto: foto grande, nome, texto curto e uma rede social opcional.', social: '', photo: '' },
  { id: 'p4', name: 'Participante 04', role: 'Galeria da edição', bio: 'Cada participante pode ter seu próprio espaço sem deixar a revista pesada ou complicada para navegar.', social: '', photo: '' },
  { id: 'p5', name: 'Participante 05', role: 'Galeria da edição', bio: 'Este conteúdo inicial é demonstrativo e pode ser substituído pelo painel administrativo.', social: '', photo: '' },
  { id: 'p6', name: 'Participante 06', role: 'Galeria da edição', bio: 'A proposta é valorizar as imagens e facilitar o compartilhamento da edição no celular.', social: '', photo: '' }
];

const STORAGE_KEY = 'deuCapaParticipants';
const form = document.getElementById('participantForm');
const participantId = document.getElementById('participantId');
const nameInput = document.getElementById('nameInput');
const roleInput = document.getElementById('roleInput');
const bioInput = document.getElementById('bioInput');
const socialInput = document.getElementById('socialInput');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const adminList = document.getElementById('adminList');
const participantCount = document.getElementById('participantCount');
const saveButton = document.getElementById('saveButton');
const saveStatus = document.getElementById('saveStatus');
const bioCount = document.getElementById('bioCount');
let currentPhoto = '';

function loadParticipants() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(saved) ? saved : [...DEMO_PARTICIPANTS];
  } catch {
    return [...DEMO_PARTICIPANTS];
  }
}

function saveParticipants(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderList() {
  const items = loadParticipants();
  participantCount.textContent = items.length;
  adminList.innerHTML = '';

  if (!items.length) {
    adminList.innerHTML = '<div class="empty-state">Nenhum participante publicado ainda.</div>';
    return;
  }

  items.forEach((person, index) => {
    const item = document.createElement('article');
    item.className = 'admin-item';
    item.innerHTML = `
      <div class="admin-thumb" ${person.photo ? `style="background-image:url('${person.photo.replace(/'/g, '%27')}')"` : ''}>${person.photo ? '' : String(index + 1).padStart(2, '0')}</div>
      <div>
        <h3>${escapeHtml(person.name)}</h3>
        <p>${escapeHtml(person.role || 'Participante')}</p>
      </div>
      <div class="item-actions">
        <button class="edit-btn" type="button">Editar</button>
        <button class="delete-btn" type="button">Excluir</button>
      </div>
    `;

    item.querySelector('.edit-btn').addEventListener('click', () => editParticipant(person));
    item.querySelector('.delete-btn').addEventListener('click', () => deleteParticipant(person.id));
    adminList.appendChild(item);
  });
}

function editParticipant(person) {
  participantId.value = person.id;
  nameInput.value = person.name || '';
  roleInput.value = person.role || '';
  bioInput.value = person.bio || '';
  socialInput.value = person.social || '';
  currentPhoto = person.photo || '';
  updatePhotoPreview();
  bioCount.textContent = bioInput.value.length;
  saveButton.textContent = 'Salvar alterações';
  saveStatus.textContent = 'Editando participante.';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteParticipant(id) {
  const items = loadParticipants();
  const person = items.find(item => item.id === id);
  if (!person) return;
  if (!confirm(`Excluir ${person.name}?`)) return;
  saveParticipants(items.filter(item => item.id !== id));
  if (participantId.value === id) resetForm();
  renderList();
  saveStatus.textContent = 'Participante excluído.';
}

function resetForm() {
  form.reset();
  participantId.value = '';
  currentPhoto = '';
  bioCount.textContent = '0';
  saveButton.textContent = 'Publicar participante';
  saveStatus.textContent = '';
  updatePhotoPreview();
}

function updatePhotoPreview() {
  if (currentPhoto) {
    photoPreview.style.backgroundImage = `url('${currentPhoto.replace(/'/g, '%27')}')`;
    photoPreview.innerHTML = '';
  } else {
    photoPreview.style.backgroundImage = '';
    photoPreview.innerHTML = '<span>+</span><strong>Adicionar foto</strong><small>JPG, PNG ou WEBP</small>';
  }
}

photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Escolha uma imagem válida.');
    photoInput.value = '';
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    alert('Para esta versão, use uma imagem de até 3 MB.');
    photoInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    currentPhoto = reader.result;
    updatePhotoPreview();
  };
  reader.readAsDataURL(file);
});

bioInput.addEventListener('input', () => {
  bioCount.textContent = bioInput.value.length;
});

document.getElementById('resetForm').addEventListener('click', resetForm);

document.getElementById('restoreDemo').addEventListener('click', () => {
  if (!confirm('Restaurar os participantes demonstrativos? Isso substitui a lista atual.')) return;
  saveParticipants([...DEMO_PARTICIPANTS]);
  resetForm();
  renderList();
  saveStatus.textContent = 'Demonstração restaurada.';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  const items = loadParticipants();
  const id = participantId.value || `p-${Date.now()}`;
  const data = {
    id,
    name,
    role: roleInput.value.trim() || 'Participante',
    bio: bioInput.value.trim(),
    social: socialInput.value.trim(),
    photo: currentPhoto
  };

  const existingIndex = items.findIndex(item => item.id === id);
  if (existingIndex >= 0) items[existingIndex] = data;
  else items.unshift(data);

  try {
    saveParticipants(items);
    saveStatus.textContent = existingIndex >= 0 ? 'Alterações salvas.' : 'Participante publicado.';
    resetForm();
    renderList();
  } catch (error) {
    console.error(error);
    saveStatus.textContent = 'Não foi possível salvar. Tente uma imagem menor.';
  }
});

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

renderList();
updatePhotoPreview();
