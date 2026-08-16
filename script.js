function update() {
    const want = parseFloat(document.getElementById("want").value);
    const offer = parseFloat(document.getElementById("offer").value);
    const items = parseFloat(document.getElementById("items").value);
    const slider = parseInt(document.getElementById("ratioSlider").value);

    if (isNaN(want) || isNaN(offer) || isNaN(items)) {
        document.getElementById("output").innerHTML = "Invalid input.";
        return;
    }

    const multiplier = 1 + slider / 100;

    const wantMod = want * multiplier;
    const offerMod = offer * multiplier;

    document.getElementById("wantModified").innerText = wantMod.toFixed(3);
    document.getElementById("offerModified").innerText = offerMod.toFixed(3);

    function toWhole(a, b) {
        const aDec = (a.toString().split(".")[1] || "").length;
        const bDec = (b.toString().split(".")[1] || "").length;
        const scale = Math.pow(10, Math.max(aDec, bDec));
        return [a * scale, b * scale];
    }

    let [w, o] = toWhole(wantMod, offerMod);

    const maxBlocks = Math.floor(items / o);

    if (maxBlocks < 1) {
        document.getElementById("output").innerHTML = "Not enough items for even one trade block.";
        return;
    }

    const lowest = [o, w];
    const middle = [o * Math.floor(maxBlocks / 2), w * Math.floor(maxBlocks / 2)];
    const highest = [o * maxBlocks, w * maxBlocks];
    const remainder = items - highest[0];

    document.getElementById("output").innerHTML = `
      <b>Closest whole-number ratio:</b> ${w} : ${o}<br><br>

      <b>Lowest trade:</b> ${lowest[0]} : ${lowest[1]}<br>
      <b>Middle trade:</b> ${middle[0]} : ${middle[1]}<br>
      <b>Highest trade:</b> ${highest[0]} : ${highest[1]}<br>
      <b>Remainder:</b> ${remainder}
    `;
}

document.querySelectorAll("input").forEach(el => {
    el.addEventListener("input", update);
});

update();
