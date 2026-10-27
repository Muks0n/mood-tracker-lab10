const moodRecords = [
    { date: "2026-10-05", mood: 5, note: "Хороший день" },
    { date: "2026-10-06", mood: 3, note: "Звичайний день" },
    { date: "2026-10-07", mood: 5, note: "Чудовий настрій" },
    { date: "2026-10-08", mood: 4, note: "Все пройшло непогано" },
    { date: "2026-10-09", mood: 2, note: "Був складний день" },
    { date: "2026-10-10", mood: 5, note: "Приємний день" },
    { date: "2026-10-11", mood: 1, note: "Жахливий день" }
];

// API для практичної роботи №9:
// https://jsonplaceholder.typicode.com/
const API_URL =
    "https://jsonplaceholder.typicode.com/comments?postId=1";

// Перетворює рівень настрою на текст.
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
function calculateMoodSum(records) {
    let sum = 0;

    for (const record of records) {
        sum += record.mood;
    }

    return sum;
}

// Обчислює середній рівень настрою.
function calculateAverageMood(records) {
    if (records.length === 0) {
        return 0;
    }

    const sum = calculateMoodSum(records);

    return sum / records.length;
}

const moodHistory = document.querySelector("#mood-history");
const avgMood = document.querySelector("#avg-mood");

// Створює картки на основі масиву записів.
// Функція використовується для локальних записів і API.
function renderMoodHistory(records, container, fromApi = false) {
    container.innerHTML = "";

    for (const record of records) {
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const description = document.createElement("p");

        card.classList.add("mood-card");

        if (fromApi) {
            title.textContent = record.name;
            description.textContent = record.body;

            const email = document.createElement("p");
            email.textContent = "Email: " + record.email;

            card.classList.add("api-card");
            card.append(title, description, email);
        } else {
            title.textContent = "Дата: " + record.date;

            const moodLabel = moodToLabel(record.mood);

            description.textContent =
                "Настрій: " + moodLabel + ". " + record.note;

            card.dataset.mood = record.mood;

            if (record.mood >= 4) {
                card.classList.add("good");
            } else {
                card.classList.add("hard");
            }

            card.classList.add("mood-card-" + record.mood);

            card.append(title, description);
        }

        container.append(card);
    }
}

// Оновлює середній настрій.
function updateAverageMood(records) {
    if (records.length === 0) {
        avgMood.textContent = "Записів настрою поки немає.";
        return;
    }

    const average = calculateAverageMood(records);

    if (average >= 3.5) {
        avgMood.textContent =
            "Середній настрій: " + average.toFixed(2) +
            " / 5. Гарний тиждень!";
    } else {
        avgMood.textContent =
            "Середній настрій: " + average.toFixed(2) +
            " / 5. Важкий тиждень.";
    }
}

// Відображення локальних записів.
renderMoodHistory(moodRecords, moodHistory);
updateAverageMood(moodRecords);

// Практична робота №8: обробка форми.

const form = document.querySelector("#mood-form");
const dateInput = document.querySelector("#date");
const moodInput = document.querySelector("#mood");
const noteInput = document.querySelector("#note");
const noteCounter = document.querySelector("#note-counter");

// Перевіряє правильність введеного рівня настрою.
moodInput.addEventListener("input", () => {
    const mood = Number(moodInput.value);

    if (moodInput.value !== "" &&
        (!Number.isInteger(mood) || mood < 1 || mood > 5)) {
        moodInput.setCustomValidity(
            "Рівень настрою має бути цілим числом від 1 до 5."
        );
    } else {
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
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const date = dateInput.value;
    const mood = Number(moodInput.value);
    const note = noteInput.value.trim();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const newRecord = {
        date: date,
        mood: mood,
        note: note
    };

    moodRecords.push(newRecord);

    renderMoodHistory(moodRecords, moodHistory);
    updateAverageMood(moodRecords);

    form.reset();

    noteCounter.textContent = "Залишилося символів: 200";
});

// Практична робота №9: отримання даних з API.

const apiHistory = document.querySelector("#api-history");
const refreshButton = document.querySelector("#refresh-button");
const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");

// Показує або приховує стан завантаження.
function showLoading(isLoading) {
    loadingMessage.hidden = !isLoading;
    refreshButton.disabled = isLoading;
}

// Відображає повідомлення про помилку.
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

// Отримує записи з JSONPlaceholder за допомогою Fetch API.
// API: https://jsonplaceholder.typicode.com/comments?postId=1
async function loadData() {
    showLoading(true);

    errorMessage.hidden = true;
    errorMessage.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Сервер відповів кодом " + response.status
            );
        }

        const data = await response.json();

        console.log(data);

        if (!Array.isArray(data)) {
            throw new Error("Некоректний формат даних API");
        }

        renderMoodHistory(data, apiHistory, true);
    } catch (error) {
        showError("Записи тимчасово недоступні");

        console.error(error);
    } finally {
        showLoading(false);
    }
}

// Повторно завантажує записи після натискання кнопки.
refreshButton.addEventListener("click", loadData);

// Завантажує записи під час відкриття сторінки.
loadData();