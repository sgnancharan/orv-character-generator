const sponsors = [
  "Constellation Who Smiles Beneath the Void",
  "Constellation of the Forgotten King",
  "Constellation Who Collects Cringe Moments",
  "Constellation Who Wrote Fanfiction of Reality"
];

const classes = [
  "Narrative Dominator",
  "Fourth Wall Breaker",
  "Shadow Duelist",
  "Reincarnated Meme Lord"
];

const titles = [
  "The Unwritten Hero",
  "Edgewalker of Time",
  "Script-Eater",
  "Plot Armor Embodiment"
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateStats() {
  return {
    Strength: Math.floor(Math.random() * 100) + 100,
    Agility: Math.floor(Math.random() * 100) + 100,
    Intelligence: Math.floor(Math.random() * 100) + 100,
    Charisma: Math.floor(Math.random() * 100) + 100
  };
}

function previewPhoto() {
  const file = document.getElementById("photo").files[0];
  const preview = document.getElementById("preview");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
}

document.getElementById("photo").addEventListener("change", previewPhoto);

document.getElementById("generate").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const file = document.getElementById("photo").files[0];
  if (!name || !file) return alert("Please enter name and upload a photo.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const image = new Image();
    image.onload = function () {
      const canvas = document.getElementById("card");
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw uploaded photo (resized)
      const imgW = 100;
      const imgH = 100;
      ctx.drawImage(image, 470, 20, imgW, imgH);

      // Generate character details
      const character = {
        name,
        title: getRandom(titles),
        class: getRandom(classes),
        sponsor: getRandom(sponsors),
        stats: generateStats()
      };

      // Text styles
      ctx.fillStyle = "#FFD700";
      ctx.font = "20px Arial";
      ctx.fillText(`Character: ${character.name}`, 20, 30);

      ctx.fillStyle = "#ffffff";
      ctx.font = "16px Arial";
      ctx.fillText(`Title: ${character.title}`, 20, 60);
      ctx.fillText(`Class: ${character.class}`, 20, 90);
      ctx.fillText(`Sponsor: ${character.sponsor}`, 20, 120);

      // Stats
      let y = 160;
      for (const [key, val] of Object.entries(character.stats)) {
        ctx.fillText(`${key}: ${val}`, 20, y);
        y += 30;
      }

      // Show download button
      document.getElementById("download").style.display = "inline-block";
    };
    image.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("download").addEventListener("click", () => {
  const canvas = document.getElementById("card");
  html2canvas(canvas).then(canvas => {
    const link = document.createElement("a");
    link.download = "ORV_Character_Card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
