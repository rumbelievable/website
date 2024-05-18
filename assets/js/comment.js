document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const commentsContainer = document.getElementById('commentsContainer');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const comment = commentText.value.trim();

        if (comment) {
            addComment(comment);
            commentText.value = '';
        }
    });

    function addComment(text) {
        const allElement = document.createElement('div');
        allElement.classList.add('bg-body-quandary');

        const commentElement = document.createElement('div');
        const dateElement = document.createElement('div');

        let date = new Date();
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let formattedDate = date.toLocaleDateString('en-US', options);

        commentElement.classList.add('comment');
        commentElement.textContent = text;

        dateElement.classList.add('comment-date');
        dateElement.textContent = formattedDate;

        commentElement.appendChild(dateElement);
        allElement.appendChild(commentElement);

        commentsContainer.appendChild(allElement);
    }
});
