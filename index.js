// Boshlang'ich qiymatlar localStorage'dan o'qiladi yoki default
let adCount = parseInt(localStorage.getItem("adCount") || "0");
let isFlying = localStorage.getItem("isFlying") === "true";
let remainingTime = parseInt(localStorage.getItem("remainingTime") || 15*60);
let balance = parseFloat(localStorage.getItem("balance") || 0);

const balanceEl = document.getElementById("balance");
const adCountEl = document.getElementById("adCount");
const timerEl = document.getElementById("timer");
const rocketEl = document.getElementById("rocket");
const launchButton = document.getElementById("launchButton");

// Ekranga balans va reklama sonini chiqarish
function updateUI() {
    balanceEl.innerText = "Balans: " + balance.toFixed(3) + " $";
    adCountEl.innerText = `${adCount}/2`;
}
updateUI();

// AdsGram reklama funksiyasi
async function showAd() {
    return new Promise(resolve => {
        if (!window.Adsgram) {
            alert("AdsGram SDK yuklanmagan!");
            resolve(false);
            return;
        }

        const AdController = window.Adsgram.init({ blockId: "int-18178" });
        AdController.show()
            .then(result => {
                console.log("AdsGram result:", result);
                resolve(result.done && !result.error);
            })
            .catch(err => {
                console.error("AdsGram error:", err);
                resolve(false);
            });
    });
}

// Tugma bosilganda
async function handleLaunchButton() {
    if (isFlying) return;

    let ok = await showAd();
    if (!ok) return;

    adCount++;
    localStorage.setItem("adCount", adCount);
    updateUI();

    if (adCount >= 2) startFly(remainingTime);
}

// Raketa ishga tushishi
let flyInterval = null;
function startFly(time = 15*60) {
    if (isFlying) return;

    isFlying = true;
    localStorage.setItem("isFlying", "true");
    remainingTime = time;
    adCount = 0;
    localStorage.setItem("adCount", adCount);
    updateUI();

    timerEl.innerText = "Raketa ishga tushdi!";

    let direction = 1;
    flyInterval = setInterval(() => {
        rocketEl.style.transform = `translateY(${direction * -10}px)`;
        direction *= -1;

        let m = Math.floor(remainingTime / 60);
        let s = remainingTime % 60;
        timerEl.innerText = `${m}:${s < 10 ? "0"+s : s}`;

        // Balans progressiv qo'shish
        balance += 0.005/(15*60);
        localStorage.setItem("balance", balance);
        updateUI();

        remainingTime--;
        localStorage.setItem("remainingTime", remainingTime);

        if (remainingTime < 0) {
            clearInterval(flyInterval);
            isFlying = false;
            localStorage.setItem("isFlying", "false");
            remainingTime = 15*60;
            localStorage.setItem("remainingTime", remainingTime);
            timerEl.innerText = "Uchish tugadi";
            rocketEl.style.transform = "translateY(0)";
        }
    }, 1000);
}

// Agar ilova qayta ochilsa raketa davom etsin
if (isFlying && remainingTime > 0) {
    startFly(remainingTime);
}

// Tugmani event bilan boglash
launchButton.addEventListener("click", handleLaunchButton);