/* globals Vue, axios */

new Vue({ // eslint-disable-line
  el: '#app',

  data () {
    return {
      authorId: '',
      authors: [],
      authorSubmit: { firstName: '', lastName: '' },
      authorEdit: { firstName: '', lastName: '' },
      authorShow: { firstName: '', lastName: '', createdAt: '', books: [] },
      authorSubmitError: '',
      authorEditError: '',
      authorModalDetailsActive: false,
      authorModalEditActive: false,
      books: [],
      bookSubmit: {
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

      axios.post('/api/authors', this.authorSubmit)
        .then(res => {
          this.authorSubmit.firstName = ''
          this.authorSubmit.lastName = ''

          this.getAll()
        })
        .catch(err => {
          this.authorSubmitError = err.response.data
        })
    },

    onBookSubmit () {
      const data = { title: this.bookSubmit.title, author: this.authorId }
      this.bookSubmitError = ''

      axios.post('/api/books', data)
        .then(res => {
          this.bookSubmit.title = ''
          this.authorId = ''

          this.getAll()
        })
        .catch(err => {
          this.bookSubmitError = err.response.data
        })
    },

    onAuthorDeleteClick (author) {
      axios.delete(`/api/authors/${author._id}`).then(() => this.getAll())
    },

    onAuthorDetailsClick (author) {
      axios.get(`/api/authors/${author._id}`).then(res => {
        this.authorShow = res.data
        this.authorModalDetailsActive = true
      })
    },

    onAuthorEditClick (author) {
      axios.get(`/api/authors/${author._id}`).then(res => {
        this.authorShow = res.data
        this.authorEdit.firstName = res.data.firstName
        this.authorEdit.lastName = res.data.lastName
        this.authorModalEditActive = true
      })
    },

    onAuthorEditSubmit () {
      const firstName = this.authorEdit.firstName
      const lastName = this.authorEdit.lastName

      axios.put(`/api/authors/${this.authorShow._id}`, { firstName, lastName })
        .then(res => {
          this.authorModalEditActive = false
          this.authorEditError = ''
          this.getAll()
        })
        .catch(err => {
          this.authorEditError = err.response.data
        })
    },

    onDeleteBookClick (book) {
      axios.delete(`/api/books/${book._id}`).then(res => this.getAll())
    }
  }
})
