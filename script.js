
function generateCharacter() {
  const name = document.getElementById('nameInput').value;
  const imageFile = document.getElementById('imageInput').files[0];
  const canvas = document.getElementById('characterCanvas');
  const ctx = canvas.getContext('2d');

  const orvName = generateORVName(name);
  const stats = { STR: rand(10, 100), INT: rand(10, 100), DEX: rand(10, 100), LUK: rand(10, 100) };
  const sponsor = getRandomSponsor();
  const summary = `An incarnation named ${orvName} (${name}) has entered the scenario under the patronage of ${sponsor}. Their stats glow with potential.`;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0ff';
  ctx.font = '20px Orbitron';
  ctx.fillText(`Name: ${orvName} (${name})`, 20, 40);
  ctx.fillText(`Sponsor: ${sponsor}`, 20, 80);
  ctx.fillText(`Stats: STR ${stats.STR}, INT ${stats.INT},`, 20, 120);
  ctx.fillText(`DEX ${stats.DEX}, LUK ${stats.LUK}`, 20, 150);
  ctx.font = '16px Orbitron';
  ctx.fillText(summary.slice(0, 60), 20, 200);
  ctx.fillText(summary.slice(60), 20, 230);

  if (imageFile) {
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 350, 40, 200, 200);
    };
    img.src = URL.createObjectURL(imageFile);
  }
}

function generateORVName(name) {
  const titles = ["Sword Saint", "Shadow Monarch", "Warden of Reality", "Dimensional Slayer", "Hidden Fable"];
  return `${titles[Math.floor(Math.random() * titles.length)]} ${name}`;
}

function getRandomSponsor() {
  const sponsors = ["Secretive Plotter", "Prisoner of the Golden Headband", "Demon King of Salvation", "Abyssal Black Flame Dragon"];
  return sponsors[Math.floor(Math.random() * sponsors.length)];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function downloadCard() {
  const canvas = document.getElementById('characterCanvas');
  const link = document.createElement('a');
  link.download = 'orv_character.png';
  link.href = canvas.toDataURL();
  link.click();
}
