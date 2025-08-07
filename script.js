import { db, storage } from './firebase.js';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js';

const nameInput = document.getElementById('nameInput');
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('characterCanvas');
const ctx = canvas.getContext('2d');
const characterList = document.getElementById('characterList');

let currentName = '';
let uploadedImageURL = '';

const sponsors = [
  "Secretive Plotter", "Prisoner of the Golden Headband", "Demon King of Salvation",
  "Abyssal Black Flame Dragon", "The Most Ancient Dream", "The One Who Grips",
  "The Oldest Dream", "Master of Steel", "God of the Sea", "Maritime War God"
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateCharacter() {
  const fullName = nameInput.value.trim();
  const file = imageInput.files[0];
  if (!fullName || !file) {
    alert('Please enter your name and select a photo.');
    return;
  }

  currentName = fullName;

  // Check if user already exists
  const existingQuery = query(collection(db, "characters"), where("name", "==", fullName));
  const querySnapshot = await getDocs(existingQuery);
  if (!querySnapshot.empty) {
    alert("Already Registered! Generating based on your saved character...");
    loadCharacters();
    return;
  }

  // Upload image to Firebase Storage
  const imgRef = ref(storage, `images/${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(imgRef, file);
  const imageURL = await getDownloadURL(snapshot.ref);
  uploadedImageURL = imageURL;

  const orvName = `Constellation of ${fullName.split(' ')[0]}'s Will`;
  const stats = {
    strength: Math.floor(Math.random() * 100),
    agility: Math.floor(Math.random() * 100),
    wisdom: Math.floor(Math.random() * 100),
    luck: Math.floor(Math.random() * 100)
  };
  const sponsor = randomFromArray(sponsors);
  const summary = `The being known as ${orvName} (${fullName}) walks the scenario with the blessing of the ${sponsor}.`;

  // Draw on canvas
  const image = new Image();
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 10, 10, 120, 120);
    ctx.fillStyle = "#0ff";
    ctx.font = "16px Orbitron";
    ctx.fillText(`Name: ${orvName} (${fullName})`, 140, 40);
    ctx.fillText(`Sponsor: ${sponsor}`, 140, 70);
    ctx.fillText(`Stats - STR:${stats.strength} AGI:${stats.agility}`, 140, 100);
    ctx.fillText(`WIS:${stats.wisdom} LUCK:${stats.luck}`, 140, 130);
  };
  image.src = imageURL;

  // Save to Firestore
  await addDoc(collection(db, "characters"), {
    name: fullName,
    orvName,
    stats,
    sponsor,
    summary,
    imageURL
  });

  loadCharacters();
}

function downloadCard() {
  const link = document.createElement('a');
  link.download = "character_card.png";
  link.href = canvas.toDataURL();
  link.click();
}

async function loadCharacters() {
  characterList.innerHTML = '';
  const snapshot = await getDocs(collection(db, "characters"));
  snapshot.forEach(doc => {
    const data = doc.data();
    const isOwner = data.name === currentName;

    const card = document.createElement("div");
    card.className = "character-card" + (isOwner ? "" : " blurred");

    const img = document.createElement("img");
    img.src = data.imageURL;
    img.style.width = "100%";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = isOwner ? `${data.orvName} (${data.name})` : `${data.orvName} (${blurName(data.name)})`;

    const summary = document.createElement("p");
    summary.textContent = isOwner ? data.summary : blurText(data.summary);

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(summary);
    characterList.appendChild(card);
  });
}

function blurName(name) {
  return name[0] + "*".repeat(name.length - 1);
}
function blurText(text) {
  return text.split("").map((c, i) => (i % 2 === 0 ? "*" : c)).join("");
}

loadCharacters();
