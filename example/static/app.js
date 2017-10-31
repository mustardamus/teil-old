/* globals Vue, axios */

Vue.component('app', {
  template: `
    <div>
      <ul v-for="user in users">
        <li>
          {{user.name}}
          <a href="#" @click.prevent="onDeleteClick(user)">Delete</a>
        </li>
      </ul>

      <form @submit.prevent="onSubmit">
        <input type="text" v-model="username" />
      </form>
    </div>
  `,
  data () {
    return {
      users: [],
      username: ''
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      axios.get('/users').then(res => {
        this.users = res.data
      })
    },
    onSubmit () {
      axios.post('/users', { name: this.username }).then(res => {
        this.getUsers()
      })
      this.username = ''
    },
    onDeleteClick (user) {
      axios.delete(`/users/${user._id}`).then(res => {
        this.getUsers()
      })
    }
  }
})

new Vue({ el: '#app' }) // eslint-disable-line
