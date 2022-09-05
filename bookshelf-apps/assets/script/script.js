const cekWebStorage = function(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

const buku = [];
const RENDER_EVENT = 'render-todo';
const storageKey = 'Bookshelf_App';
const savedEvent = 'saved-event';
const header = document.getElementById('head_bar');
const modeButton = document.getElementById('mode');
const inputSection = document.getElementById('input_section');
const bookShelfComplete = document.getElementById('book_shelf_read_complete');
const bookShelfIncomplete = document.getElementById('book_shelf_read_incomplete');
let mode = localStorage.getItem('mode');

function tambahBuku(){
  const inputJudulBuku = document.getElementById('inputBookTitle');
  const inputPenulisBuku = document.getElementById('inputBookAuthor');
  const inputTahunBuku = document.getElementById('inputBookYear');
  const inputBookComplete = document.getElementById('inputBookIsComplete');

  const judulBukuValue = inputJudulBuku.value;
  const penulisBukuValue = inputPenulisBuku.value;
  const tahunBukuValue = inputTahunBuku.value;
  const isCompleted = inputBookComplete.checked;

  const generateID = generateId();
  const objekBuku = generateObjekBuku(generateID, judulBukuValue, penulisBukuValue, tahunBukuValue, isCompleted);

  buku.push(objekBuku);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId(){
  return +new Date();
}

function generateObjekBuku(id, judulBuku, penulisBuku, tahunBuku, isCompleted){
  return {
      id,
      judulBuku,
      penulisBuku,
      tahunBuku,
      isCompleted
  }
}

function membuatBuku(objekBuku){
  const textJudul = document.createElement('h2');
  textJudul.innerHTML = `${objekBuku.judulBuku}`;

  const textPenulis = document.createElement('p');
  textPenulis.innerHTML = `Penulis : ${objekBuku.penulisBuku}`;

  const textDate = document.createElement('p');
  textDate.innerHTML = `Tahun : ${objekBuku.tahunBuku}`;

  const tombolHapus = document.createElement('button');
  tombolHapus.classList.add('trash-button');
  tombolHapus.addEventListener('click', function(){
    
  const pesan = confirm('anda yakin ingin menghapus buku ini ? ');
    if(pesan == true){
      hapusBuku(objekBuku.id);

      const popup = document.querySelector('.popup');
      popup.innerText = 'Buku Berhasil Dihapus'
      showPopup();
    } else {
      '';
    }
  });

  const container = document.createElement('article');
  container.append(textJudul, textPenulis, textDate);
  container.classList.add('book_item');
  container.setAttribute('id', `buku-${objekBuku.id}`);

  if (objekBuku.isCompleted) {
      const tombolBelumSelesaiDibaca = document.createElement('button');
      tombolBelumSelesaiDibaca.innerText = 'Belum Selesai Dibaca'
      tombolBelumSelesaiDibaca.classList.add('salmon');
   
      tombolBelumSelesaiDibaca.addEventListener('click', function () {
        moveBookToIncompleted(objekBuku.id);
        const popup = document.querySelector('.popup');
        popup.innerText = 'Buku Dipindahkan ke Rak Belum Selesai Dibaca';
        showPopup();  
      });
     
     
   
      container.append(tombolBelumSelesaiDibaca, tombolHapus);
    } else {
      const tombolSelesaiDibaca = document.createElement('button');
      tombolSelesaiDibaca.innerText = 'Selesai Dibaca';
      tombolSelesaiDibaca.classList.add('salmon');
      
      tombolSelesaiDibaca.addEventListener('click', function () {
        moveBookToCompleted(objekBuku.id);
        const popup = document.querySelector('.popup');
        popup.innerText = 'Buku Dipindahkan ke Rak Selesai Dibaca';
        showPopup();  
      });

      container.append(tombolSelesaiDibaca, tombolHapus);
    }

  return container;

}

function moveBookToCompleted(bukuId) {
  const bukuTarget = findBuku(bukuId);
 
  if (bukuTarget == null) return;
 
  bukuTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBuku(bukuId) {
  for (const bukuitem of buku) {
    if (bukuitem.id === bukuId) {
      return bukuitem;
    }
  }
  return null;
}

function moveBookToIncompleted(bukuId){
const bukuTarget = findBuku(bukuId);

if(bukuTarget == null) return;

bukuTarget.isCompleted = false;
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

function hapusBuku(todoId) {
const bukuTarget = findBukuIndex(todoId);

if (bukuTarget === -1) return;

buku.splice(bukuTarget, 1);
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

function findBukuIndex(todoId) {
for (const index in buku) {
  if (buku[index].id === todoId) {
    return index;
  }
}

return -1;
}

function saveData() {
if (cekWebStorage) {
  const parsed = JSON.stringify(buku);
  localStorage.setItem(storageKey, parsed);
  document.dispatchEvent(new Event(savedEvent));
}
}

function loadDataFromStorage(){
const serializedData = localStorage.getItem(storageKey);
let data = JSON.parse(serializedData);

if (data !== null) {
  for (const book of data) {
    buku.push(book);
  }
}

document.dispatchEvent(new Event(RENDER_EVENT));
}

function showPopup(){
const popup = document.querySelector('.popup');
popup.classList.add('aktif');

setTimeout(function(){
  popup.classList.remove('aktif')
},1500)
}

if(!mode){
localStorage.setItem('mode', 'light');
}

function darkMode(){
document.body.classList.add('dark-mode');

header.classList.add('aktif');
inputSection.classList.add('aktif');
bookShelfComplete.classList.add('aktif');
bookShelfIncomplete.classList.add('aktif');

modeButton.innerHTML = 'Light Mode';
localStorage.setItem('mode', 'dark')
}

function lightMode(){
document.body.classList.remove('dark-mode');

header.classList.remove('aktif');
inputSection.classList.remove('aktif');
bookShelfComplete.classList.remove('aktif');
bookShelfIncomplete.classList.remove('aktif');


modeButton.innerHTML = 'Dark Mode';
localStorage.setItem('mode', 'light')
}

if(mode == 'dark'){
darkMode();
}

modeButton.addEventListener('click', function(e){
e.preventDefault();

mode = localStorage.getItem('mode');

if(mode == 'light'){
  darkMode();
} else {
  lightMode();
}
})


document.addEventListener('DOMContentLoaded', function(){
 
    document.querySelector('.head_bar__title').addEventListener('click', function(){
      location.reload();
    });

    document.getElementById('inputBook').addEventListener('submit', function(e){
        e.preventDefault();
        
        tambahBuku();
        const popup = document.querySelector('.popup');
        popup.innerText = 'Buku Berhasil Ditambah';
        showPopup();
    });
 
    if(cekWebStorage){
      loadDataFromStorage();
    }
});

document.addEventListener(savedEvent, function () {
  console.log(localStorage.getItem(storageKey));
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBukuList = document.getElementById('incompleteBookshelfList');
    uncompletedBukuList.innerHTML = '';

    const completeBukuList = document.getElementById('completeBookshelfList');
    completeBukuList.innerHTML = '';

    for (const bukuitem of buku) {
        const bukuElement = membuatBuku(bukuitem);
        if (!bukuitem.isCompleted) {
          uncompletedBukuList.append(bukuElement);
        } else {
            completeBukuList.append(bukuElement);
        }
      }
    
});


