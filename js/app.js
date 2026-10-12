console.log("app.js підключено");

// Записи настрою за сім днів.
const moodRecords = [
    { date: "2026-10-05", mood: 5, note: "Хороший день" },
    { date: "2026-10-06", mood: 3, note: "Звичайний день" },
    { date: "2026-10-07", mood: 5, note: "Чудовий настрій" },
    { date: "2026-10-08", mood: 4, note: "Все пройшло не погано" },
    { date: "2026-10-09", mood: 2, note: "Був складний день" },
    { date: "2026-10-10", mood: 5, note: "Приємний день" },
    { date: "2026-10-11", mood: 1, note: "Жахливий день" }
];

// Знаходимо контейнер для карток і елемент підсумку.
const moodHistory = document.querySelector("#mood-history");
const avgMood = document.querySelector("#avg-mood");

// Видаляємо статичну картку з попередньої лабораторної.
const oldCard = moodHistory.querySelector(".mood-card");

if (oldCard !== null) 
{
    oldCard.remove();
}

// Повертає текстову назву рівня настрою.
const moodToLabel = mood => {
    const labels = [
        "Дуже сумний",
        "Сумний",
        "Нейтральний",
        "Задовільний",
        "Щасливий"
    ];

    return labels[mood - 1] || "Невідомий рівень";
};

// Підраховує суму всіх рівнів настрою.
function calculateMoodSum(records) {
    let sum = 0;

    for (let i = 0; i < records.length; i++) 
    {
        sum += records[i].mood;
    }

    return sum;
}

// Обчислює середній рівень настрою.
function calculateAverageMood(records) {
    if (records.length === 0) 
    {
        return 0;
    }

    const sum = calculateMoodSum(records);
    const average = sum / records.length;

    return average;
}

// Створює картки настрою на основі масиву записів.
function renderMoodHistory(records) {
    moodHistory.innerHTML = "";

    for (const record of records) 
    {
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const description = document.createElement("p");

        // Додаємо основний клас картки.
        card.classList.add("mood-card");

        // Установлюємо атрибут data-mood.
        card.dataset.mood = record.mood;

        // Заповнюємо елементи текстом.
        title.textContent = "Дата: " + record.date;

        description.textContent =
            "Настрій: " + moodToLabel(record.mood) +
            ". " + record.note;

        // Додаємо клас відповідно до рівня настрою.
        if (record.mood >= 4) 
        {
            card.classList.add("good");
        } 
        else 
        {
            card.classList.add("hard");
        }

        // Додаємо клас кольору відповідного настрою.
        card.classList.add("mood-card-" + record.mood);

        // Додаємо заголовок та опис у картку.
        card.append(title, description);

        // Додаємо готову картку до контейнера.
        moodHistory.append(card);
    }
}
// Оновлює короткий підсумок на сторінці.
function updateAverageMood(records) {
    if (records.length === 0) 
    {
        avgMood.textContent = "Записів настрою поки немає.";
        return;
    }

    const average = calculateAverageMood(records);

    if (average >= 3.5) 
    {
        avgMood.textContent = "Середній настрій: " + average.toFixed(2) +
            " / 5. Гарний тиждень!";
    } 
    else 
    {
        avgMood.textContent = "Середній настрій: " + average.toFixed(2) +
            " / 5. Важкий тиждень.";
    }
}

// Виводимо картки та оновлюємо підсумок.
renderMoodHistory(moodRecords);
updateAverageMood(moodRecords);
