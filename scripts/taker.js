var database;
var answer;
var answer2;
var currentUser;
$(document).ready(function () {
    console.log("in taker");
    setupFirebase();
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    currentUser = queryString.split("&")[0].split("=")[1];
    console.log(queryString);
    let answerButton = document.getElementById("answerButton");
    let answerInput = document.getElementById("answer");
    let nextButton = document.getElementById("next-button");
    let exitButton = document.getElementById("exit-button");
    removeResult();
    pickWord();
    answerInput.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            answerButton.click();
        }
    });
    answerButton.onclick = function () {
        let term = answerInput.value.toLowerCase();
        if (term.length > 0) {
            if (term === answer || term === answer2) {
                document.getElementById('answerResult').style.display = "block";
                document.getElementById('answerResult').innerText = "정답입니다!";
                scoreUp();
                document.getElementById('answerResult').style.color = "#00bfa5";
                document.getElementById('happy-face').style.display = "block";
                document.getElementById('sad-face').style.display = "none";
                pickWord();
                console.log("correct: %s", term);
            } else {
                document.getElementById('answerResult').style.display = "block";
                document.getElementById('answerResult').innerText = "다시 도전하세요.";
                document.getElementById('answerResult').style.color = "#ff5252";
                document.getElementById('happy-face').style.display = "none";
                document.getElementById('sad-face').style.display = "block";
                console.log("wrong: %s", term);
            }
        }
    };
    nextButton.onclick = () => {
        removeResult();
        pickWord();
    };
    exitButton.onclick = () => location.href = "index.html";
});

function removeResult() {
    document.getElementById('answerResult').style.display = "none";
    document.getElementById('happy-face').style.display = "none";
    document.getElementById('sad-face').style.display = "none";
    document.getElementById('answer').value = "";
    document.getElementById('question').innerText = "문제 생성중..";
}

function scoreUp() {
    var currentScore = -1;
    database.ref('users/' + currentUser).once('value').then((snapshot) => {
        console.log(snapshot.val().score);
        currentScore = snapshot.val().score + 1;
        var updates = {};
        updates['/users/' + currentUser + "/score"] = currentScore;
        database.ref().update(updates);
    });
}

function crawlWord(word) {
    // console.log("crawling %s", word);
    axios.post('/crawlWord', {params: {word: word}})
        .then((res) => {
            const question = res.data.value;
            answer = res.data.answer;
            answer2 = res.data.answer2;
            // console.log("q: %s, ans: %s", question, answer);
            document.getElementById('question').innerText = question;
        })

}

function pickWord() {
    let words = [];
    let currentRef = database.ref('terms');
    console.log(currentRef);
    currentRef.once('value').then(function (snapshot) {
        console.log(snapshot);
        snapshot.forEach(function (childSnapshot) {
            // console.log("load", childSnapshot.val());
            words.push(childSnapshot.val());
        });
    }).then(function () {
        let randIndex = Math.floor(Math.random() * words.length);
        // console.log(words[randIndex]);
        return words[randIndex];
    }, function (error) {
        console.log(error);
    }).then(function (word) {
        // console.log(word);
        crawlWord(word);
        removeResult();
    });
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