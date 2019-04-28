var database;
$(document).ready(function () {
    console.log("in writer");
    setupFirebase();
    let submitButton = document.getElementById("submitButton");
    let termInput = document.getElementById("term");
    let exitButton = document.getElementById("exit-button");
    removeResult();
    // submitButton.onkeypress = function (event) {
    //     event.preventDefault();
    //     console.log("aksjef")
    //     console.log(event);
    //     if (event.keyCode === 13) {
    //         console.log("enter");
    //         submitButton.click();
    //     }
    // };
    submitButton.onclick = function () {
        removeResult();
        let term = termInput.value;
        console.log(term.length);
        if (term.length > 0) {
            checkWord(term);
            console.log("submit %s", term);
        }
    };
    exitButton.onclick = () => location.href = "index.html";
});

function enterSubmit(event) {
    console.log(event);
    if (event.keyCode === 13) {
        submitButton.click();
    }
}

function removeResult() {
    document.getElementById('submit-result').innerText="";
    document.getElementById('success-icon').style.display="none";
    document.getElementById('fail-icon').style.display="none";
}

function checkWord(word) {
    console.log("checking %s", word);
    axios.post('/checkWord', {params: {word: word}})
        .then((res) => {
            const result = res.data.result;
            console.log("check result: %s", result);
            if (result) {
                database.ref('terms').push(word);
                document.getElementById('submit-result').innerText = "제출되었습니다!";
                document.getElementById('submit-result').style.color = "#1de9b6";
                document.getElementById('success-icon').style.display="block";
                document.getElementById('fail-icon').style.display="none";
            } else {
                document.getElementById('submit-result').innerText = "존재하지 않는 항목입니다.";
                document.getElementById('submit-result').style.color = "#ff5252";
                document.getElementById('success-icon').style.display="none";
                document.getElementById('fail-icon').style.display="block";
            }
        })
}

function setupFirebase() {
    var config = {
        apiKey: "AIzaSyD4Bv6pmrWj3zynIYBSlr0GR1ioCmbrQvA",
        authDomain: "wikiwiki-b0ce6.firebaseapp.com",
        databaseURL: "https://wikiwiki-b0ce6.firebaseio.com",
        projectId: "wikiwiki-b0ce6",
        storageBucket: "wikiwiki-b0ce6.appspot.com",
        messagingSenderId: "239915230249"
    };
    firebase.initializeApp(config);
    console.log(firebase);
    database = firebase.database();
    console.log(database);
}