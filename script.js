function calculate() {
    const want = parseFloat(document.getElementById("want").value);
    const offer = parseFloat(document.getElementById("offer").value);
    const items = parseFloat(document.getElementById("items").value);

    // Error checking
    if (isNaN(want) || want <= 0) {
        document.getElementById("output").innerHTML = "Error: 'I WANT' must be a positive number.";
        return;
    }
    if (isNaN(offer) || offer <= 0) {
        document.getElementById("output").innerHTML = "Error: 'I HAVE' must be a positive number.";
        return;
    }
    if (isNaN(items) || items <= 0) {
        document.getElementById("output").innerHTML = "Error: Total items must be a positive number.";
        return;
    }

    // Convert decimal ratio into exact whole-number ratio
    function toWhole(a, b) {
        const aDec = (a.toString().split(".")[1] || "").length;
        const bDec = (b.toString().split(".")[1] || "").length;
        const scale = Math.pow(10, Math.max(aDec, bDec));
        return [a * scale, b * scale];
    }

    let w = want, o = offer;

    if (!Number.isInteger(w) || !Number.isInteger(o)) {
        [w, o] = toWhole(w, o);
    }

    const maxBlocks = Math.floor(items / o);

    if (maxBlocks < 1) {
        document.getElementById("output").innerHTML = `
            <h3>Results</h3>
            You do not have enough items to complete even one trade block.
        `;
        return;
    }

    const lowestBlocks = 1;
    const middleBlocks = Math.floor(maxBlocks / 2);
    const highestBlocks = maxBlocks;

    function trade(blocks) {
        return {
            offerItems: blocks * o,
            receiveItems: blocks * w
        };
    }

    const low = trade(lowestBlocks);
    const mid = trade(middleBlocks);
    const high = trade(highestBlocks);

    const remainder = items - high.offerItems;

    document.getElementById("output").innerHTML = `
      <h3>Results</h3>

      <b>Closest whole-number ratio:</b> ${w}:${o}<br><br>

      <b>Lowest trade (1 block):</b><br>
      Offer: ${low.offerItems}<br>
      Receive: ${low.receiveItems}<br><br>

      <b>Middle trade (${middleBlocks} blocks):</b><br>
      Offer: ${mid.offerItems}<br>
      Receive: ${mid.receiveItems}<br><br>

      <b>Highest trade (${highestBlocks} blocks):</b><br>
      Offer: ${high.offerItems}<br>
      Receive: ${high.receiveItems}<br><br>

      <b>Remainder:</b> ${remainder} items cannot be traded.
    `;
}
