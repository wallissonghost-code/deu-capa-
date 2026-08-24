const defaultParticipants = [
  { id: 'p1', name: 'Participante 01', role: 'Destaque da edição', bio: 'Espaço reservado para uma apresentação curta da pessoa, do ensaio ou do momento divulgado nesta edição.', social: '', photo: '' },
  { id: 'p2', name: 'Participante 02', role: 'Ensaio especial', bio: 'Aqui pode entrar um pequeno texto sobre a pessoa, cidade, projeto, evento, estilo ou motivo da participação.', social: '', photo: '' },
  { id: 'p3', name: 'Participante 03', role: 'Talento em destaque', bio: 'O perfil é simples e direto: foto grande, nome, texto curto e uma rede social opcional.', social: '', photo: '' },
  { id: 'p4', name: 'Participante 04', role: 'Galeria da edição', bio: 'Cada participante pode ter seu próprio espaço sem deixar a revista pesada ou complicada para navegar.', social: '', photo: '' },
  { id: 'p5', name: 'Participante 05', role: 'Galeria da edição', bio: 'Este conteúdo inicial é demonstrativo e pode ser substituído pelo painel administrativo.', social: '', photo: '' },
  { id: 'p6', name: 'Participante 06', role: 'Galeria da edição', bio: 'A proposta é valorizar as imagens e facilitar o compartilhamento da edição no celular.', social: '', photo: '' }
];

function getParticipants() {
  try {
    const saved = JSON.parse(localStorage.getItem('deuCapaParticipants') || 'null');
    return Array.isArray(saved) && saved.length ? saved : defaultParticipants;
  } catch {
    return defaultParticipants;
  }
}

const grid = document.getElementById('participantGrid');
const modal = document.getElementById('profileModal');
const modalName = document.getElementById('modalName');
const modalBio = document.getElementById('modalBio');
const modalSocial = document.getElementById('modalSocial');
const modalPhoto = document.getElementById('modalPhoto');

function renderParticipants() {
  const participants = getParticipants();
  grid.innerHTML = '';

  participants.forEach((person, index) => {
    const card = document.createElement('button');
    card.className = 'participant-card';
    const photoStyle = person.photo ? `style="background-image:url('${person.photo.replace(/'/g, '%27')}');background-size:cover;background-position:center"` : '';
    card.innerHTML = `
      <div class="participant-image" ${photoStyle} data-initial="${String(index + 1).padStart(2, '0')}"></div>
      <h3>${escapeHtml(person.name)}</h3>
      <p>${escapeHtml(person.role || 'Participante')}</p>
    `;
    card.addEventListener('click', () => openProfile(person, index));
    grid.appendChild(card);
  });
}

function openProfile(person, index) {
  modalName.textContent = person.name;
  modalBio.textContent = person.bio || '';
  if (person.photo) {
    modalPhoto.innerHTML = '';
    modalPhoto.style.backgroundImage = `url('${person.photo.replace(/'/g, '%27')}')`;
    modalPhoto.style.backgroundSize = 'cover';
    modalPhoto.style.backgroundPosition = 'center';
  } else {
    modalPhoto.style.backgroundImage = '';
    modalPhoto.innerHTML = `<span>FOTO ${String(index + 1).padStart(2, '0')}</span>`;
  }

  if (person.social) {
    modalSocial.href = normalizeSocial(person.social);
    modalSocial.style.display = 'inline-block';
  } else {
    modalSocial.style.display = 'none';
  }
  modal.showModal();
}

function normalizeSocial(value) {
  const clean = value.trim();
  if (!clean) return '#';
  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.startsWith('@')) return `https://instagram.com/${clean.slice(1)}`;
  return `https://instagram.com/${clean}`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

renderParticipants();
window.addEventListener('storage', (event) => {
  if (event.key === 'deuCapaParticipants') renderParticipants();
});

document.getElementById('modalClose').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mainNav.classList.remove('open')));

document.getElementById('contactButton').addEventListener('click', (event) => {
  event.preventDefault();
  alert('Em seguida podemos conectar este botão ao WhatsApp ou Instagram oficial da revista.');
});
