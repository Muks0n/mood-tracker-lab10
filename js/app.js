
const moodRecords = [
    { date: "2026-10-05", mood: 5, note: "Хороший день" },
    { date: "2026-10-06", mood: 3, note: "Звичайний день" },
    { date: "2026-10-07", mood: 5, note: "Чудовий настрій" },
    { date: "2026-10-08", mood: 4, note: "Все пройшло непогано" },
    { date: "2026-10-09", mood: 2, note: "Був складний день" },
    { date: "2026-10-10", mood: 5, note: "Приємний день" },
    { date: "2026-10-11", mood: 1, note: "Жахливий день" }
];

// Перетворює числовий рівень настрою на текст.
const moodToLabel = (mood) => {
    switch (mood) {
        case 1:
            return "Дуже сумний";
        case 2:
            return "Сумний";
        case 3:
            return "Нейтральний";
        case 4:
            return "Задовільний";
        case 5:
            return "Щасливий";
        default:
            return "Невідомий";
    }
};

// Обчислює суму рівнів настрою.
function calculateMoodSum(records) 
{
    let sum = 0;

    for (const record of records) 
    {
        sum += record.mood;
    }

    return sum;
}

// Обчислює середній рівень настрою.
function calculateAverageMood(records) 
{
    if (records.length === 0) 
    {
        return 0;
    }

    const sum = calculateMoodSum(records);

    return sum / records.length;
}

// Знаходимо необхідні HTML-елементи.
const moodHistory = document.querySelector("#mood-history");
const avgMood = document.querySelector("#avg-mood");

// Видаляємо статичну картку.
const oldCard = moodHistory.querySelector(".mood-card");

if (oldCard !== null) 
{
    oldCard.remove();
}

// Створює картки настрою на основі масиву записів.
function renderMoodHistory(records) 
{
    moodHistory.innerHTML = "";

    for (const record of records) 
    {
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const description = document.createElement("p");

        title.textContent = "Дата: " + record.date;

        const moodLabel = moodToLabel(record.mood);

        description.textContent =
            "Настрій: " + moodLabel + ". " + record.note;

        card.classList.add("mood-card");
        card.dataset.mood = record.mood;

        if (moodLabel === "Задовільний" ||
            moodLabel === "Щасливий") 
        {
            card.classList.add("good");
        } 
        else 
        {
            card.classList.add("hard");
        }

        card.classList.add("mood-card-" + record.mood);

        card.append(title, description);
        moodHistory.append(card);
    }
}

// Оновлює середній настрій та підсумок тижня.
function updateAverageMood(records) 
{
    if (records.length === 0) 
    {
        avgMood.textContent = "Записів настрою поки немає.";
        return;
    }

    const average = calculateAverageMood(records);

    if (average >= 3.5) 
    {
        avgMood.textContent =
            "Середній настрій: " + average.toFixed(2) +
            " / 5. Гарний тиждень!";
    } 
    else 
    {
        avgMood.textContent =
            "Середній настрій: " + average.toFixed(2) +
            " / 5. Важкий тиждень.";
    }
}

// Відображаємо початкові записи.
renderMoodHistory(moodRecords);
updateAverageMood(moodRecords);

// Знаходимо форму та її поля.
const form = document.querySelector("#mood-form");
const dateInput = document.querySelector("#date");
const moodInput = document.querySelector("#mood");
const noteInput = document.querySelector("#note");
const noteCounter = document.querySelector("#note-counter");

// Перевіряє правильність введеного рівня настрою.
moodInput.addEventListener("input", () => {
    const mood = Number(moodInput.value);

    if (moodInput.value !== "" &&
        (!Number.isInteger(mood) || mood < 1 || mood > 5)) 
    {
        moodInput.setCustomValidity
        (
            "Рівень настрою має бути цілим числом від 1 до 5."
        );
    } 
    else 
    {
        moodInput.setCustomValidity("");
    }
});

// Оновлює лічильник символів примітки.
noteInput.addEventListener("input", () => {
    const remaining = 200 - noteInput.value.length;

    noteCounter.textContent =
        "Залишилося символів: " + remaining;
});

// Обробляє надсилання форми.
form.addEventListener("submit", (event) => 
{
    event.preventDefault();

    const date = dateInput.value;
    const mood = Number(moodInput.value);
    const note = noteInput.value.trim();

    if (!form.checkValidity()) 
    {
        form.reportValidity();
        return;
    }

    const newRecord = 
    {
        date: date,
        mood: mood,
        note: note
    };

    moodRecords.push(newRecord);

    renderMoodHistory(moodRecords);
    updateAverageMood(moodRecords);

    form.reset();

    noteCounter.textContent = "Залишилося символів: 200";
});
