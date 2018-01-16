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
    getAll () {
      axios.get('/api/authors').then(res => {
        this.authors = res.data
      })

      axios.get('/api/books').then(res => {
        this.books = res.data
      })
    },

    onAuthorSubmit () {
      axios.post('/api/authors', this.author).then(res => {
        this.author.firstName = ''
        this.author.lastName = ''

        this.getAll()
      })
    },

    onBookSubmit () {
      axios.post('/api/books', {
        title: this.book.title,
        author: this.authorId
      }).then(res => {
        this.book.title = ''
        this.authorId = ''

        this.getAll()
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
