function focusFunc(input) {
    let parent = input.parentNode;
    parent.classList.add("focus");
}

function blurFunc(input) {
    let parent = input.parentNode;
    if (input.value == "") {
        parent.classList.remove("focus");
    }
}