console.log("app.js підключено");

// Записи настрою за сім днів.
// Рівень настрою: 1 — дуже сумний, 5 — щасливий.
const moodRecords = [
    { date: "2026-10-05", mood: 4 },
    { date: "2026-10-06", mood: 3 },
    { date: "2026-10-07", mood: 5 },
    { date: "2026-10-08", mood: 4 },
    { date: "2026-10-09", mood: 2 },
    { date: "2026-10-10", mood: 4 },
    { date: "2026-10-11", mood: 5 }
];

// Повертає текстову назву рівня настрою за числом від 1 до 5.
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

// Підраховує суму рівнів настрою за допомогою циклу for.
function calculateMoodSum(records) {
    let sum = 0;

    for (let i = 0; i < records.length; i++) 
    {
        sum += records[i].mood;
    }

    return sum;
}

// Обчислює середній рівень настрою та визначає підсумок тижня.
function calculateAverageMood(records) {
    if (records.length === 0) 
    {
        console.log("Немає записів для обчислення середнього.");
        return 0;
    }

    const sum = calculateMoodSum(records);
    const average = sum / records.length;

    console.log("Кількість записів: " + records.length);
    console.log("Сума рівнів настрою: " + sum);
    console.log("Середній настрій: " + average.toFixed(2));

    if (average >= 3.5) 
    {
        console.log("Підсумок: гарний тиждень");
    } 
    else 
    {
        console.log("Підсумок: важкий тиждень");
    }

    return average;
}

//  Обчислюємо середній настрій за період.
calculateAverageMood(moodRecords);

// Перевіряємо роботу стрілкової функції.
console.log("Рівень настрою 5:", moodToLabel(5));