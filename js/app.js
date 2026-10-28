// Обрано Vue 3, оскільки він підтримує реактивність і 
// компоненти та легко підключається через CDN без 
// додаткового налаштування збірки.


// Практична №9: тестовий API для отримання коментарів.
const API_URL =
    "https://jsonplaceholder.typicode.com/comments?postId=1";

// Практична №10: компонент MoodEntry отримує дані через props.
// Emoji та текстовий підпис обчислюються,
// а не зберігаються в масиві записів.

const MoodEntry = {
    props: {
        date: {
            type: String,
            required: true
        },

        mood: {
            type: Number,
            required: true
        },

        note: {
            type: String,
            default: ""
        }
    },

    computed: {
        moodEmoji() {
            const emoji = {
                1: "😢",
                2: "😔",
                3: "😐",
                4: "🙂",
                5: "😄"
            };

            return emoji[this.mood] || "❔";
        },

        moodLabel() {
            const labels = {
                1: "Дуже сумний",
                2: "Сумний",
                3: "Нейтральний",
                4: "Задовільний",
                5: "Щасливий"
            };

            return labels[this.mood] || "Невідомий";
        }
    },

    template: `
        <article
            class="mood-card"
            :class="[
                'mood-card-' + mood,
                mood >= 4 ? 'good' : 'hard'
            ]"
            :data-mood="mood"
        >
            <h3>
                Дата: {{ date }}
                <span
                    class="mood-emoji"
                    :aria-label="moodLabel"
                >
                    {{ moodEmoji }}
                </span>
            </h3>

            <p>
                Настрій: {{ moodLabel }}. {{ note }}
            </p>
        </article>
    `
};

// Практична №10: створення застосунку Vue.
// Реактивний стан замінює ручне оновлення DOM.

const app = Vue.createApp({
    components: {
        MoodEntry
    },

    data() {
        return {
            moodRecords: [
                {
                    id: 1,
                    date: "2026-10-05",
                    mood: 5,
                    note: "Хороший день"
                },
                {
                    id: 2,
                    date: "2026-10-06",
                    mood: 3,
                    note: "Звичайний день"
                },
                {
                    id: 3,
                    date: "2026-10-07",
                    mood: 5,
                    note: "Чудовий настрій"
                },
                {
                    id: 4,
                    date: "2026-10-08",
                    mood: 4,
                    note: "Все пройшло непогано"
                },
                {
                    id: 5,
                    date: "2026-10-09",
                    mood: 2,
                    note: "Був складний день"
                },
                {
                    id: 6,
                    date: "2026-10-10",
                    mood: 5,
                    note: "Приємний день"
                },
                {
                    id: 7,
                    date: "2026-10-11",
                    mood: 1,
                    note: "Жахливий день"
                }
            ],

            nextId: 8,

            newDate: "",
            newMood: "",
            newNote: "",

            apiRecords: [],
            isLoading: false,
            errorMessage: ""
        };
    },

    computed: {
        // Середній настрій перераховується автоматично
        // після зміни масиву moodRecords.

        averageMood() {
            if (this.moodRecords.length === 0) {
                return 0;
            }

            const sum = this.moodRecords.reduce(
                (total, record) => total + record.mood,
                0
            );

            return sum / this.moodRecords.length;
        }
    },

    methods: {
        // Практична №8: додавання запису настрою.
        // Практична №10: Vue оновлює DOM автоматично.

        addMoodRecord() {
            const mood = Number(this.newMood);

            if (
                !this.newDate ||
                !Number.isInteger(mood) ||
                mood < 1 ||
                mood > 5
            ) {
                return;
            }

            this.moodRecords.push({
                id: this.nextId++,
                date: this.newDate,
                mood: mood,
                note: this.newNote.trim()
            });

            this.newDate = "";
            this.newMood = "";
            this.newNote = "";
        },

        // Практична №9: отримання даних через Fetch API.
        // API: https://jsonplaceholder.typicode.com/comments?postId=1

        async loadData() {
            this.isLoading = true;
            this.errorMessage = "";

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
                    throw new Error(
                        "Некоректний формат даних API"
                    );
                }

                this.apiRecords = data;
            } catch (error) {
                this.errorMessage =
                    "Записи тимчасово недоступні";

                console.error(error);

                // Попередні записи залишаються на сторінці.
            } finally {
                this.isLoading = false;
            }
        }
    },

    // Автоматичне завантаження API після монтування Vue.
    mounted() {
        this.loadData();
    }
});

// Монтування застосунку до елемента #app.
app.mount("#app");
