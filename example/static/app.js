/* globals Vue, axios */

new Vue({ // eslint-disable-line
  el: '#app',

  data () {
    return {
      authorId: '',
      authors: [],
      author: {
        firstName: '',
        lastName: '',
        books: []
      },
      books: [],
      book: {
        title: '',
        author: ''
      }
    }
  },

  mounted () {
    this.getAll()
  },

  methods: {
    getAuthors () {
      axios.get('/authors').then(res => {
        this.authors = res.data
      })
    },

    getBooks () {
      axios.get('/books').then(res => {
        this.books = res.data
      })
    },

    getAll () {
      this.getAuthors()
      this.getBooks()
    },

    onAuthorSubmit () {
      axios.post('/authors', this.author).then(res => {
        this.author.firstName = ''
        this.author.lastName = ''

        this.getAll()
      })
    },

    onBookSubmit () {
      axios.post('/books', {
        title: this.book.title,
        author: this.authorId
      }).then(res => {
        this.book.title = ''
        this.authorId = ''

        this.getAll()
      })
    },

    onDeleteAuthorClick (author) {
      axios.delete(`/authors/${author._id}`).then(res => {
        this.getAuthors()
      })
    },

    onDeleteBookClick (book) {
      axios.delete(`/books/${book._id}`).then(res => {
        this.getBooks()
      })
    }
  }
})
