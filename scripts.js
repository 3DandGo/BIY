let selectedMood = "";
let goodThings = [];

function selectMood(mood) {
    selectedMood = mood;
    document.getElementById("selectedMood").textContent = mood + "を選びました";
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
}

function resetForm() {
    selectedMood = "";
    goodThings = [];
    document.getElementById("selectedMood").textContent = "";
    document.getElementById("goodList").innerHTML = "";
    document.getElementById("diaryInput").value = "";
}