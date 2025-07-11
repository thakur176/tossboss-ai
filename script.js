  function shuffleArray(array) {
    return array
      .map(item => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  function updateSerials(textareaId) {
    const textarea = document.getElementById(textareaId);
    const lines = textarea.value.split("\n");
    let formatted = lines.map((line, idx) => {
      const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
      return cleanLine ? `${idx + 1}. ${cleanLine}` : '';
    });
    textarea.value = formatted.filter(Boolean).join("\n");
  }

  document.getElementById("names").addEventListener("blur", () => updateSerials("names"));
  document.getElementById("items").addEventListener("blur", () => updateSerials("items"));

  document.getElementById("toss-btn").addEventListener("click", () => {
    gtag('event', 'toss_clicked', {
      event_category: 'Interaction',
      event_label: 'Toss Now button'
    });

    const namesInput = document.getElementById("names").value.trim();
    const itemsInput = document.getElementById("items").value.trim();
    const names = namesInput.split("\n").map(n => n.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    const items = itemsInput.split("\n").map(i => i.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);

    const resultBox = document.getElementById("result");
    const thinkingMsg = resultBox.querySelector(".thinking");

    if (names.length === 0 || items.length === 0) {
      thinkingMsg.innerHTML = "🚫 Please enter both columns to proceed.";
      return;
    }

    if (names.length !== items.length) {
      thinkingMsg.innerHTML = `⚠️ You entered <strong>${names.length}</strong> in Column 1 and <strong>${items.length}</strong> in Column 2.`;
      return;
    }

    document.getElementById("sound-toss").play();
    thinkingMsg.innerHTML = "🤖 TossBoss AI is thinking...";

    setTimeout(() => {
      const shuffledItems = shuffleArray(items);
      let outputHTML = "";

      for (let i = 0; i < names.length; i++) {
        outputHTML += `
          <div class="match-row celebration">
            <span class="match-name">${i + 1}. ${names[i]}</span>
            <span class="match-icon">→</span>
            <span class="match-item">${shuffledItems[i]}</span>
          </div>`;
      }

      thinkingMsg.innerHTML = outputHTML;

      // 🎆 Celebration spark animation using CSS class
      resultBox.classList.add("sparkle-effect");
      document.getElementById("sound-fireworks").play();

      // ✅ Add smooth scroll to result
      document.getElementById("result-section").scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        resultBox.classList.remove("sparkle-effect");
      }, 4000);

    }, 1200);
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    document.getElementById("names").value = "";
    document.getElementById("items").value = "";
    document.getElementById("result").querySelector(".thinking").innerHTML = "🤖 TossBoss AI is ready!";
    document.getElementById("sound-reset").play();
  });

  // Download Image Button
  document.getElementById('downloadImageBtn').addEventListener('click', () => {
    gtag('event', 'download_image_clicked', {
      event_category: 'Sharing',
      event_label: 'Download Result Image'
    });

    const resultSection = document.getElementById('result');

    const wrapper = document.createElement('div');
    wrapper.style.padding = "20px";
    wrapper.style.background = "#0a0a0a";
    wrapper.style.color = "#fff";
    wrapper.style.fontFamily = "'Poppins', sans-serif";
    wrapper.innerHTML = `
      <div style="text-align:center; font-size: 1.5rem; margin-bottom: 10px;">
        🤖 TOSSBOSS AI
      </div>
      <div style="text-align:center; font-style:italic; margin-bottom: 20px;">
        Don’t be troubled! Let TossBoss AI decide the best for you — 🤩 free & fast!
      </div>
      ${resultSection.innerHTML}
      <div style="text-align:center; font-size: 1rem; margin-top: 20px;">
        🎯 For players, outfits, food, studies & fun!<br/>
        🔗 Try now: https://tossboss-ai.netlify.app/
      </div>
    `;

    document.body.appendChild(wrapper);

    html2canvas(wrapper).then(canvas => {
      const link = document.createElement('a');
      link.download = 'TossBoss_Result.png';
      link.href = canvas.toDataURL();
      link.click();
      document.body.removeChild(wrapper);
      // ✅ Add this message for user guidance
      alert("✅ Image saved! Now open WhatsApp and share this image with your friends!");
    });
  });

  // WhatsApp Share (Just Promoting Text, Not Image)
  document.getElementById('whatsappShareBtn').addEventListener('click', () => {
    gtag('event', 'whatsapp_share_clicked', {
      event_category: 'Sharing',
      event_label: 'WhatsApp Share'
    });
    const message = encodeURIComponent(`
  *TOSSBOSS AI*
  Don’t be troubled! Let TossBoss AI think and decide the best match for you — free & fast!

  *Use for:*
  • Games (rank randomizer)
  • Food Planning
  • Outfit Selector
  • Study Topics 
  • Any Fun or Decision Tasks

  Check my toss result and try it now https://tossboss-ai.netlify.app/
  `);

    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  });

  function loadPreset(type) {
    gtag('event', 'preset_clicked', {
      event_category: 'Preset',
      event_label: type   // e.g., 'play', 'meal', 'dress'
    });
    let names = "", items = "";

    switch (type) {
      case 'play':
        names = "1. Alice\n2. Bob\n3. Charlie\n4. Diana";
        items = "1. 1st\n2. 2nd\n3. 3rd\n4. 4th";
        break;
      case 'dress':
        names = "1. Office\n2. Party\n3. Gym\n4. Date";
        items = "1. Shirt & Jeans\n2. Blazer & Denim\n3. Tracksuit\n4. Casual Tee";
        break;
      case 'meal':
        names = "1. Breakfast\n2. Lunch\n3. Dinner\n4. Snack";
        items = "1. Oats\n2. Rice & Dal\n3. Pasta\n4. Nuts";
        break;
      case 'study':
        names = "1. Monday\n2. Tuesday\n3. Wednesday\n4. Thursday";
        items = "1. Math\n2. Science\n3. History\n4. CS";
        break;
      case 'rank':
        names = "1. Player A\n2. Player B\n3. Player C\n4. Player D";
        items = "1. Rank 1\n2. Rank 2\n3. Rank 3\n4. Rank 4";
        break;
    }

    document.getElementById("names").value = names;
    document.getElementById("items").value = items;
    document.getElementById("result").querySelector(".thinking").innerHTML = "🤖 Preset loaded! Click 'Toss Now' to match.";
  }

    document.addEventListener("DOMContentLoaded", function () {
    showRandomSlogan();
  });


