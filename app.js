const participants = [
  { name: 'Participante 01', role: 'Destaque da edição', bio: 'Espaço reservado para uma apresentação curta da pessoa, do ensaio ou do momento divulgado nesta edição.', social: '#' },
  { name: 'Participante 02', role: 'Ensaio especial', bio: 'Aqui pode entrar um pequeno texto sobre a pessoa, cidade, projeto, evento, estilo ou motivo da participação.', social: '#' },
  { name: 'Participante 03', role: 'Talento em destaque', bio: 'O perfil é simples e direto: foto grande, nome, texto curto e uma rede social opcional.', social: '#' },
  { name: 'Participante 04', role: 'Galeria da edição', bio: 'Cada participante pode ter seu próprio espaço sem deixar a revista pesada ou complicada para navegar.', social: '#' },
  { name: 'Participante 05', role: 'Galeria da edição', bio: 'Este conteúdo inicial é demonstrativo e poderá ser trocado por fotos e textos reais pelo painel em uma próxima etapa.', social: '#' },
  { name: 'Participante 06', role: 'Galeria da edição', bio: 'A proposta é valorizar as imagens e facilitar o compartilhamento da edição no celular.', social: '#' }
];

const grid = document.getElementById('participantGrid');
const modal = document.getElementById('profileModal');
const modalName = document.getElementById('modalName');
const modalBio = document.getElementById('modalBio');
const modalSocial = document.getElementById('modalSocial');
const modalPhoto = document.getElementById('modalPhoto');

participants.forEach((person, index) => {
  const card = document.createElement('button');
  card.className = 'participant-card';
  card.innerHTML = `
    <div class="participant-image" data-initial="${String(index + 1).padStart(2, '0')}"></div>
    <h3>${person.name}</h3>
    <p>${person.role}</p>
  `;
  card.addEventListener('click', () => openProfile(person, index));
  grid.appendChild(card);
});

function openProfile(person, index) {
  modalName.textContent = person.name;
  modalBio.textContent = person.bio;
  modalPhoto.innerHTML = `<span>FOTO ${String(index + 1).padStart(2, '0')}</span>`;
  modalSocial.href = person.social;
  modalSocial.style.display = person.social === '#' ? 'none' : 'inline-block';
  modal.showModal();
}

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
  alert('Na próxima etapa, este botão será conectado ao seu WhatsApp ou Instagram para receber solicitações.');
});
