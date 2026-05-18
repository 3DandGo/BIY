let selectedMood = "";
let goodThings = [];
let currentIndex = 0;
let moodChart = null;

window.onload = function() {
loadHistory();
renderChart();
}

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

    if (selectedMood === "") {
        alert("気分を選んでください！");
        return;
    }
    if (goodThings.length === 0) {
        alert("良いことを1つ以上追加してください！");
        return;
    }
    if (diary === "") {
        alert("一言を入力してください！");
        return;
    }

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

    let message = getEncouragementMessage(selectedMood);
    alert("今日の記録を保存しました！🌟\n\n" + message);
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
    let counter = document.getElementById("carouselCounter");
    historyList.innerHTML = "";

    if (allEntries.length === 0) {
        historyList.textContent = "まだ記録がありません";
        counter.textContent = "";
        return;
    }

        
        let reversedEntries = [...allEntries].reverse();
        let entry = reversedEntries[currentIndex]

        let goodList = entry.goodThings.map(item => `⭐ ${item}`).join("<br>");
        let realIndex = allEntries.length - 1 - currentIndex;

        let card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
            <p class = "history-date">${entry.date}</p>
            <p>気分: ${entry.mood}</p>
            <p>良いこと:<br>${goodList}</p>
            <p>一言：${entry.diary}</p>
            <button class = "delete-btn" onclick = "deleteEntry(${realIndex})">削除</button>
        `;
        historyList.appendChild(card);
        counter.textContent = `${currentIndex + 1} / ${allEntries.length}`;

        renderChart();
}

function prevEntry() {
    let allEntries = JSON.parse(localStorage.getItem('biyEntries') || '[]');
    if (currentIndex > 0) {
        currentIndex--;
        loadHistory();
    }
}

function nextEntry() {
    let allEntries = JSON.parse(localStorage.getItem('biyEntries') || '[]');
    if (currentIndex < allEntries.length - 1) {
        currentIndex++;
        loadHistory();
    }
}

function deleteEntry(index) {
    let allEntries = JSON.parse(localStorage.getItem('biyEntries') || '[]');
    allEntries.splice(index, 1);
    localStorage.setItem('biyEntries', JSON.stringify(allEntries));
    loadHistory();
}

function renderChart() {
    let allEntries = JSON.parse(localStorage.getItem('biyEntries') || '[]');

    let moodCount = {
        "最高": 0,
        "良い": 0,
        "普通": 0,
        "良くない": 0,
        "最悪": 0
    };

    allEntries.forEach(entry => {
        if (moodCount[entry.mood] !== undefined) {
            moodCount[entry.mood]++;
        }
    });

    let labels = Object.keys(moodCount);
    let data = Object.values(moodCount);

    if (moodChart !== null) {
        moodChart.destroy();
    }

    let ctx = document.getElementById('moodChart').getContext('2d');
    moodChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "#534AB7",
                    "#1D9E75",
                    "#FAC775",
                    "#F5C4B3",
                    "#D85A30"
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

function getEncouragementMessage(mood) {
    let messages = {
         "最高": [
            "素晴らしい！その調子で！🌟",
            "最高の一日ですね！この気持ちを大切に！✨",
            "あなたは輝いています！😄"
        ],
        "良い": [
            "良い一日でしたね！明日も楽しみ！😊",
            "その笑顔を忘れずに！🌸",
            "良い気分は周りにも伝わりますよ！"
        ],
        "普通": [
            "普通の日も大切な一日です！💪",
            "今日も一日お疲れ様でした！",
            "明日はもっと良い日になりますよ！🌈"
        ],
        "良くない": [
            "今日は大変でしたね。でも乗り越えました！💪",
            "辛い日もあります。自分を責めないで！🌸",
            "明日は必ず良くなります。今日もお疲れ様！"
        ],
        "最悪": [
            "本当に大変でしたね。よく頑張りました！🌟",
            "どんな底にも終わりがあります。あなたは強い！💪",
            "今日の自分を褒めてあげてください。生きてるだけで十分！🌈"
        ]
    };

    let moodMessages = messages[mood];
    let randomIndex = Math.floor(Math.random() * moodMessages.length);
    return moodMessages[randomIndex];
}