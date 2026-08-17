let lastGoodOutput = "";
let lastValidWantWhole = null;
let lastValidOfferWhole = null;

// Save values to localStorage
function saveState() {
    localStorage.setItem("want", document.getElementById("want").value);
    localStorage.setItem("offer", document.getElementById("offer").value);
    localStorage.setItem("items", document.getElementById("items").value);

    const inc = document.querySelector("input[name='inc']:checked").value;
    localStorage.setItem("increment", inc);
}

// Load values from localStorage
function loadState() {
    const want = localStorage.getItem("want");
    const offer = localStorage.getItem("offer");
    const items = localStorage.getItem("items");
    const increment = localStorage.getItem("increment");

    if (want !== null) document.getElementById("want").value = want;
    if (offer !== null) document.getElementById("offer").value = offer;
    if (items !== null) document.getElementById("items").value = items;

    const defaultInc = increment || "0.1";
    const radio = document.querySelector(`input[name='inc'][value='${defaultInc}']`);
    if (radio) radio.checked = true;
}

// Convert decimal ratio to whole numbers (unreduced)
function toWholeNumbers(wantMod, offerMod) {
    const wantDec = (wantMod.toString().split('.')[1] || "").length;
    const offerDec = (offerMod.toString().split('.')[1] || "").length;
    const scale = Math.pow(10, Math.max(wantDec, offerDec));

    return [
        Math.round(wantMod * scale),
        Math.round(offerMod * scale)
    ];
}

function canTrade(wantWhole, offerWhole, items) {
    return Math.floor(items / offerWhole) >= 1;
}

function update() {
    saveState();

    const wantEl = document.getElementById("want");
    const offerEl = document.getElementById("offer");
    const itemsEl = document.getElementById("items");

    const want = parseFloat(wantEl.value);
    const offer = parseFloat(offerEl.value);
    const items = parseFloat(itemsEl.value);

    const [wantWhole, offerWhole] = toWholeNumbers(want, offer);
    const maxBlocks = Math.floor(items / offerWhole);

    if (maxBlocks < 1) {
        const minItemsNeeded = offerWhole;

        document.getElementById("output").innerHTML = `
            <div class="error-box">
                Not enough items to get this ratio (at least ${minItemsNeeded} needed).
            </div>

            ${lastValidWantWhole !== null ? `
            <div class="fallback-info">
                Showing closest valid ratio instead:<br>
                <b>${lastValidWantWhole} : ${lastValidOfferWhole}</b>
            </div>
            ` : ""}

            ${lastGoodOutput}
        `;
        return;
    }

    lastValidWantWhole = wantWhole;
    lastValidOfferWhole = offerWhole;

    const minBlocks = 1;
    const halfBlocks = Math.floor(maxBlocks / 2);

    const minOffer = offerWhole * minBlocks;
    const minWant = wantWhole * minBlocks;

    const halfOffer = offerWhole * halfBlocks;
    const halfWant = wantWhole * halfBlocks;

    const maxOffer = offerWhole * maxBlocks;
    const maxWant = wantWhole * maxBlocks;

    const minRem = items - minOffer;
    const halfRem = items - halfOffer;
    const maxRem = items - maxOffer;

    lastGoodOutput = `
      <div class="trade-grid">
        <div class="trade-box">
          <div class="trade-title">Minimum</div>
          <div class="trade-value">${minWant} : ${minOffer}</div>
          <div class="trade-rem">Remainder: ${minRem}</div>
        </div>

        <div class="trade-box">
          <div class="trade-title">Half</div>
          <div class="trade-value">${halfWant} : ${halfOffer}</div>
          <div class="trade-rem">Remainder: ${halfRem}</div>
        </div>

        <div class="trade-box">
          <div class="trade-title">Maximum</div>
          <div class="trade-value">${maxWant} : ${maxOffer}</div>
          <div class="trade-rem">Remainder: ${maxRem}</div>
        </div>
      </div>
    `;

    document.getElementById("output").innerHTML = lastGoodOutput;
}

function init() {
    loadState();

    const wantEl = document.getElementById("want");
    const offerEl = document.getElementById("offer");

    const wantUp = document.getElementById("wantUp");
    const wantDown = document.getElementById("wantDown");
    const offerUp = document.getElementById("offerUp");
    const offerDown = document.getElementById("offerDown");

    const gear = document.getElementById("optionsGear");
    const modal = document.getElementById("optionsModal");

    gear.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    function getIncrement() {
        return parseFloat(document.querySelector("input[name='inc']:checked").value);
    }

    wantUp.addEventListener("click", () => {
        wantEl.value = (parseFloat(wantEl.value) + getIncrement()).toFixed(2);
        offerEl.value = 1;
        update();
    });

    wantDown.addEventListener("click", () => {
        wantEl.value = (parseFloat(wantEl.value) - getIncrement()).toFixed(2);
        offerEl.value = 1;
        update();
    });

    offerUp.addEventListener("click", () => {
        offerEl.value = (parseFloat(offerEl.value) + getIncrement()).toFixed(2);
        wantEl.value = 1;
        update();
    });

    offerDown.addEventListener("click", () => {
        offerEl.value = (parseFloat(offerEl.value) - getIncrement()).toFixed(2);
        wantEl.value = 1;
        update();
    });

    wantEl.addEventListener("input", () => {
        offerEl.value = 1;
        update();
    });

    offerEl.addEventListener("input", () => {
        wantEl.value = 1;
        update();
    });

    document.getElementById("items").addEventListener("input", update);
    document.querySelectorAll("input[name='inc']").forEach(r => {
        r.addEventListener("change", update);
    });

    update();
}

init();
