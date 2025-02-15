let caseSensitive = false;

function updateCaseSensitive() {
    caseSensitive = document.getElementById("caseSensitiveToggle").checked;
}

function updateLineNumbers(textareaId, lineNumbersId) {
    let textarea = document.getElementById(textareaId);
    let lineNumbers = document.getElementById(lineNumbersId);

    let lines = textarea.value.split("\n");
    let lineNumberHTML = "";

    let textareaStyles = window.getComputedStyle(textarea);
    let lineHeight = parseFloat(textareaStyles.lineHeight);
    let paddingTop = parseFloat(textareaStyles.paddingTop);
    let paddingBottom = parseFloat(textareaStyles.paddingBottom);

    let textareaHeight = textarea.clientHeight - paddingTop - paddingBottom;
    let visibleLines = Math.floor(textareaHeight / lineHeight);

    textarea.scrollTop = 0;

    for (let i = 0; i < lines.length; i++) {
        let words = lines[i];
        let span = document.createElement("span");
        span.style.visibility = "hidden";
        span.style.whiteSpace = "pre";
        span.style.font = textareaStyles.font;
        span.style.lineHeight = textareaStyles.lineHeight;
        span.textContent = words || " ";
        document.body.appendChild(span);

        let wrappedLines = Math.ceil(span.offsetWidth / textarea.clientWidth);
        document.body.removeChild(span);

        for (let j = 0; j < wrappedLines; j++) {
            if (j === 0) {
                lineNumberHTML += (i + 1) + "\n";
            } else {
                lineNumberHTML += " " + "\n";
            }
        }
    }

    lineNumbers.textContent = lineNumberHTML;
}

function syncScroll(textareaId, lineNumbersId) {
    let textarea = document.getElementById(textareaId);
    let lineNumbers = document.getElementById(lineNumbersId);
    lineNumbers.scrollTop = textarea.scrollTop;
}

function escapeHTML(text) {
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// function compareText() {
//     let original = document.getElementById("original").value;
//     let compared = document.getElementById("compared").value;

//     let dmp = new diff_match_patch();

//     // Adjust case-sensitivity based on toggle
//     if (!caseSensitive) {
//         original = original.toLowerCase();
//         compared = compared.toLowerCase();
//     }

//     let diff = dmp.diff_main(original, compared);
//     dmp.diff_cleanupSemantic(diff);

//     let resultHTML = '';
//     diff.forEach(function (diff) {
//         if (diff[0] === -1) {
//             resultHTML += `<span class="removed">${escapeHTML(diff[1])}</span>`;
//         } else if (diff[0] === 1) {
//             resultHTML += `<span class="new">${escapeHTML(diff[1])}</span>`;
//         } else {
//             resultHTML += escapeHTML(diff[1]);
//         }
//     });

//     document.getElementById("output").innerHTML = resultHTML;
//     let comparisonSection = document.getElementById("comparison-section");
//    comparisonSection.style.display = "block"; 

//    comparisonSection.scrollIntoView({ behavior: "smooth" });
// }

function compareText() {
    let original = document.getElementById("original").value;
    let compared = document.getElementById("compared").value;

    document.getElementById("empty-text-message").style.display = "none";

    if (!original.trim() || !compared.trim()) {
        document.getElementById("comparison-section").style.display = "none";
        document.getElementById("empty-text-message").style.display = "block";
        return;
    }

    let dmp = new diff_match_patch();

    // Adjust case-sensitivity based on toggle
    if (!caseSensitive) {
        original = original.toLowerCase();
        compared = compared.toLowerCase();
    }

    let diff = dmp.diff_main(original, compared);
    dmp.diff_cleanupSemantic(diff);

    let resultHTML = '';
    diff.forEach(function (diff) {
        if (diff[0] === -1) {
            resultHTML += `<span class="removed">${escapeHTML(diff[1])}</span>`;
        } else if (diff[0] === 1) {
            resultHTML += `<span class="new">${escapeHTML(diff[1])}</span>`;
        } else {
            resultHTML += escapeHTML(diff[1]);
        }
    });

    document.getElementById("output").innerHTML = resultHTML;
    let comparisonSection = document.getElementById("comparison-section");
    comparisonSection.style.display = "block"; 

    comparisonSection.scrollIntoView({ behavior: "smooth" });
}