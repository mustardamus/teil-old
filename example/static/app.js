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
      authorSubmitError: '',
      books: [],
      book: {
        title: '',
        author: ''
      },
      bookSubmitError: ''
    }
  },

  mounted () {
    this.getAll()
  },

  methods: {
    getAll () {
      axios.get('/api/authors').then(res => {
        this.authors = res.data
      })

      axios.get('/api/books').then(res => {
        this.books = res.data
      })
    },

    onAuthorSubmit () {
      this.authorSubmitError = ''

      axios.post('/api/authors', this.author)
        .then(res => {
          this.author.firstName = ''
          this.author.lastName = ''

          this.getAll()
        })
        .catch(err => {
          this.authorSubmitError = err.response.data
        })
    },

    onBookSubmit () {
      const data = { title: this.book.title, author: this.authorId }
      this.bookSubmitError = ''

      axios.post('/api/books', data)
        .then(res => {
          this.book.title = ''
          this.authorId = ''

          this.getAll()
        })
        .catch(err => {
          this.bookSubmitError = err.response.data
        })
    },

    onDeleteAuthorClick (author) {
      axios.delete(`/api/authors/${author._id}`).then(res => this.getAll())
    },

    onDeleteBookClick (book) {
      axios.delete(`/api/books/${book._id}`).then(res => this.getAll())
    }
  }
})
