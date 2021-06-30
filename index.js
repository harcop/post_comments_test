const axios = require('axios');
const jsonexport = require('jsonexport');
const fs = require('fs');

async function poster() {
    const _posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const posts = _posts.data;
    const _comments = await axios.get('https://jsonplaceholder.typicode.com/comments');
    const comments = _comments.data;

    const hashBody = {};

    for (const comment of comments) {
        const { body, postId } = comment;
        if (!hashBody[postId]) {
            hashBody[postId] = []
        }
        hashBody[postId].push(body)
    }

    for(const post of posts) {
        const { id } = post;
        post.comments = hashBody[id]
    }


    jsonexport(posts, function(err, csv){
        if (err) return console.error(err);
        fs.writeFileSync('posts.csv', csv)
    });
}

poster()
.then(() => {
    console.log('ok')
})
.catch(err => console.log('error', err))