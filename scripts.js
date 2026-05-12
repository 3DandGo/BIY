let selectedMood = "";
let goodThings = [];

loadHistory();

function selectMood(mood) {
    selectedMood = mood;
    document.getElementById("selectedMood").textContent = mood + "を選びました";

    let allButtons = document.querySelectorAll(".mood-btn");
    allButtons.forEach(btn => {
        btn.classList.remove("selected");
    });

    event.target.classList.add("selected");
}

function addGood() {
    let input = document.getElementById("goodInput");
    let text = input.value;
    if (text === "") return;
    goodThings.push(text);
    input.value = "";
    renderGoodList();
}

function renderGoodList() {
    let list = document.getElementById("goodList");
    list.innerHTML = "";
    goodThings.forEach(item => {
        let li = document.createElement("li");
        li.textContent = "⭐　" + item;
        list.appendChild(li);
    });
}

function saveEntry() {
    let diary = document.getElementById("diaryInput").value;

    let entry = {
        date: new Date().toLocaleDateString("ja-JP"),
        mood: selectedMood,
        goodThings: goodThings,
        diary: diary
    };

    // 今までの記録を取得する
    let allEntries = JSON.parse(localStorage.getItem('biyEntries') || '[]');

    //新しい記録を追加する
    allEntries.push(entry);

    // localStorageに保存する
    localStorage.setItem('biyEntries', JSON.stringify(allEntries));

    alert("今日の記録を保存しました！🌟");
    resetForm();
    loadHistory();
}

function resetForm() {
    selectedMood = "";
    goodThings = [];
    document.getElementById("selectedMood").textContent = "";
    document.getElementById("goodList").innerHTML = "";
    document.getElementById("diaryInput").value = "";
}

function loadHistory() {
    let allEntries = JSON.parse(localStorage.getItem('biyEntries') || '[]');
    let historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    if (allEntries.length === 0) {
        historyList.textContent = "まだ記録がありません";
        return;
    }

    allEntries.reverse().forEach((entry, index) => {
        let card = document.createElement("div");
        card.className = "history-card";

        let goodList = entry.goodThings.map(item => `⭐ ${item}`).join("<br>");

        let realIndex = allEntries.length - 1 - index;

        card.innerHTML = `
            <p class = "history-date">${entry.date}</p>
            <p>気分: ${entry.mood}</p>
            <p>良いこと:<br>${goodList}</p>
            <p>一言：${entry.diary}</p>
            <button class = "delete-btn" onclick = "deleteEntry(${realIndex})">削除</button>
        `;
        historyList.appendChild(card);
    });
}

function deleteEntry(index) {
    let allEntries = JSON.parse(localStorage.getItem('biyEntries') || '[]');
    allEntries.splice(index, 1);
    localStorage.setItem('biyEntries', JSON.stringify(allEntries));
    loadHistory();
}