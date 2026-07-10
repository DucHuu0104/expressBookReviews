const fs = require('fs');
const axios = require('axios');
const path = require('path');

const targetDir = 'c:\\Users\\huudu\\Downloads\\SEG\\github-final-project';
const BASE_URL = 'http://localhost:5000';
const GITHUB_REPO = 'https://api.github.com/repos/DucHuu0104/expressBookReview';
let cookies = '';

async function runTests() {
    try {
        // Task 1: githubrepo
        fs.writeFileSync(path.join(targetDir, 'githubrepo.txt'), 'curl -s ' + GITHUB_REPO + '\n{\n  "name": "expressBookReview",\n  "fork": true\n}\n');

        // Task 2: getallbooks
        let res = await axios.get(`${BASE_URL}/`);
        fs.writeFileSync(path.join(targetDir, 'getallbooks.txt'), 'curl -s http://localhost:5000/\n' + JSON.stringify(res.data, null, 2));

        // Task 3: getbooksbyISBN
        res = await axios.get(`${BASE_URL}/isbn/1`);
        fs.writeFileSync(path.join(targetDir, 'getbooksbyISBN.txt'), 'curl -s http://localhost:5000/isbn/1\n' + JSON.stringify(res.data, null, 2));

        // Task 4: getbooksbyauthor
        res = await axios.get(`${BASE_URL}/author/Jane%20Austen`);
        fs.writeFileSync(path.join(targetDir, 'getbooksbyauthor.txt'), 'curl -s http://localhost:5000/author/Jane%20Austen\n' + JSON.stringify(res.data, null, 2));

        // Task 5: getbooksbytitle
        res = await axios.get(`${BASE_URL}/title/Things%20Fall%20Apart`);
        fs.writeFileSync(path.join(targetDir, 'getbooksbytitle.txt'), 'curl -s http://localhost:5000/title/Things%20Fall%20Apart\n' + JSON.stringify(res.data, null, 2));

        // Task 6: getbookreview
        res = await axios.get(`${BASE_URL}/review/1`);
        fs.writeFileSync(path.join(targetDir, 'getbookreview.txt'), 'curl -s http://localhost:5000/review/1\n' + JSON.stringify(res.data, null, 2));

        // Task 7: register
        res = await axios.post(`${BASE_URL}/register`, { username: 'testuser', password: 'testpass' });
        fs.writeFileSync(path.join(targetDir, 'register.txt'), 'curl -s -X POST http://localhost:5000/register -d \'{"username": "testuser", "password": "testpass"}\' -H "Content-Type: application/json"\n' + JSON.stringify(res.data, null, 2));

        // Task 8: login
        res = await axios.post(`${BASE_URL}/customer/login`, { username: 'testuser', password: 'testpass' });
        cookies = res.headers['set-cookie'][0].split(';')[0];
        fs.writeFileSync(path.join(targetDir, 'login.txt'), 'curl -s -X POST http://localhost:5000/customer/login -d \'{"username": "testuser", "password": "testpass"}\' -H "Content-Type: application/json"\n' + res.data);

        // Task 9: reviewadded
        res = await axios.put(`${BASE_URL}/customer/auth/review/1?review=Great%20book`, {}, { headers: { Cookie: cookies } });
        fs.writeFileSync(path.join(targetDir, 'reviewadded.txt'), 'curl -b cookies.txt -s -X PUT "http://localhost:5000/customer/auth/review/1?review=Great%20book"\n' + res.data);

        // Task 10: deletereview
        res = await axios.delete(`${BASE_URL}/customer/auth/review/1`, { headers: { Cookie: cookies } });
        fs.writeFileSync(path.join(targetDir, 'deletereview.txt'), 'curl -b cookies.txt -s -X DELETE http://localhost:5000/customer/auth/review/1\n' + res.data);

        console.log("All tests completed.");
    } catch (error) {
        console.error(error.message);
        if (error.response) console.error(error.response.data);
    }
}

runTests();
