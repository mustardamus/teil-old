# Teil Documentation

## Controllers

Bli bla blubb

[Read more about Controllers](./controllers.md)


To get rid of linux ENOSP errors for chokidar:

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

From https://github.com/facebook/jest/issues/3254#issuecomment-297869853
