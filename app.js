const defaultParticipants = [
  { id:'p1', name:'Júlia Martins', role:'São Paulo — SP', bio:'Presença, personalidade e uma história que merece ser vista.', social:'', photo:'assets/p1.jpg' },
  { id:'p2', name:'Pedro Henrique', role:'Curitiba — PR', bio:'Um olhar autoral para quem transforma presença em narrativa visual.', social:'', photo:'assets/p2.jpg' },
  { id:'p3', name:'Larissa Almeida', role:'Belo Horizonte — MG', bio:'Elegância, atitude e um ensaio pensado para ficar na memória.', social:'', photo:'assets/p3.jpg' },
  { id:'p4', name:'Gabriel Santos', role:'Salvador — BA', bio:'Histórias reais, fotografadas com estética editorial e identidade.', social:'', photo:'assets/p4.jpg' }
];

function getParticipants(){
  try{
    const saved=JSON.parse(localStorage.getItem('deuCapaParticipants')||'null');
    if(!Array.isArray(saved)||!saved.length)return defaultParticipants;
    return saved.map((person,index)=>({
      ...person,
      photo:person.photo||defaultParticipants[index%defaultParticipants.length].photo
    }));
  }catch{return defaultParticipants;}
}

const grid=document.getElementById('participantGrid');
const modal=document.getElementById('profileModal');
const modalName=document.getElementById('modalName');
const modalBio=document.getElementById('modalBio');
const modalSocial=document.getElementById('modalSocial');
const modalPhoto=document.getElementById('modalPhoto');

function renderParticipants(){
  const participants=getParticipants();
  grid.innerHTML='';
  participants.slice(0,8).forEach((person,index)=>{
    const card=document.createElement('button');
    card.className='participant-card';
    const photo=person.photo||defaultParticipants[index%defaultParticipants.length].photo;
    const photoStyle=`style="background-image:url('${String(photo).replace(/'/g,'%27')}')"`;
    card.innerHTML=`
      <div class="participant-image" ${photoStyle} data-initial="${String(index+1).padStart(2,'0')}"></div>
      <div class="participant-meta">
        <h3>${escapeHtml(person.name)}</h3>
        <p>${escapeHtml(person.role||'Participante')}</p>
        <span class="plus">+</span>
      </div>`;
    card.addEventListener('click',()=>openProfile({...person,photo},index));
    grid.appendChild(card);
  });
}

function openProfile(person,index){
  modalName.textContent=person.name;
  modalBio.textContent=person.bio||'';
  const photo=person.photo||defaultParticipants[index%defaultParticipants.length].photo;
  modalPhoto.innerHTML='';
  modalPhoto.style.backgroundImage=`url('${String(photo).replace(/'/g,'%27')}')`;
  if(person.social){
    modalSocial.href=normalizeSocial(person.social);
    modalSocial.style.display='inline-block';
  }else modalSocial.style.display='none';
  modal.showModal();
}

function normalizeSocial(value){
  const clean=value.trim();
  if(!clean)return'#';
  if(/^https?:\/\//i.test(clean))return clean;
  if(clean.startsWith('@'))return`https://instagram.com/${clean.slice(1)}`;
  return`https://instagram.com/${clean}`;
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

renderParticipants();
window.addEventListener('storage',event=>{if(event.key==='deuCapaParticipants')renderParticipants();});

document.getElementById('modalClose').addEventListener('click',()=>modal.close());
modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});

const menuToggle=document.getElementById('menuToggle');
const mainNav=document.getElementById('mainNav');
menuToggle.addEventListener('click',()=>mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>mainNav.classList.remove('open')));

document.getElementById('contactButton').addEventListener('click',event=>{
  event.preventDefault();
  alert('Em seguida podemos conectar este botão ao WhatsApp ou Instagram oficial da revista.');
});