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
    console.log("保存しました：", entry);
    alert("今日の記録を保存しました！🌟");
}