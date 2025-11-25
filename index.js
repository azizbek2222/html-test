// index.js

// Balans yuklash
function loadBalance() {
    db.ref("users/" + device + "/balance").on("value", snap => {
        let bal = snap.val() || 0;
        document.getElementById("balance").innerText =
            "Balans: " + bal.toFixed(3) + " $";
    });
}
loadBalance();

// AdsGram reklama
async function showAd() {
    return new Promise((resolve) => {
        const AdController = window.Adsgram.init({ blockId: "int-18178" });
        AdController.show()
            .then(() => resolve(true))
            .catch(() => resolve(false));
    });
}

// 15 minut uchish
let isFlying = false;
let flyTime = 15 * 60;
let flyInterval = null;

function startFly() {
    if (isFlying) return;
    isFlying = true;

    let time = flyTime;
    document.getElementById("timer").innerText = "Raketa uchdi!";

    flyInterval = setInterval(() => {
        let m = Math.floor(time / 60);
        let s = time % 60;
        document.getElementById("timer").innerText =
            `${m}:${s < 10 ? "0" + s : s}`;
        time--;

        if (time < 0) {
            clearInterval(flyInterval);
            isFlying = false;
            document.getElementById("timer").innerText = "Uchish tugadi";

            // Balans +0.005$
            db.ref("users/" + device + "/balance").transaction(b => {
                return (b || 0) + 0.005;
            });
        }
    }, 1000);
}

// Tugmalar
async function getFuel() {
    let ok = await showAd();
    if (!ok) return;
    if (!isFlying) startFly();
}

async function getShield() {
    let ok = await showAd();
    if (!ok) return;
    if (!isFlying) startFly();
}
